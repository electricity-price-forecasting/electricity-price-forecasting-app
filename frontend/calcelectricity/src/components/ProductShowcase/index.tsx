import SectionHeader from '../SectionHeader'
import dashboardImg from '../../assets/dashboard.png'
import './index.css'

export default function ProductShowcase() {
  return (
    <section className="showcase section" id="product">
      <div className="container">
        <SectionHeader
          title="Know what changed.
          Understand what matter"
          text="Monitor European electricity-price forecasts, understand revisions and evaluate confidence —all in one place "
          ctaLabel="Open dashboard >"
          ctaHref="#features"
        />

        <div className="showcase__frame">
          <img
            src={dashboardImg}
            alt="Панель Voltio з прогнозом ціни на електроенергію по годинах"
          />
        </div>
      </div>
    </section>
  )
}