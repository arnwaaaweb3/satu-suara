import React, { useState, useEffect } from "react";
import styles from "../styles/HamburgerMenu.module.css";

interface HamburgerMenuProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onMouseEnter, onMouseLeave }) => {
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
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={`${styles.line} ${isOpen ? styles.line1Open : ""}`} />
        <div className={`${styles.line} ${isOpen ? styles.line2Open : ""}`} />
        <div className={`${styles.line} ${isOpen ? styles.line3Open : ""}`} />
      </button>

      {/* Overlay */}
      {/* 👇 PENTING: Hapus onMouseEnter dan onMouseLeave dari sini */}
      {(isOpen || isClosing) && (
        <div 
          className={`${styles.overlay} ${isClosing ? styles.fadeOutOverlay : ""}`} 
          onClick={closeMenu}
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {/* 👇 Pertahankan event handler di setiap link */}
          <a
            href="#home"
            className={styles.menuItem}
            onClick={closeMenu}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            Beranda
          </a>
          <a
            href="#about"
            className={styles.menuItem}
            onClick={closeMenu}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            Tentang Kami
          </a>
          <a
            href="#services"
            className={styles.menuItem}
            onClick={closeMenu}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            Layanan
          </a>
          <a
            href="#contact"
            className={styles.menuItem}
            onClick={closeMenu}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            Hubungi Kami
          </a>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;