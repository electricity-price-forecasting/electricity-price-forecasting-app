import { useEffect, useState } from 'react'
import Logo from '../Logo/index'
import './index.css'

interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Product', href: '#product' },
  { label: 'Opportunities', href: '#features' },
  { label: 'Taxes', href: '#insights' },
  { label: 'Company', href: '#footer' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <a href="#top" aria-label="Voltio — на головну">
          <Logo />
        </a>

        <nav className="header__nav" aria-label="Основна навігація">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="header__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <a href="#login" className="btn btn--ghost">Sign In</a>
          <a href="#product" className="btn btn--primary">Try for free</a>
        </div>

        <button
          className="header__burger"
          aria-label="Open the menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {isMenuOpen && (
        <div className="header__mobile">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#product" className="btn btn--primary" onClick={() => setIsMenuOpen(false)}>
            Try for free
          </a>
        </div>
      )}
    </header>
  )
}
