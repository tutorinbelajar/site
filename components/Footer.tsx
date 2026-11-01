export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><div className="brand">tutorin</div><p>Belajar lebih terarah, dengan program yang sesuai kebutuhan.</p></div>
        <div><strong>Program</strong><a href="/program/privat">Privat</a><a href="/program/kelas">Kelas</a></div>
        <div><strong>Belajar</strong><a href="/tryout">Tryout</a><a href="/ebook">Ebook</a><a href="/blog">Blog</a></div>
        <div><strong>Admin</strong><a href="/admin">CMS Tutorin</a></div>
      </div>
      <div className="container copyright">© {new Date().getFullYear()} Tutorin. All rights reserved.</div>
    </footer>
  );
}
