import './index.css'

export default function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="container cta-banner__inner">
        <h2 className="cta-banner__title">    
          Start forecasting electricity costs today.
        </h2>
        <p className="cta-banner__text">
        Connect your meter in 5 minutes — the first weekly forecast
          will be sent to your email immediately after registration.
        </p>
        <a href="#signup" className="btn btn--light">Create an account</a>
      </div>
    </section>
  )
}