// CentralPage.tsx

"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Waves from "../components/Waves";
import LoadingScreen from "../components/LoadingScreen";
import styles from "../styles/CentralPage.module.css";
import { FaHome, FaInfo, FaUser, FaQuestion, FaBook, FaChevronLeft, FaChevronRight, FaPoll } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// ----- Import Komponen Konten Halaman (yang akan di-render di tempat) -----
import InfoPageContent from "../components/InfoPageContent";
import CreatorPageContent from "../components/CreatorPageContent";
import FAQPageContent from "../components/FAQPageContent";

// Peta komponen, hanya untuk rute yang di-render di halaman ini
const pageMap: { [key: string]: React.FC } = {
  "/info": InfoPageContent,
  "/creator": CreatorPageContent,
  "/faq": FAQPageContent,
  // Tambahkan rute lain yang dirender di sini, contoh:
  // "/kiat": KiatPageContent,
};

// Data untuk tombol-tombol
const actionButtonsData = [
  { id: 1, icon: FaHome, label: "Beranda", path: "/" }, // Rute ini akan pindah halaman
  { id: 2, icon: FaInfo, label: "Info", path: "/info" }, // Rute ini akan render di tempat
  { id: 3, icon: FaUser, label: "Kreator", path: "/creator" }, // Rute ini akan render di tempat
  { id: 4, icon: FaQuestion, label: "FAQ", path: "/faq" }, // Rute ini akan render di tempat
  { id: 5, icon: FaBook, label: "Kiat", path: "/kiat" }, 
  { id: 6, icon: FaPoll, label: "Voting", path: "/vote" }, // Rute ini akan pindah halaman
];

const CentralPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);
  const [activePage, setActivePage] = useState<string>("/info"); // Default halaman awal

  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonGroupRef = useRef<HTMLDivElement | null>(null);

  const offsetXTarget = useRef(0);
  const offsetXCurrent = useRef(0);

  const buttonsWidth = useRef(0);
  const buttonItemWidth = useRef(0);
  const gapWidth = 12;
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const lastOffsetX = useRef(0);
  const isClickingNav = useRef(false);

  const velocity = useRef(0);
  const lastMoveX = useRef(0);

  const lastBlurUpdateOffset = useRef<number | null>(null);
  const blurStyles = useRef<React.CSSProperties[]>([]);
  const [, forceRerender] = useState(0);

  const navigate = useNavigate();

  const ActivePageComponent = useMemo(() => pageMap[activePage] || null, [activePage]);

  const snapToNearest = useCallback(() => {
    if (buttonItemWidth.current <= 0 || !buttonGroupRef.current) return;
    const containerRect = containerRef.current!.getBoundingClientRect();
    const containerCenter = containerRect.width / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    const allButtons = buttonGroupRef.current?.querySelectorAll(`.${styles.actionButton}`);
    if (!allButtons) return;
    allButtons.forEach((btn, idx) => {
      const rect = (btn as HTMLElement).getBoundingClientRect();
      const btnCenter = rect.left + rect.width / 2 - containerRect.left;
      const dist = Math.abs(containerCenter - btnCenter);
      if (dist < closestDistance) {
        closestDistance = dist;
        closestIndex = idx;
      }
    });
    let targetOffset = containerCenter - ((allButtons[closestIndex] as HTMLElement).offsetLeft + buttonItemWidth.current / 2);
    const container = containerRef.current;
    if (container && buttonsWidth.current > 0) {
      const maxOffset = 0;
      const minOffset = Math.min(0, -(buttonsWidth.current - container.offsetWidth));
      targetOffset = Math.max(minOffset, Math.min(maxOffset, targetOffset));
    }
    offsetXTarget.current = targetOffset;
  }, []);

  const inertiaScroll = useCallback(() => {
    const container = containerRef.current;
    const maxOffset = 0;
    const minOffset = container && buttonsWidth.current > 0
      ? Math.min(0, -(buttonsWidth.current - container.offsetWidth))
      : 0;
    if (Math.abs(velocity.current) > 0.1) {
      offsetXTarget.current += velocity.current;
      if (offsetXTarget.current > maxOffset) {
        offsetXTarget.current = maxOffset;
        velocity.current = 0;
      } else if (offsetXTarget.current < minOffset) {
        offsetXTarget.current = minOffset;
        velocity.current = 0;
      }
      velocity.current *= 0.95; 
      requestAnimationFrame(inertiaScroll);
    } else {
      snapToNearest();
    }
  }, [snapToNearest]);

  const computeBlurStyles = useCallback(() => {
    if (!buttonGroupRef.current || !containerRef.current) return;
    const buttonElements = Array.from(buttonGroupRef.current.querySelectorAll(`.${styles.actionButton}`)) as HTMLElement[];
    const containerRect = containerRef.current.getBoundingClientRect();
    const centerOfContainer = containerRect.width / 2;
    const maxDistance = containerRect.width / 2;
    const newBlur: React.CSSProperties[] = buttonElements.map((button) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonCenter = buttonRect.left + buttonRect.width / 2 - containerRect.left;
      const distanceToCenter = Math.abs(buttonCenter - centerOfContainer);
      const normalizedDistance = Math.min(distanceToCenter / maxDistance, 1);
      const blurValue = Math.pow(normalizedDistance, 1.8) * 5.5;
      const opacityValue = 1 - Math.pow(normalizedDistance, 2) * 0.92;
      return {
        filter: `blur(${blurValue}px)`,
        opacity: opacityValue,
        transition: "filter 300ms ease, opacity 300ms ease",
      };
    });
    blurStyles.current = newBlur;
    forceRerender((v) => v + 1);
  }, []);

  useEffect(() => {
    const assets = [
      "/background.png", "/white-logo.png", "/white-text.png", "/blue-logo.ico",
    ];
    let loadedCount = 0;
    const checkLoadingStatus = () => {
      loadedCount++;
      if (loadedCount === assets.length) {
        setTimeout(() => setIsLoading(false), 300);
      }
    };
    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkLoadingStatus;
      img.onerror = checkLoadingStatus;
    });
    const fallback = setTimeout(() => setIsLoading(false), 4000);
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const startFade = 100;
      const endFade = 300;
      let newOpacity = 1;
      if (scrollPosition > startFade) {
        newOpacity = 1 - (scrollPosition - startFade) / (endFade - startFade);
        newOpacity = Math.max(0, newOpacity);
      }
      setButtonOpacity(newOpacity);
    };
    window.addEventListener("scroll", handleScroll);
    const clampOffset = (val: number) => {
      if (!containerRef.current || buttonsWidth.current <= 0) return val;
      const maxOffset = 0;
      const minOffset = Math.min(0, -(buttonsWidth.current - containerRef.current.offsetWidth));
      return Math.max(minOffset, Math.min(maxOffset, val));
    };
    const calcButtonsWidth = () => {
      if (buttonGroupRef.current) {
        const allButtons = buttonGroupRef.current.querySelectorAll(`.${styles.actionButton}`);
        if (allButtons.length > 0) {
          buttonItemWidth.current = (allButtons[0] as HTMLElement).offsetWidth;
          buttonsWidth.current = allButtons.length * buttonItemWidth.current + (allButtons.length - 1) * gapWidth;
        }
      }
      offsetXTarget.current = clampOffset(offsetXTarget.current);
      offsetXCurrent.current = clampOffset(offsetXCurrent.current);
    };
    calcButtonsWidth();
    window.addEventListener("resize", calcButtonsWidth);
    return () => {
      clearTimeout(fallback);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calcButtonsWidth);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      startX.current = e.pageX;
      lastOffsetX.current = offsetXTarget.current;
      lastMoveX.current = e.pageX;
      velocity.current = 0;
      (container as HTMLElement).setPointerCapture(e.pointerId);
      container.style.cursor = "grabbing";
      container.style.userSelect = "none";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.pageX - startX.current;
      let newOffset = lastOffsetX.current + deltaX;
      velocity.current = e.pageX - lastMoveX.current;
      lastMoveX.current = e.pageX;
      if (buttonsWidth.current > 0) {
        const maxOffset = 0;
        const minOffset = Math.min(0, -(buttonsWidth.current - container.offsetWidth));
        newOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));
      }
      offsetXTarget.current = newOffset;
    };
    const onPointerUp = (e: PointerEvent) => {
      isDragging.current = false;
      try { (container as HTMLElement).releasePointerCapture(e.pointerId); } catch (err) {}
      container.style.cursor = "grab";
      container.style.userSelect = "auto";
      requestAnimationFrame(inertiaScroll);
      setTimeout(() => (isClickingNav.current = false), 50);
    };
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [inertiaScroll]);

  const onHoldStart = (direction: 'prev' | 'next') => {
    if (scrollIntervalRef.current) return;
    isClickingNav.current = true;
    const scrollStep = direction === 'prev' ? 10 : -10; 
    scrollIntervalRef.current = setInterval(() => {
      const container = containerRef.current;
      if (container && buttonsWidth.current > 0) {
        const maxOffset = 0;
        const minOffset = Math.min(0, -(buttonsWidth.current - container.offsetWidth));
        const next = offsetXTarget.current + scrollStep;
        offsetXTarget.current = Math.max(minOffset, Math.min(maxOffset, next));
      } else {
        offsetXTarget.current += scrollStep;
      }
    }, 20); 
  };
  const onHoldEnd = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
      snapToNearest();
    }
  };
  const onClickNav = (direction: 'prev' | 'next') => {
    isClickingNav.current = true;
    const scrollStep = direction === 'prev' ? (buttonItemWidth.current + gapWidth) : -(buttonItemWidth.current + gapWidth);
    const container = containerRef.current;
    if (container && buttonsWidth.current > 0) {
      const maxOffset = 0;
      const minOffset = Math.min(0, -(buttonsWidth.current - container.offsetWidth));
      const next = offsetXTarget.current + scrollStep;
      offsetXTarget.current = Math.max(minOffset, Math.min(maxOffset, next));
    } else {
      offsetXTarget.current += scrollStep;
    }
  };
  const onButtonPointerDown = (e: React.PointerEvent, label: string) => {
    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ label, x: buttonRect.left + buttonRect.width / 2, y: buttonRect.top });
  };

  const onButtonPointerUp = (path: string) => {
    setTooltip(null);
    if (!isDragging.current && !isClickingNav.current) {
      if (path in pageMap) {
        setActivePage(path);
      } else {
        navigate(path);
      }
    }
  };
  const onButtonPointerLeave = () => {
    setTooltip(null);
  };
  useEffect(() => {
    let animationFrameId: number;
    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
    const animate = () => {
      offsetXCurrent.current = lerp(offsetXCurrent.current, offsetXTarget.current, 0.12);
      if (buttonGroupRef.current) {
        buttonGroupRef.current.style.transform = `translateX(${offsetXCurrent.current}px)`;
        if (lastBlurUpdateOffset.current === null || Math.abs((lastBlurUpdateOffset.current ?? 0) - offsetXCurrent.current) > 0.6) {
          computeBlurStyles();
          lastBlurUpdateOffset.current = offsetXCurrent.current;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [computeBlurStyles]);
  const getBlurStyleForIndex = (idx: number) => blurStyles.current[idx] || {};

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
            backgroundRepeat: "no-repeat",
            position: "relative",
            minHeight: "100vh",
            overflow: "hidden",
          }}
        >
          <div className={styles.wavesWrapper} aria-hidden="true">
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

          <div className={styles.contentBox}>
            <div className={styles.brandTopLeft}>
              <img src="/blue-logo.ico" alt="SatuSuara-Logo" className={styles.logo} />
              <img src="/white-text.png" alt="SatuSuara-Text" className={styles.whiteText} />
            </div>
            
            <div className={styles.contentWrapper}>
                {ActivePageComponent ? <ActivePageComponent /> : <p>Maaf, tidak ada konten yang ditemukan.</p>}
            </div>
          </div>

          <div className={styles.contentContainer}>
            <button
              className={`${styles.navButton} ${styles.navLeft}`}
              onClick={() => onClickNav('prev')}
              onPointerDown={() => onHoldStart('prev')}
              onPointerUp={onHoldEnd}
              onPointerLeave={onHoldEnd}
              aria-label="Previous"
            >
              <FaChevronLeft size={24} />
            </button>
            <div
              className={styles.buttonContainerWrapper}
              ref={containerRef}
              style={{ opacity: buttonOpacity }}
            >
              <div className={styles.buttonGroup} ref={buttonGroupRef}>
                {actionButtonsData.map((button, index) => {
                  const IconComponent = button.icon;
                  return (
                    <button
                      key={`${button.id}_${index}`}
                      className={styles.actionButton}
                      aria-label={button.label}
                      style={getBlurStyleForIndex(index)}
                      onPointerDown={(e) => onButtonPointerDown(e, button.label)}
                      onPointerUp={() => onButtonPointerUp(button.path)}
                      onPointerLeave={onButtonPointerLeave}
                    >
                      <IconComponent size={24} />
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              className={`${styles.navButton} ${styles.navRight}`}
              onClick={() => onClickNav('next')}
              onPointerDown={() => onHoldStart('next')}
              onPointerUp={onHoldEnd}
              onPointerLeave={onHoldEnd}
              aria-label="Next"
            >
              <FaChevronRight size={24} />
            </button>
          </div>

          {tooltip && (
            <div
              className={styles.tooltipText}
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: `translateX(-50%) translateY(-110%)`,
              }}
            >
              <span className={styles.tooltipInner}>{tooltip.label}</span>
              <div className={styles.tooltipArrow} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CentralPage;