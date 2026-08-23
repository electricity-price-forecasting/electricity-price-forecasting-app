import React from 'react';
import styles from './TopNavbar.module.css';

export const TopNavbar = ({ country = 'Poland', currency = 'EUR/MWh', onCountryChange }) => {
  return (
    <header className={styles.header}>
      <div className={styles.leftGroup}>
        <div className={styles.logo}>✦ Voltio</div>
        <button className={styles.selectBtn} onClick={() => onCountryChange && onCountryChange('Poland')}>
          🇵🇱 {country} ▾
        </button>
        <button className={styles.selectBtn}>
          {currency} ▾
        </button>
      </div>

      <div className={styles.rightGroup}>
        <button className={styles.iconBtn}>🔔</button>
        <button className={styles.iconBtn}>❓</button>
        <div className={styles.userAvatar}>
          <span className={styles.avatarBadge}>PL</span>
          <span className={styles.userName}>Alex ▾</span>
        </div>
      </div>
    </header>
  );
};