import './index.css'

function IconGithub() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function IconYoutube() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.9a3.02 3.02 0 0 0-2.12-2.14C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.38.46A3.02 3.02 0 0 0 .5 6.9 31.6 31.6 0 0 0 0 12.5c0 1.87.17 3.74.5 5.6a3.02 3.02 0 0 0 2.12 2.14c1.88.46 9.38.46 9.38.46s7.5 0 9.38-.46a3.02 3.02 0 0 0 2.12-2.14c.33-1.86.5-3.73.5-5.6 0-1.87-.17-3.74-.5-5.6ZM9.6 16.1V8.9l6.27 3.6-6.27 3.6Z" />
    </svg>
  )
}

function IconLinkedin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5ZM8 19H5V9h3v10ZM6.5 7.73A1.75 1.75 0 1 1 6.5 4.23a1.75 1.75 0 0 1 0 3.5ZM20 19h-3v-5.6c0-1.34-.02-3.06-1.87-3.06-1.86 0-2.15 1.46-2.15 2.96V19h-3V9h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V19Z" />
    </svg>
  )
}

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
          <span className="footer__logo">Voltio</span>
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

      <div className="container footer__bottom">
        <div className="footer__social">
          <a href="https://github.com/electricity-price-forecasting/electricity-price-forecasting-app.git" aria-label="GitHub"><IconGithub /></a>
          <a href="#" aria-label="YouTube"><IconYoutube /></a>
          <a href="#" aria-label="LinkedIn"><IconLinkedin /></a>
        </div>
      </div>
    </footer>
  )
}