import Link from 'next/link';
import AdminGuard from '@/components/admin/AdminGuard';
import LogoutButton from '@/components/admin/LogoutButton';
export default function AdminLayout({children}:{children:React.ReactNode}){return <AdminGuard><div className="admin-shell"><div className="container admin-grid"><aside className="admin-nav"><div className="brand" style={{color:'white',marginBottom:16}}>tutorin CMS</div><Link href="/admin">Dashboard</Link><Link href="/admin/programs">Program</Link><Link href="/admin/tryouts">Tryout</Link><Link href="/admin/ebooks">Ebook</Link><Link href="/admin/articles">Blog</Link><Link href="/admin/users">Pengguna</Link><Link href="/">← Website</Link><LogoutButton /></aside><section>{children}</section></div></div></AdminGuard>}
