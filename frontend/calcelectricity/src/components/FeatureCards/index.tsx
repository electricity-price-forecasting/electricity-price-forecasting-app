import SectionHeader from '../SectionHeader'
import './index.css'

interface CardItem {
  icon: string
  title: string
  text: string
}

const CARDS: CardItem[] = [
  { icon: '🔌', title: 'Connected data sources', text: 'Over 30 exchanges and network operators in a single stream' },
  { icon: '📊', title: 'Role-based workspaces', text: 'Візуалізація попиту й генерації в реальному часі' },
  { icon: '🔔', title: 'Live forecast revisions', text: 'Миттєві сповіщення про аномалії та пікові ціни' },
]

/** Проста лінія-графік намальована SVG-полілінією — без зайвих бібліотек */
function TrendGraphic() {
  return (
    // <svg className="trend-graphic" viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true">
    //   <polyline
    //     points="0,120 60,110 120,130 180,90 240,100 300,60 360,70 420,40 480,55 540,25 600,35"
    //     fill="none"
    //     stroke="var(--color-primary)"
    //     strokeWidth="3"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   />
    //   <polygon
    //     points="0,120 60,110 120,130 180,90 240,100 300,60 360,70 420,40 480,55 540,25 600,35 600,160 0,160"
    //     fill="var(--color-primary)"
    //     opacity="0.08"
    //   />
    // </svg>
    <img src="./src/assets/electricity-flow-dashboard 1.png"/>
  )
}

export default function FeatureCards() {
  return (
    <section className="feature-cards section section--soft" id="features">
      <div className="container">
        <SectionHeader
          title="Everything required to move 
          from forecast to action"
          text="GridScope brings revisions, drivers, uncertainty and market impact into one evidence-backed workflow"
          ctaLabel="Get started >"
          ctaHref="#insights"
        />

        <div className="feature-cards__grid">
          {CARDS.map((card) => (
            <div className="feature-card" key={card.title}>
              <span className="feature-card__icon" aria-hidden="true">{card.icon}</span>
              <h3 className="feature-card__title">{card.title}</h3>
              <p className="feature-card__text">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="feature-cards__wide">
          <TrendGraphic />
          <div className="feature-cards__wide-caption">
            <h3>Electricity-price dashboard</h3>
            {/* <p>Renews every hour based on fresh stocks datas</p> */}
          </div>
        </div>
      </div>
    </section>
  )
}