function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        calc<span>electricity</span>
      </div>

      <div className="footer-description">
        Electricity cost calculator
      </div>

      <div className="footer-year">
        © {new Date().getFullYear()}
      </div>
    </footer>
  );
}

export default Footer;