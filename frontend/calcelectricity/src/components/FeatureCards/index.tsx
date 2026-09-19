import SectionHeader from '../SectionHeader'
import windmillIcon from '../../icons/windmill.svg'
import peopleIcon from '../../icons/people.svg'
import fireIcon from '../../icons/fire.svg'
import cardLgImg from '../../assets/Card lg.png'
import './index.css'

export default function FeatureCards() {
  return (
    <section className="feature-cards section section--soft" id="features">
      <div className="container">
        <SectionHeader
          title={'Everything required to move\nfrom forecast to action'}
          text="GridScope brings revisions, drivers, uncertainty and market impact into one evidence-backed workflow"
          ctaLabel="Get started >"
          ctaHref="#insights"
        />

        <div className="feature-cards__grid">
          {/* Connected data sources */}
          <div className="feature-card">
            <div className="feature-card__visual feature-card__visual--icons">
              <span className="icon-chip icon-chip--blue">
                <img src={windmillIcon} alt="" />
              </span>
              <span className="icon-chip icon-chip--purple">
                <img src={peopleIcon} alt="" />
              </span>
              <span className="icon-chip icon-chip--red">
                <img src={fireIcon} alt="" />
              </span>
            </div>
            <h3 className="feature-card__title">Connected data sources</h3>
            <p className="feature-card__text">
              Over 30 exchanges and network operators in a single stream
            </p>
          </div>

          {/* Role-based workspaces */}
          <div className="feature-card">
            <div className="feature-card__visual feature-card__visual--workspace">
              <div className="mini-chart">
                <svg viewBox="0 0 220 70" preserveAspectRatio="none" aria-hidden="true">
                  <polyline
                    points="0,40 30,32 60,20 90,26 120,34 150,40 180,36 220,38"
                    fill="none"
                    stroke="#7c93ff"
                    strokeWidth="2"
                  />
                </svg>
                <span className="role-tag role-tag--analyst">Analyst</span>
                <span className="role-tag role-tag--operator">Operator</span>
                <span className="role-tag role-tag--trader">Trader</span>
              </div>
            </div>
            <h3 className="feature-card__title">Role-based workspaces</h3>
            <p className="feature-card__text">
              Tailored views for traders, analysts and operations teams
            </p>
          </div>

          {/* Live forecast revisions */}
          <div className="feature-card">
            <div className="feature-card__visual feature-card__visual--revisions">
              <div className="rev-row">
                <span className="rev-row__icon rev-row__icon--amber">☀</span>
                <span className="rev-row__lines">
                  <span className="mock-line mock-line--w70" />
                  <span className="mock-line mock-line--w50" />
                </span>
              </div>
              <div className="rev-row">
                <span className="rev-row__icon rev-row__icon--rose">↗</span>
                <span className="rev-row__lines">
                  <span className="mock-line mock-line--w80" />
                  <span className="mock-line mock-line--w40" />
                </span>
              </div>
              <div className="rev-row rev-row--active">
                <span className="rev-row__icon rev-row__icon--blue">↘</span>
                <span className="rev-row__lines">
                  <span className="mock-line mock-line--w60" />
                  <span className="mock-line mock-line--w35" />
                </span>
              </div>
            </div>
            <h3 className="feature-card__title">Live forecast revisions</h3>
            <p className="feature-card__text">
              See every update the moment new market data lands
            </p>
          </div>
        </div>

        <div className="feature-cards__wide">
          <img
            className="feature-cards__wide-img"
            src={cardLgImg}
            alt="Картка панелі Electricity-price dashboard з графіком прогнозу ціни"
          />
        </div>
      </div>
    </section>
  )
}