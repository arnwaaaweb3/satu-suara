// src/pages/HomePage.tsx
import React, { useState, useEffect, ClipboardEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Import useNavigate
import BlurText from '../components/BlurText';
import FadeContent from '../components/FadeContent';
import Waves from '../components/Waves';
import HamburgerMenu from '../components/HamburgerMenu';
import styles from '../styles/HomePage.module.css';
import LoadingScreen from '../components/LoadingScreen';
import OrbitVerified from "../components/OrbitVerified";

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // 👈 Inisialisasi hook useNavigate

  useEffect(() => {
    const assets = [
      '/background.png',
      '/vektor2.png',
      '/vektor3.png',
      '/white-logo.png',
      '/white-text.png'
    ];

    let loadedCount = 0;

    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === assets.length) {
          setTimeout(() => setIsLoading(false), 500);
        }
      };
    });
  }, []);

  const handleAnimationComplete = () => {
    console.log('Landing text animation completed!');
  };

  // 👈 Fungsi baru untuk menangani klik tombol
  const handleGetStartedClick = () => {
    navigate('/central');
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      {!isLoading && (
        <div
          className={styles.container}
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          {/* Decorative Vectors */}
          <div className={styles.vector2}>
            <OrbitVerified />
          </div>
          <img src="/vektor3.png" alt="Vector 3" className={styles.vector3} />

          {/* Waves Layer */}
          <div className={styles.wavesWrapper}>
            <Waves
              lineColor="#456882"
              backgroundColor="rgba(27, 60, 83, 0.6)"
              waveSpeedX={0.02}
              waveSpeedY={0.01}
              waveAmpX={40}
              waveAmpY={20}
              friction={0.9}
              tension={0.01}
              maxCursorMove={120}
              xGap={12}
              yGap={36}
            />
          </div>

          {/* Logo + Text (Top Layer) */}
          <div className={styles.logoWrapper}>
            <FadeContent slideY={20}>
              <img src="/white-logo.png" alt="Logo" className={styles.logo} />
            </FadeContent>
            <FadeContent slideY={20}>
              <img src="/white-text.png" alt="SatuSuara" className={styles.textLogo} />
            </FadeContent>
          </div>

          {/* Hamburger Menu */}
          <HamburgerMenu />

          {/* Heading */}
          <div
            className={styles.heading}
            onCopy={(e: ClipboardEvent<HTMLDivElement>) => e.preventDefault()}
            onMouseDown={(e: MouseEvent<HTMLDivElement>) => e.preventDefault()}
            onContextMenu={(e: MouseEvent<HTMLDivElement>) => e.preventDefault()}
          >
            <BlurText
              text="Sistem Demokrasi Digital — Voting Transparan, Aman, dan Berbasis Blockchain."
              delay={100}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
            />

            {/* CTA Button with Fade Animation */}
            <FadeContent slideY={20}>
              {/* 👈 Panggil fungsi handleGetStartedClick saat tombol diklik */}
              <button className={styles.ctaButton} onClick={handleGetStartedClick}>
                Get Started
              </button>
            </FadeContent>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;