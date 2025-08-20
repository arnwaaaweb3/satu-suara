import React, { useState, useEffect } from "react";
import styles from "../styles/HamburgerMenu.module.css";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen && isClosing) {
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isClosing]);

  const closeMenu = () => {
    setIsOpen(false);
    setIsClosing(true);
  };

  const openMenu = () => {
    setIsOpen(true);
    setIsClosing(false);
  };
  
  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  return (
    <div className={styles.menuContainer}>
      {/* Hamburger Button */}
      <button
        className={styles.hamburgerButton}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className={`${styles.line} ${isOpen ? styles.line1Open : ""}`} />
        <div className={`${styles.line} ${isOpen ? styles.line2Open : ""}`} />
        <div className={`${styles.line} ${isOpen ? styles.line3Open : ""}`} />
      </button>

      {/* Overlay */}
      {/* Hanya overlay yang akan menggunakan kelas fadeOutOverlay saat menutup */}
      {(isOpen || isClosing) && (
        <div 
          className={`${styles.overlay} ${isClosing ? styles.fadeOutOverlay : ""}`} 
          onClick={closeMenu} 
        />
      )}

      {/* Dropdown Menu */}
      {/* Dropdown menu hanya akan muncul jika isOpen true dan langsung hilang saat false */}
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <a href="#home" className={styles.menuItem} onClick={closeMenu}>
            Beranda
          </a>
          <a href="#about" className={styles.menuItem} onClick={closeMenu}>
            Tentang Kami
          </a>
          <a href="#services" className={styles.menuItem} onClick={closeMenu}>
            Layanan
          </a>
          <a href="#contact" className={styles.menuItem} onClick={closeMenu}>
            Hubungi Kami
          </a>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;