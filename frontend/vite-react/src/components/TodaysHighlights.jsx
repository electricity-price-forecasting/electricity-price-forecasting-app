import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import styles from './TodaysHighlights.module.css';

export const TodaysHighlights = ({ highlights }) => {
  return (
    <Card className={styles.container}>
      <h3 className={styles.title}>Today's Highlights</h3>
      
      <div className={styles.mainPriceBlock}>
        <span className={styles.priceLabel}>Current price</span>
        <div className={styles.priceValue}>
          {highlights.currency}{highlights.currentPrice}
          <span className={styles.unit}>{highlights.unit}</span>
        </div>
      </div>

      <div className={styles.rowsContainer}>
        <div className={styles.row}>
          <div>
            <div className={styles.rowLabel}>Today's Average</div>
            <div className={styles.rowVal}>{highlights.currency}{highlights.averagePrice} <span className={styles.unit}>/MWh</span></div>
          </div>
          <Badge type={highlights.averageType}>↑ {highlights.averageChange}</Badge>
        </div>

        <div className={styles.row}>
          <div>
            <div className={styles.rowLabel}>Today's Peak</div>
            <div className={styles.rowVal}>{highlights.currency}{highlights.peakPrice} <span className={styles.unit}>/MWh</span></div>
          </div>
          <Badge type={highlights.peakType}>↑ {highlights.peakChange}</Badge>
        </div>

        <div className={styles.row}>
          <div>
            <div className={styles.rowLabel}>Today's Low</div>
            <div className={styles.rowVal}>{highlights.currency}{highlights.lowPrice} <span className={styles.unit}>/MWh</span></div>
          </div>
          <Badge type={highlights.lowType}>↑ {highlights.lowChange}</Badge>
        </div>

        <div className={styles.row}>
          <div>
            <div className={styles.rowLabel}>Forecast Confidence</div>
            <div className={styles.rowVal}>{highlights.confidence}</div>
          </div>
          <Badge type="green">↑ High</Badge>
        </div>
      </div>
    </Card>
  );
};