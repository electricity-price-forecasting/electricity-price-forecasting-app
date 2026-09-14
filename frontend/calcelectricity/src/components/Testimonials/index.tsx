import './index.css'

interface Testimonial {
  name: string
  role: string
  quote: string
  color: string
}

const TESTIMONIALS: Testimonial[] = [
  { name: 'James R.', role: 'Energy Trader', quote: 'The forecasts give us a much clearer picture of where prices are heading.  We can spot potential peaks earlier and make decisions with more confidence.', color: '#22c55e' },
  { name: 'Sarah M.', role: 'Procurement Manager', quote: 'Instead of relying on historical averages, we can now see what the market is likely to do next. It’s made our energy purchasing decisions more informed.', color: '#3b82f6' },
  { name: 'Daniel K.', role: 'Energy Analyst', quote: 'I used to spend hours combining market data from different sources. Having forecasts, trends and price drivers in one place has significantly streamlined my analysis.', color: '#ef4444' },
  { name: 'Emma T.', role: 'Renewable Energy Developer', quote: 'Understanding when electricity prices are likely to rise or fall helps us plan around generation and maximise the value of our renewable assets.', color: '#f59e0b' },
  { name: 'Olivia S.', role: 'Energy Consultant', quote: 'What I like most is the combination of prediction and context. It doesn’t just show you where prices might go — it helps you understand why.', color: '#6c3ce0' },
  { name: 'Michael P.', role: 'Operations Manager', quote: 'The visual forecasts make complex energy-market data much easier to understand. Our team can quickly see what’s happening and act before prices move.', color: '#14151a' },
]

export default function Testimonials() {
  return (
    <section className="testimonials section section--soft" id="trust">
      <div className="container">
        <div className="testimonials__header">
          <h2 className="testimonials__title">
            Trusted by teams
          </h2>
          {/* <a href="#footer" className="btn btn--primary">Усі відгуки</a> */}
        </div>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((item) => (
            <div className="testimonial-card" key={item.name}>
              <div className="testimonial-card__head">
                <span
                  className="testimonial-card__avatar"
                  style={{ background: item.color }}
                  aria-hidden="true"
                >
                  {item.name.charAt(0)}
                </span>
                <div>
                  <span className="testimonial-card__name">{item.name}</span>
                  <span className="testimonial-card__role">{item.role}</span>
                </div>
              </div>
              <p className="testimonial-card__quote">«{item.quote}»</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}