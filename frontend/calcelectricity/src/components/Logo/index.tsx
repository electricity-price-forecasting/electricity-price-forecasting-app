import './index.css'

export type LogoVariant = 'default' | 'light'

interface LogoProps {
  variant?: LogoVariant
}

export default function Logo({ variant = 'default' }: LogoProps) {
  const isLight = variant === 'light'
  const diamondFill = isLight ? '#ffffff' : 'var(--color-primary)'

  return (
    <div className={`logo ${isLight ? 'logo--light' : ''}`}>
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="16" y="6" width="8" height="8" rx="2" transform="rotate(45 20 10)" fill={diamondFill} opacity="0.55" />
        <rect x="16" y="26" width="8" height="8" rx="2" transform="rotate(45 20 30)" fill={diamondFill} opacity="0.55" />
        <rect x="6" y="16" width="8" height="8" rx="2" transform="rotate(45 10 20)" fill={diamondFill} opacity="0.55" />
        <rect x="26" y="16" width="8" height="8" rx="2" transform="rotate(45 30 20)" fill={diamondFill} opacity="0.55" />
        <rect x="16" y="16" width="8" height="8" rx="2" transform="rotate(45 20 20)" fill={diamondFill} />
      </svg>
      <span className="logo__text">Voltio</span>
    </div>
  )
}