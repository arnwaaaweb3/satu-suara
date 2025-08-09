import React from 'react';
import styles from '../styles/LoadingScreen.module.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <img src="/blue-logo.ico" alt= "SatuSuara-Logo" className={styles.logo} />
      <img src="/white-text.png" alt= "SatuSuara-Text" className={styles.whiteText} />
    </div>
  );
};

export default LoadingScreen;