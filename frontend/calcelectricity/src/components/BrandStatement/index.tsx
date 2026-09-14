import './index.css'

export default function BrandStatement() {
  return (
    <section className="brand-statement section">
      <div className="container brand-statement__inner">
        <span className="brand-statement__kicker">Our mission</span>
        <h2 className="brand-statement__word" aria-label="Voltio">Voltio</h2>
        <p className="brand-statement__text">
        Make the price of electricity as clear and predictable as the weather forecast — so that everyone can plan their consumption in advance.
        </p>
      </div>
    </section>
  )
}