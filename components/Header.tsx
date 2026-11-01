import Link from "next/link";

const navItems = [
  ["Home", "/"],
  ["Bimbel", "/bimbel"],
  ["Ebook", "/ebook"],
  ["Tryout", "/tryout"],
  ["Blog", "/blog"],
];

export function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/">tutorin</Link>
        <nav className="nav" aria-label="Navigasi utama">
          {navItems.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}
        </nav>
        <Link className="button button-primary nav-consult" href="/konsultasi">Konsultasi</Link>
        <details className="mobile-menu">
          <summary aria-label="Buka menu navigasi"><span></span><span></span><span></span></summary>
          <nav aria-label="Navigasi mobile">
            {navItems.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}
            <Link className="mobile-consult" href="/konsultasi">Konsultasi</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
