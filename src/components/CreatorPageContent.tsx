// src/components/CreatorPageContent.tsx

import React from "react";
import styles from "../styles/CentralPage.module.css";
import { FaUserCircle, FaLaptopCode, FaGlobe } from "react-icons/fa";

const CreatorPageContent: React.FC = () => {
  return (
    <div className={styles.contentInside}>
      <h2>Mengenal Kreator</h2>
      <div className={styles.creatorProfile}>
        <FaUserCircle className={styles.profileIcon} />
        <h3>Nawa Adhipura</h3>
        <p className={styles.profileTagline}>
          "Mewujudkan visi desentralisasi melalui teknologi."
        </p>
      </div>

      <div className={styles.visionMission}>
        <div className={styles.visionItem}>
          <FaLaptopCode className={styles.visionIcon} />
          <h4>Visi</h4>
          <p>
            Menciptakan ruang digital yang memberdayakan setiap individu untuk
            berpartisipasi aktif dalam pengambilan keputusan kolektif,
            menggunakan kekuatan teknologi blockchain untuk transparansi penuh.
          </p>
        </div>
        <div className={styles.visionItem}>
          <FaGlobe className={styles.visionIcon} />
          <h4>Misi</h4>
          <p>
            Membangun komunitas yang terhubung, di mana setiap suara dihargai
            dan setiap ide memiliki kesempatan untuk didengar dan
            diwujudkan.
          </p>
        </div>
      </div>
      <p className={styles.creatorFooter}>
        "Perjalanan ini baru dimulai. Bersama-sama, kita bisa membangun masa depan yang lebih baik."
      </p>
    </div>
  );
};

export default CreatorPageContent;