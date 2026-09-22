import './index.css'

interface SectionHeaderProps {
  title: string
  text?: string
  ctaLabel?: string
  ctaHref?: string
}

export default function SectionHeader({ title, text, ctaLabel, ctaHref }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="section-header__text">
        <span className="section-header__marker" aria-hidden="true" />
        <h2 className="section-header__title">{title}</h2>
        {text && <p className="section-header__desc">{text}</p>}
      </div>
      {ctaLabel && ctaHref && (
        <a href={ctaHref} className="btn btn--primary section-header__cta">
          {ctaLabel}
        </a>
      )}
    </div>
  )
}