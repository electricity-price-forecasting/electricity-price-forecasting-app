function Header() {
  return (
    <header className="header">
      <a href="#" className="logo">
        calc<span>electricity</span>
      </a>

      <nav className="navigation">
        <a href="#calculator">Calculator</a>
        <a href="#formula">How it works</a>
      </nav>
    </header>
  );
}

export default Header;