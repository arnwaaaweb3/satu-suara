// CentralPage.tsx

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Waves from "../components/Waves";
import LoadingScreen from "../components/LoadingScreen";
import styles from "../styles/CentralPage.module.css";
import { FaHome, FaInfo, FaUser, FaQuestion, FaBook, FaChevronLeft, FaChevronRight, FaPoll } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const actionButtonsData = [
  { id: 1, icon: FaHome, label: "Beranda", path: "/" },
  { id: 2, icon: FaInfo, label: "Info", path: "/info" },
  { id: 3, icon: FaUser, label: "Kreator", path: "/creator" },
  { id: 4, icon: FaQuestion, label: "FAQ", path: "/faq" },
  { id: 5, icon: FaBook, label: "Kiat", path: "/kiat" },
  { id: 6, icon: FaPoll, label: "Voting", path: "/voting" },
];

const CentralPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);
  const [activeContent, setActiveContent] = useState<string>("");

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

  // inertia
  const velocity = useRef(0);
  const lastMoveX = useRef(0);

  const lastBlurUpdateOffset = useRef<number | null>(null);
  const blurStyles = useRef<React.CSSProperties[]>([]);
  const [, forceRerender] = useState(0);

  const navigate = useNavigate();

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

    const targetOffset = containerCenter - ((allButtons[closestIndex] as HTMLElement).offsetLeft + buttonItemWidth.current / 2);
    offsetXTarget.current = targetOffset;
  }, []);

  const inertiaScroll = useCallback(() => {
    if (Math.abs(velocity.current) > 0.1) {
      offsetXTarget.current += velocity.current;
      velocity.current *= 0.95; // friction
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

      const blurValue = Math.pow(normalizedDistance, 1.9) * 4;
      const opacityValue = 1 - Math.pow(normalizedDistance, 2) * 0.9;

      return {
        filter: `blur(${blurValue}px)`,
        opacity: opacityValue,
        transition: "filter 220ms linear, opacity 220ms linear",
      };
    });

    blurStyles.current = newBlur;
    forceRerender((v) => v + 1);
  }, []);

  useEffect(() => {
    const assets = [
      "/background.png",
      "/white-logo.png",
      "/white-text.png",
      "/blue-logo.ico",
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

    const calcButtonsWidth = () => {
      if (buttonGroupRef.current) {
        const allButtons = buttonGroupRef.current.querySelectorAll(`.${styles.actionButton}`);
        if (allButtons.length > 0) {
          buttonItemWidth.current = (allButtons[0] as HTMLElement).offsetWidth;
          buttonsWidth.current = allButtons.length * buttonItemWidth.current + (allButtons.length - 1) * gapWidth;
        }
      }
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
        const minOffset = -(buttonsWidth.current - container.offsetWidth);
        newOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));
      }
      offsetXTarget.current = newOffset;
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging.current = false;
      try { (container as HTMLElement).releasePointerCapture(e.pointerId); } catch (err) {}
      container.style.cursor = "grab";
      container.style.userSelect = "auto";
      // inertia
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

    const scrollStep = direction === 'prev' ? 10 : -10; // Kecepatan geser
    scrollIntervalRef.current = setInterval(() => {
      offsetXTarget.current += scrollStep;
    }, 20); // Interval per 20ms
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
    offsetXTarget.current += scrollStep;
  };

  const onButtonPointerDown = (e: React.PointerEvent, label: string) => {
    e.stopPropagation();
    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ label, x: buttonRect.left + buttonRect.width / 2, y: buttonRect.top });
  };

  const onButtonPointerUp = (path: string, label: string) => {
    setTooltip(null);
    if (!isDragging.current && !isClickingNav.current) {
      if (path === "/") navigate(path);
      else setActiveContent(`Ini konten untuk tombol ${label}.`);
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

          <div className={styles.leftPanel}></div>
          <div className={styles.rightPanel}></div>

          <div className={styles.contentBox}>
            {activeContent ? (
              <div className={styles.contentInside}>
                <h2>{activeContent}</h2>
              </div>
            ) : (
              
              <div className={styles.contentInside}>
                <img src="/blue-logo.ico" alt= "SatuSuara-Logo" className={styles.logo} />
                <img src="/white-text.png" alt= "SatuSuara-Text" className={styles.whiteText} />
                <h2>Selamat datang di SatuSuara</h2>
                <p className={styles.welcomeText}>
                  Sebelum mulai, mari membaca Syarat & Ketentuan 
                  Penggunaan Layanan <Link to="/syarat-dan-ketentuan-penggunaan-layanan" className={styles.tncLink} >di sini.</Link>
                </p>
              </div>
            )}
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
                      onPointerUp={() => onButtonPointerUp(button.path, button.label)}
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