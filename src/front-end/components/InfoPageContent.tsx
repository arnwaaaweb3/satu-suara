// src/components/InfoPageContent.tsx

import React from "react";
import styles from "../styles/CentralPage.module.css";
import { Link } from "react-router-dom";

const InfoPageContent: React.FC = () => {
  return (
    <div className={styles.contentInside}>
      <h2>Tentang SatuSuara</h2>
      <p>
        SatuSuara adalah platform inovatif yang dirancang untuk memberikan ruang
        bagi setiap orang untuk menyuarakan pendapatnya. Kami percaya bahwa
        setiap suara memiliki kekuatan untuk menciptakan perubahan.
      </p>
      <p>
        Melalui fitur **Voting** dan **Kiat**, kami memfasilitasi diskusi yang konstruktif
        dan mendorong komunitas untuk saling berbagi ide dan inspirasi.
      </p>
      <p>
        Bergabunglah bersama kami untuk menjadi bagian dari perubahan positif.
      </p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/syarat-dan-ketentuan-penggunaan-layanan" className={styles.tncLink}>
          Baca Syarat & Ketentuan
        </Link>
      </div>
    </div>
  );
};

export default InfoPageContent;