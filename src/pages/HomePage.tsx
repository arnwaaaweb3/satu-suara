import React from 'react';
import BlurText from '../components/BlurText';
import styles from '../styles/HomePage.module.css';

const HomePage: React.FC = () => {

  const handleAnimationComplete = () => {
    console.log('Landing text animation completed!');
  };

  return (
    <div className={styles.container}>
      {/* Logo dan Teks */}
    <div className={styles.logoWrapper}>
      <img src="/white-logo.png" alt="Logo" className={styles.logo} />
      <img src="/white-text.png" alt="SatuSuara" className={styles.textLogo} />
    </div>

      {/* Heading */}
      <div className={styles.heading}>
        <BlurText
          text="Sistem Demokrasi Digital — Voting Transparan, Aman, dan Berbasis Blockchain."
          delay={100}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
        />
      </div>
    </div>
  );
};

export default HomePage;
