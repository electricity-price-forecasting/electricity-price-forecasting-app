import Logo from '../Logo/index'
import './index.css'

interface FooterColumn {
  title: string
  links: string[]
}

const COLUMNS: FooterColumn[] = [
  { title: 'Explore', links: ['Price Forecast', 'Day-Ahead', 'Intraday', 'Forward Curve', 'Market Overview', 'Countries & Markets'] },
  { title: 'Resources', links: ['Energy Insights', 'Market Reports', 'Price Guides', 'Methodology', 'FAQs'] },
  { title: 'Documentation', links: ['Getting started', 'Methodology', 'Data Sources', 'API Documentation'] },
  { title: 'Company', links: ['About Us', 'Contact', 'Careers', 'Partners'] },
  { title: 'Legal', links: ['Privacy policy', 'Terms of Service', 'Cookie Policy', 'Data Usage'] },
]

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo variant="light" />
          <p className="footer__tagline">
          Transparent electricity price forecast for homes and businesses.
          </p>
        </div>

        <div className="footer__columns">
          {COLUMNS.map((col) => (
            <div className="footer__column" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="container footer__bottom">
        <span>© 2026 Voltio. Усі права захищено.</span>
        <span>Зроблено в Україні 🇺🇦</span>
      </div> */}
    </footer>
  )
}