import React from "react";
import styles from "../styles/OrbitVerified.module.css";

const OrbitVerified: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      {/* Block yang muter */}
      <img
        src="/block.svg"
        alt="block"
        className={styles.block}
      />

      {/* Verified di tengah */}
      <img
        src="/verified.svg"
        alt="verified"
        className={styles.verified}
      />
    </div>
  );
};

export default OrbitVerified;
