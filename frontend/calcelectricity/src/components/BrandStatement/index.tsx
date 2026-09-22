import heroImage from '../../assets/dam-aerial.jpg'
import './index.css'

export default function BrandStatement() {
  return (
    <section className="brand-statement" id="brand">
      <div className="container">
        <span className="brand-statement__kicker">We are</span>
        <h2 className="brand-statement__word" aria-label="Voltio">
          {/* Звичайний сірий варіант */}
          <span className="brand-statement__word-base">Voltio</span>

          {/* Варіант із заливкою фото — за замовчуванням прозорий,
              з'являється при наведенні на .brand-statement__word */}
          <span
            className="brand-statement__word-photo"
            style={{ backgroundImage: `url(${heroImage})` }}
            aria-hidden="true"
          >
            Voltio
          </span>
        </h2>
      </div>
    </section>
  )
}