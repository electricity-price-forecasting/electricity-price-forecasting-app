import SectionHeader from '../SectionHeader'
import monitorImg from '../../assets/Container.png'
import explainImg from '../../assets/Explain.png'
import actImg from '../../assets/Act.png'
import './index.css'

interface WorkflowCard {
  id: string
  title: string
  description: string
  image: string
}

const CARDS: WorkflowCard[] = [
  { id: 'monitor', title: 'Monitor', description: 'What changed since the previous forecast?', image: monitorImg },
  { id: 'explain', title: 'Explain', description: 'Which drivers caused the movement?', image: explainImg },
  { id: 'act', title: 'Act', description: 'Does the change require a decision now?', image: actImg },
]

export default function MetricCards() {
  return (
    <section className="metrics-section section" id="complex-market-data">
      <div className="container">
        <SectionHeader
          title="Complex market data"
          text="The experience is structured around the questions electricity-market users ask under time pressure"
          ctaLabel="Try workflow >"
          ctaHref="#complex-market-data"
        />

        <div className="metrics-grid">
          {CARDS.map((card) => (
            <div className="metric-card" key={card.id}>
              <div className="metric-card__visual">
                <img src={card.image} alt="" />
              </div>
              <div className="metric-card__body">
                <h3 className="metric-card__title">{card.title}</h3>
                <p className="metric-card__text">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
