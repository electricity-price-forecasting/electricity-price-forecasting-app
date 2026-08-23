import React from 'react';
import { SIDEBAR_MENU } from '../constants/dashboardData';
import styles from './Sidebar.module.css';

export const Sidebar = ({ activeTab = 'p-drivers', onTabSelect }) => {
  return (
    <aside className={styles.sidebar}>
      <button className={styles.homeBtn}>🏠 Home</button>
      {SIDEBAR_MENU.map((group, i) => (
        <div key={i} className={styles.group}>
          <span className={styles.groupTitle}>{group.category}</span>
          {group.items.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => onTabSelect && onTabSelect(item.id)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ))}
      <div className={styles.footer}>
        <button className={styles.navItem}>⚙️ Settings ›</button>
      </div>
    </aside>
  );
};