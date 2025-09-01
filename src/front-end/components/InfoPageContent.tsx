import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/InfoPageContent.module.css';
import { FaCheckCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const InfoPageContent: React.FC = () => {
  const [indicatorIndex, setIndicatorIndex] = useState(0);
  const indicatorsContainerRef = useRef<HTMLDivElement>(null);
  const [totalIndicators, setTotalIndicators] = useState(0);
  const [visibleIndicators, setVisibleIndicators] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const calculateVisible = () => {
      if (window.innerWidth < 768) {
        setVisibleIndicators(1);
      } else if (window.innerWidth < 1200) {
        setVisibleIndicators(2);
      } else {
        setVisibleIndicators(3);
      }
    };

    const calculateCardWidth = () => {
      if (indicatorsContainerRef.current && indicatorsContainerRef.current.children[0]) {
        const firstCard = indicatorsContainerRef.current.children[0] as HTMLElement;
        const style = window.getComputedStyle(firstCard);
        const gap = parseInt(style.marginRight || '0', 10);
        setCardWidth(firstCard.offsetWidth + gap);
      }
    };

    calculateVisible();
    calculateCardWidth();

    if (indicatorsContainerRef.current) {
      setTotalIndicators(indicatorsContainerRef.current.children.length);
    }

    window.addEventListener('resize', () => {
      calculateVisible();
      calculateCardWidth();
    });

    return () => window.removeEventListener('resize', () => {
      calculateVisible();
      calculateCardWidth();
    });
  }, []);

  const handleNextIndicator = () => {
    setIndicatorIndex((prevIndex) =>
      Math.min(prevIndex + 1, totalIndicators - visibleIndicators)
    );
  };

  const handlePrevIndicator = () => {
    setIndicatorIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className={styles.wrapper}>
      {/* Lantai 1: Hero Section */}
      <section className={styles.section}>
        <div className={styles.heroCard}>
          {/* Tambahan: Image baru di sini */}
          <img 
            src="/votegraaaah.svg" 
            alt="Voting Graphic" 
            className={styles.votingGraphic} 
          />
          <div className={styles.voteElement}>
            <div className={styles.heroContentWrapper}>
              <h1 className={styles.mainTitle}>SatuSuara</h1>
              <p className={styles.description}>
                SatuSuara adalah platform voting terdesentralisasi yang kami kembangkan untuk menciptakan sistem pemilihan yang lebih terbuka, transparan, dan bisa diverifikasi siapa pun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lantai 2: The "Why" Section */}
      <section className={styles.section}>
        <h2 className={styles.subTitle}>Sistem Voting Konvensional: Apa yang Menjadi Masalah?</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>2.271 TPS</h3>
            <p>Mengalami intimidasi, termasuk penekanan pada petugas KPPS.</p>
          </div>
          <div className={styles.statCard}>
            <h3>2.632 TPS</h3>
            <p>Terindikasi mengalami praktik mobilisasi dan pengarahan suara.</p>
          </div>
          <div className={styles.statCard}>
            <h3>11.233 TPS</h3>
            <p>Mengalami kendala akses sistem penghitungan suara secara daring, membatasi transparansi proses.</p>
          </div>
        </div>
        <p className={styles.conclusionJustified}>
          Fakta dari penyelenggaraan pemilu terakhir menunjukkan bahwa ketergantungan penuh pada pihak ketiga adalah risiko besar. Berbagai laporan independen mencatat ribuan kasus intimidasi, indikasi mobilisasi suara, hingga kendala teknis yang menghambat keterbukaan data. Kondisi ini menegaskan perlunya sistem yang lebih tangguh. Di sinilah SatuSuara hadir sebagai platform voting terdesentralisasi dengan pendekatan "trustless system", yang mengandalkan transparansi blockchain untuk menjamin akurasi, keamanan, dan keadilan.
        </p>
      </section>


      {/* Lantai 3: Vision & Mission */}
      <section className={styles.section}>
        <div className={styles.visionMissionWrapper}>
          <div className={styles.vision}>
            <h2 className={styles.subTitle}>Visi Kami</h2>
            <blockquote>
              "Menciptakan ekosistem demokrasi yang transparan, adil, dan partisipatif melalui teknologi terdesentralisasi, di mana setiap suara punya nilai dan bisa diverifikasi tanpa batas."
            </blockquote>
          </div>
          <div className={styles.mission}>
            <h2 className={styles.subTitle}>Misi Kami</h2>
            <ul className={styles.missionList}>
              <li><FaCheckCircle className={styles.missionIcon} />Meningkatkan transparansi dengan teknologi blockchain.</li>
              <li><FaCheckCircle className={styles.missionIcon} />Menghapus ketergantungan pada pihak ketiga dengan sistem otomatis.</li>
              <li><FaCheckCircle className={styles.missionIcon} />Mendorong partisipasi aktif masyarakat dengan akses terbuka.</li>
              <li><FaCheckCircle className={styles.missionIcon} />Mengurangi risiko manipulasi dan human-error melalui mekanisme "trustless".</li>
              <li><FaCheckCircle className={styles.missionIcon} />Mengedukasi masyarakat tentang pentingnya pengawasan demokrasi.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Lantai 4: The Roadmap */}
      <section className={styles.section}>
        <div className={styles.indicatorsHeader}>
          <h2 className={styles.subTitle}>Indikator Keberhasilan</h2>
          <div className={styles.indicatorNav}>
            <button
              className={styles.indicatorNavBtn}
              onClick={handlePrevIndicator}
              disabled={indicatorIndex === 0}
            >
              <FaArrowLeft />
            </button>
            <button
              className={styles.indicatorNavBtn}
              onClick={handleNextIndicator}
              disabled={indicatorIndex >= totalIndicators - visibleIndicators}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className={styles.indicatorsSliderContainer}>
          <div
            className={styles.indicatorsGrid}
            ref={indicatorsContainerRef}
            style={{ transform: `translateX(-${indicatorIndex * cardWidth}px)` }}
          >
            <div className={styles.indicatorCategory}>
              <h4>Awareness & Engagement</h4>
              <ul>
                <li>Pemahaman masyarakat tentang voting terdesentralisasi.</li>
                <li>Jumlah pengguna aktif di platform.</li>
              </ul>
            </div>
            <div className={styles.indicatorCategory}>
              <h4>Adoption & Usage</h4>
              <ul>
                <li>Skor kepuasan pengguna (user satisfaction).</li>
                <li>Jumlah event pemilihan yang menggunakan SatuSuara.</li>
                <li>Tingkat retensi pengguna.</li>
              </ul>
            </div>
            <div className={styles.indicatorCategory}>
              <h4>Trust & Transparency</h4>
              <ul>
                <li>Jumlah audit publik tanpa temuan manipulasi.</li>
                <li>Peningkatan kepercayaan dibanding metode konvensional.</li>
                <li>Penurunan laporan kecurangan atau error.</li>
              </ul>
            </div>
            <div className={styles.indicatorCategory}>
              <h4>Education & Advocacy</h4>
              <ul>
                <li>Kolaborasi dengan lembaga, komunitas, dan institusi.</li>
                <li>Peningkatan kesadaran publik akan pentingnya pengawasan.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InfoPageContent;