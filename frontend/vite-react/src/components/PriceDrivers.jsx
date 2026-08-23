import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import styles from './PriceDrivers.module.css';

export const PriceDrivers = ({ drivers, expectedChangeText = "Prices are expected to fall by 12% tomorrow" }) => {
  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Price Drivers ⓘ</h3>
          <p className={styles.sub}>{expectedChangeText}</p>
        </div>
        <a href="#details" className={styles.link}>View detailed drivers ›</a>
      </div>

      <div className={styles.grid}>
        {drivers.map((item, idx) => (
          <div key={idx} className={styles.driverTile}>
            <span className={styles.icon}>{item.icon}</span>
            <div className={styles.content}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemDesc}>{item.desc}</span>
              <div className={styles.footerRow}>
                <span>{item.val}</span>
                <Badge type={item.type}>{item.tag}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summaryBanner}>
        <strong>These drivers combine to create a net downward pressure on prices tomorrow.</strong>
        <span>Values show estimated impact on average wholesale price.</span>
      </div>
    </Card>
  );
};