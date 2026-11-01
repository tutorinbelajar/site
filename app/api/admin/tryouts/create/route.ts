import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';

const githubApi = 'https://api.github.com';

type Payload = {
  title: string;
  slug: string;
  category?: string;
  level?: string;
  subject?: string;
  duration_minutes?: number | null;
  question_count?: number | null;
  status?: 'draft' | 'published' | 'archived';
};

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} belum diatur di Vercel.`);
  return value;
}

async function github(pathname: string, init: RequestInit = {}) {
  const token = env('GITHUB_TOKEN');
  const response = await fetch(`${githubApi}${pathname}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || `GitHub API error ${response.status}`);
  }
  return data;
}

async function collectTemplateFiles(dir: string, base = dir): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectTemplateFiles(absolute, base));
    else files.push(path.relative(base, absolute).replaceAll(path.sep, '/'));
  }
  return files;
}

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization');
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ error: 'Sesi admin tidak ditemukan.' }, { status: 401 });

    const supabase = createClient(env('NEXT_PUBLIC_SUPABASE_URL'), env('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) return NextResponse.json({ error: 'Sesi login tidak valid.' }, { status: 401 });

    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userData.user.id)
      .maybeSingle();
    if (adminError || !admin) return NextResponse.json({ error: 'Akun bukan admin Tutorin.' }, { status: 403 });

    const body = (await request.json()) as Payload;
    if (!body.title?.trim() || !body.slug?.trim()) {
      return NextResponse.json({ error: 'Judul dan slug wajib diisi.' }, { status: 400 });
    }

    const safeSlug = body.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    if (!safeSlug) return NextResponse.json({ error: 'Slug tidak valid.' }, { status: 400 });

    const category = body.category?.trim().toLowerCase() || 'lainnya';
    const level = body.level?.trim().toLowerCase() || 'umum';
    const folder = `public/tryouts/${category}/${level}/${safeSlug}`;
    const owner = env('GITHUB_OWNER');
    const repo = env('GITHUB_REPO');
    const branch = process.env.GITHUB_BRANCH || 'main';
    const templateDir = path.join(process.cwd(), 'public', 'tryouts', '_template');
    const templateFiles = await collectTemplateFiles(templateDir);

    // Create every template file in a separate GitHub folder. GitHub creates the folder implicitly.
    for (const relative of templateFiles) {
      const source = await fs.readFile(path.join(templateDir, relative), 'utf8');
      let content = source;
      if (relative === 'manifest.json') {
        const manifest = {
          slug: safeSlug,
          title: body.title.trim(),
          category,
          level: body.level || '',
          subject: body.subject || '',
          duration_minutes: body.duration_minutes ?? null,
          question_count: body.question_count ?? 0,
          status: body.status || 'draft',
        };
        content = JSON.stringify(manifest, null, 2) + '\n';
      }
      const encoded = Buffer.from(content, 'utf8').toString('base64');
      await github(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${folder}/${relative}`, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Create TO ${body.title.trim()}`,
          content: encoded,
          branch,
        }),
      });
    }

    const deploymentUrl = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/${folder.replace(/^public\//, '')}/index.html` : null;
    const { data: inserted, error: insertError } = await supabase.from('tutorin_tryouts').insert({
      title: body.title.trim(),
      slug: safeSlug,
      category: body.category || null,
      level: body.level || null,
      subject: body.subject || null,
      duration_minutes: body.duration_minutes ?? 0,
      question_count: body.question_count ?? 0,
      github_path: folder,
      deployment_url: deploymentUrl,
      status: body.status || 'draft',
    }).select('*').single();

    if (insertError) {
      return NextResponse.json({ error: `Folder GitHub berhasil dibuat, tetapi metadata Supabase gagal disimpan: ${insertError.message}`, folder }, { status: 500 });
    }

    return NextResponse.json({ data: inserted, folder });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Gagal membuat TO.' }, { status: 500 });
  }
}
