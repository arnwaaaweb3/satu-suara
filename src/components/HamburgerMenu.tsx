// src/components/HamburgerMenu.tsx
import React, { useState } from 'react';
import styles from '../styles/HamburgerMenu.module.css';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.menuContainer}>
      <button className={styles.hamburgerButton} onClick={handleToggle}>
        <div className={`${styles.line} ${isOpen ? styles.line1Open : ''}`}></div>
        <div className={`${styles.line} ${isOpen ? styles.line2Open : ''}`}></div>
        <div className={`${styles.line} ${isOpen ? styles.line3Open : ''}`}></div>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {/* Menu item kosongan, nanti bisa diisi */}
          <a href="ca" className={styles.menuItem}>Menu Item 1</a>
          <a href="abc" className={styles.menuItem}>Menu Item 2</a>
          <a href="ab" className={styles.menuItem}>Menu Item 3</a>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;