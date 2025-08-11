"use client";

import React, { useEffect, useState, useRef } from "react";
import Waves from "../components/Waves";
import LoadingScreen from "../components/LoadingScreen";
import styles from "../styles/CentralPage.module.css";
import { FaHome, FaInfo, FaUser, FaQuestion, FaBook } from "react-icons/fa";

const actionButtonsData = [
  { id: 1, icon: FaHome, label: "Home" },
  { id: 2, icon: FaInfo, label: "Info" },
  { id: 3, icon: FaUser, label: "User" },
  { id: 4, icon: FaQuestion, label: "FAQ" },
  { id: 5, icon: FaBook, label: "Library" },
];

const CentralPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [buttonOpacity, setButtonOpacity] = useState(1);

  // Ref posisi target dan posisi render saat ini (untuk lerp smooth)
  const offsetXTarget = useRef(0);
  const offsetXCurrent = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsWidth = useRef(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const lastOffsetX = useRef(0);

  // Load assets + scroll fade opacity
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
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkLoadingStatus;
      img.onerror = checkLoadingStatus;
    });

    const fallback = setTimeout(() => setIsLoading(false), 5000);

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
      if (containerRef.current) {
        const container = containerRef.current.querySelector(`.${styles.buttonGroup}`);
        if (container) {
          buttonsWidth.current = container.scrollWidth / 2; // Bagi 2 karena duplikat 2x
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

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
    lastOffsetX.current = offsetXTarget.current;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grabbing";
      containerRef.current.style.userSelect = "none";
    }
  };

  const onMouseUpOrLeave = () => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
      containerRef.current.style.userSelect = "auto";
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.pageX - startX.current;
    let newOffset = lastOffsetX.current + deltaX;

    if (buttonsWidth.current > 0) {
      if (newOffset > 0) {
        newOffset -= buttonsWidth.current;
      } else if (newOffset < -buttonsWidth.current) {
        newOffset += buttonsWidth.current;
      }
    }

    offsetXTarget.current = newOffset;
  };

  // Animasi lerp supaya smooth (requestAnimationFrame)
  useEffect(() => {
    let animationFrameId: number;

    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

    const animate = () => {
      // Lerp posisi current menuju target offset
      offsetXCurrent.current = lerp(offsetXCurrent.current, offsetXTarget.current, 0.1);

      if (containerRef.current) {
        containerRef.current.querySelector(`.${styles.buttonGroup}`)?.setAttribute(
          "style",
          `transform: translateX(${offsetXCurrent.current}px)`
        );
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

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

          <div className={styles.contentContainer}>
            <div
              className={styles.buttonContainerWrapper}
              ref={containerRef}
              style={{ opacity: buttonOpacity, cursor: "grab" }}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUpOrLeave}
              onMouseLeave={onMouseUpOrLeave}
              onMouseMove={onMouseMove}
            >
              <div className={styles.buttonGroup}>
                {actionButtonsData.map((button) => {
                  const IconComponent = button.icon;
                  return (
                    <button
                      key={button.id}
                      className={styles.actionButton}
                      aria-label={button.label}
                    >
                      <IconComponent size={24} />
                    </button>
                  );
                })}
                {actionButtonsData.map((button) => {
                  const IconComponent = button.icon;
                  return (
                    <button
                      key={button.id + "_dup"}
                      className={styles.actionButton}
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <IconComponent size={24} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CentralPage;
