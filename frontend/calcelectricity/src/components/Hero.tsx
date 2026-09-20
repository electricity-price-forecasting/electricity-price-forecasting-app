// function Hero() {
//   return (
//     <section className="hero">
//       {/* <div className="hero-eyebrow">
//         European electricity-price intelligence
//         <br />
//         intelligence
//       </div> */}

//       <div className="hero-decorative-text">
//       European electricity price intelligence
//       </div>

//       <div className="hero-content">
//         <p className="hero-kicker">Energy calculator</p>

//         <h1>
//           Calculate your
//           <br />
//           electricity cost.
//         </h1>

//         <p className="hero-description">
//           Estimate your daily, monthly and annual electricity
//           expenses in seconds.
//         </p>


//       </div>
//     </section>
//   );
// }

// export default Hero;

import heroImage from '../assets/dam-aerial.jpg'
import './Hero.css'

interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Products', href: '#product' },
  { label: 'How it works', href: 'https://arksight.io/' },
  { label: 'Coverage', href: '#footer' },
]

function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero__image" src={heroImage} alt="Гідроелектростанція — гребля з водосховищем" />
      <div className="hero__overlay" aria-hidden="true" />

      <nav className="hero__nav" aria-label="Основна навігація">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="hero__nav-link">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="container hero__content">
        <h1 className="hero__title">
          European
          <br />
          electricity-price
          <br />
          intelligence
        </h1>

        <p className="hero__subtitle">
          Explainable electricity-price forecasting for European
          traders, analysts and asset operators
        </p>

        <a href="#product" className="btn btn--light hero__cta">
          Explore the market
        </a>
      </div>

      <a href="#brand" className="hero__scroll" aria-label="Прокрутити до наступної секції">
        Explore
        <span className="hero__scroll-arrow" aria-hidden="true">⌄</span>
      </a>
    </section>
  );
}

export default Hero;
