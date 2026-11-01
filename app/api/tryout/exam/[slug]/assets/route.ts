import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const allowedFiles = new Set(['TO SD 2.6.png', 'TO SD 2.8.png', 'TO SD 2.15.png', 'TO SD 2.18.png']);

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filename = request.nextUrl.searchParams.get('file') || '';

  if (slug !== 'tka-sd-matematika-paket-2' || !allowedFiles.has(filename)) {
    return new NextResponse('Aset tidak ditemukan.', { status: 404 });
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      return new NextResponse('Supabase belum dikonfigurasi.', { status: 503 });
    }

    const jar = await cookies();
    const sb = createServerClient(url, key, {
      cookies: {
        getAll() {
          return jar.getAll();
        },
        setAll(values) {
          try {
            values.forEach(({ name, value, options }) => jar.set(name, value, options));
          } catch {
            // Cookie write may be unavailable in this context.
          }
        },
      },
    });

    const {
      data: { user },
    } = await sb.auth.getUser();
    const code = jar.get(`tutorin_exam_${slug}`)?.value || '';

    if (!user || !code) {
      return new NextResponse('Akses ditolak.', { status: 401 });
    }

    const { data: exam } = await sb
      .from('tutorin_tryouts')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    const { data: registration } = exam
      ? await sb
          .from('tutorin_tryout_registrations')
          .select('id')
          .eq('user_id', user.id)
          .eq('tryout_id', exam.id)
          .eq('unique_code', code)
          .eq('status', 'approved')
          .maybeSingle()
      : { data: null };

    if (!registration) {
      return new NextResponse('Akses tidak sah.', { status: 403 });
    }

    const bytes = await readFile(path.join(process.cwd(), 'private-exams', slug, filename));

    // Convert Node.js Buffer to a web-compatible Uint8Array for NextResponse BodyInit.
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  } catch {
    return new NextResponse('Aset tidak tersedia.', { status: 404 });
  }
}
