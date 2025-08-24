// src/front-end/components/InfoPageContent.tsx
import React from 'react';
import styles from '../styles/InfoPageContent.module.css';

const InfoPageContent: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      {/* Lantai 1: Hero Section */}
      <section className={styles.section}>
        <h1 className={styles.mainTitle}>Tentang SatuSuara</h1>
        <p className={styles.description}>
          SatuSuara adalah platform voting terdesentralisasi yang kami kembangkan untuk menciptakan sistem pemilihan yang lebih terbuka, transparan, dan bisa diverifikasi siapa pun. Lewat platform ini, kami membawa semangat keterbukaan dan kerakyatan — di mana siapa saja, tanpa terkecuali, bisa jadi partisipan aktif sekaligus pengawas dalam proses pengolahan hasil pemilihan.
        </p>
      </section>

      {/* Lantai 2: The "Why" Section */}
      <section className={styles.section}>
        <h2 className={styles.subTitle}>Demokrasi Hari Ini: Sebuah Tantangan</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>2.271 TPS</h3>
            <p>Mengalami intimidasi, termasuk penekanan pada petugas KPPS.</p>
          </div>
          <div className={styles.statCard}>
            <h3>2.600+ TPS</h3>
            <p>Terindikasi mengalami praktik mobilisasi dan mengarahkan suara.</p>
          </div>
          <div className={styles.statCard}>
            <h3>210 Laporan</h3>
            <p>Dugaan pelanggaran, 55% melibatkan pihak penyelenggara pemilu.</p>
          </div>
        </div>
        <p className={styles.conclusion}>
          Kondisi ini menunjukkan bahwa ketergantungan penuh pada pihak ketiga adalah risiko besar. Di sinilah SatuSuara hadir sebagai platform voting terdesentralisasi dengan pendekatan “trustless system”, yang mengandalkan transparansi blockchain untuk menjamin akurasi, keamanan, dan keadilan.
        </p>
      </section>

      {/* Lantai 3: Vision & Mission */}
      <section className={styles.section}>
        <div className={styles.visionMissionWrapper}>
          <div className={styles.vision}>
            <h2 className={styles.subTitle}>Visi Kami</h2>
            <blockquote>
              “Menciptakan ekosistem demokrasi yang transparan, adil, dan partisipatif melalui teknologi terdesentralisasi, di mana setiap suara punya nilai dan bisa diverifikasi tanpa batas.”
            </blockquote>
          </div>
          <div className={styles.mission}>
            <h2 className={styles.subTitle}>Misi Kami</h2>
            <ol>
              <li>Meningkatkan transparansi dengan teknologi blockchain.</li>
              <li>Menghapus ketergantungan pada pihak ketiga dengan sistem otomatis.</li>
              <li>Mendorong partisipasi aktif masyarakat dengan akses terbuka.</li>
              <li>Mengurangi risiko manipulasi dan human-error melalui mekanisme “trustless”.</li>
              <li>Mengedukasi masyarakat tentang pentingnya pengawasan demokrasi.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Lantai 4: The Roadmap */}
      <section className={styles.section}>
        <h2 className={styles.subTitle}>Indikator Keberhasilan</h2>
        <div className={styles.indicatorsGrid}>
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
      </section>
    </div>
  );
};

export default InfoPageContent;