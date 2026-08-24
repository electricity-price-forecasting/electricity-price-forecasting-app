import React, { useState } from 'react';
import { Desktop24H } from './views/Desktop24H';
import { Desktop7D } from './views/Desktop7D';
import styles from './App.module.css';

export default function App() {
  const [view, setView] = useState('24H');

  return (
    <div className={styles.layout}>
      {view === '24H' ? (
        <Desktop24H onSwitchTo7D={() => setView('7D')} />
      ) : (
        <Desktop7D onSwitchTo24H={() => setView('24H')} />
      )}
    </div>
  );
}