import React from 'react';
import styles from './Landingpage.scss';
import type { FeatureCard } from '../../types/landing';

const FEATURES_DATA: FeatureCard[] = [
  {
    id: 'data-sources',
    title: 'Connected data sources',
    type: 'small',
    previewType: 'icons',
  },
  {
    id: 'workspaces',
    title: 'Role-based workspaces',
    type: 'small',
    previewType: 'chart',
  },
  {
    id: 'revisions',
    title: 'Live forecast revisions',
    type: 'small',
    previewType: 'list',
  },
  {
    id: 'dashboard',
    title: 'Electricity-price dashboard',
    type: 'large',
    previewType: 'dashboard',
  },
];

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <header className={styles.header}>
            <div className={styles.logo}>Voltio</div>
            <nav className={styles.nav}>
              <a href="#products">Products</a>
              <a href="#how-it-works">How it works</a>
              <a href="#coverage">Coverage</a>
            </nav>
          </header>

          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              European electricity-price intelligence
            </h1>
            <p className={styles.heroSubtitle}>
              Explainable electricity-price forecasting for European traders, analysts and asset operators.
            </p>
            <button type="button" className={styles.btnPrimary}>
              Explore the market
            </button>
          </div>
        </div>
      </section>

      {/* GridScope Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.headerText}>
            <h2>Everything required to move from forecast to action.</h2>
            <p>
              GridScope brings revisions, drivers, uncertainty and market impact into one evidence-backed workflow.
            </p>
          </div>
          <button type="button" className={styles.btnAction}>
            Get started &rarr;
          </button>
        </div>

        <div className={styles.featuresGrid}>
          {FEATURES_DATA.map((feature) => (
            <article
              key={feature.id}
              className={`${styles.card} ${
                feature.type === 'large' ? styles.cardLarge : styles.cardSmall
              }`}
            >
              <div className={styles.cardPreview}>
                {feature.previewType === 'icons' && (
                  <div className={styles.iconGroup}>
                    <span className={styles.badgeIcon} role="img" aria-label="leaf">🌱</span>
                    <span className={styles.badgeIcon} role="img" aria-label="gear">⚙️</span>
                    <span className={styles.badgeIcon} role="img" aria-label="water">💧</span>
                  </div>
                )}

                {feature.previewType === 'chart' && (
                  <div className={styles.mockChart}>
                    <div className={styles.mockLine} />
                    <span className={styles.mockBadge}>+2.4%</span>
                  </div>
                )}

                {feature.previewType === 'list' && (
                  <div className={styles.mockList}>
                    <div className={styles.mockRow} />
                    <div className={styles.mockRowActive} />
                  </div>
                )}

                {feature.previewType === 'dashboard' && (
                  <div className={styles.mockDashboard}>
                    <div className={styles.dashSidebar} />
                    <div className={styles.dashMain}>
                      <div className={styles.dashGraph} />
                    </div>
                  </div>
                )}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
