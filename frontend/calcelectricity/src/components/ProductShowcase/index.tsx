import SectionHeader from '../SectionHeader'
import dashboardImg from '../../assets/dashboard.png'
import './index.css'

export default function ProductShowcase() {
  return (
    <section className="showcase section" id="product">
      <div className="container">
        <SectionHeader
          title={'Know what changed.\nUnderstand what matter'}
          text="Monitor European electricity-price forecasts, understand revisions and evaluate confidence — all in one place "
          ctaLabel="Open dashboard >"
          ctaHref="#features"
        />
        <a href="#calculator" className="hero-button">
        Open dashboard
        </a>
        <div className="showcase__frame">
          <img
            src={dashboardImg}
            alt="Voltio panel with energy price forecast by hours"
          />
        </div>
      </div>
    </section>
  )
}