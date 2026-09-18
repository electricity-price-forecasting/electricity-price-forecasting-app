import './index.css'

export default function BrandStatement() {
  return (
    <section className="brand-statement section">
      <span className="brand-statement__kicker" text-align="center">We are</span>
        <h2 className="brand-statement__word" aria-label="Voltio" text-align="center">Voltio</h2>
      <div className="container brand-statement__inner">
        
        <h4>Know what changed. Understand what matter</h4>

        <p className="brand-statement__text">
        Monitor European electricity-price forecasts, understand revisions and evaluate confidence —all in one place 
        </p>
      </div>
    </section>
  )
}