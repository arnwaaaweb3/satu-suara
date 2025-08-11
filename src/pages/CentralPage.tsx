"use client";

import React, { useEffect, useState, useRef } from "react";
import Waves from "../components/Waves";
import LoadingScreen from "../components/LoadingScreen";
import styles from "../styles/CentralPage.module.css";
import { FaHome, FaInfo, FaUser, FaQuestion, FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const actionButtonsData = [
  { id: 1, icon: FaHome, label: "Beranda", path: "/" },
  { id: 2, icon: FaInfo, label: "Info", path: "/info" },
  { id: 3, icon: FaUser, label: "Kreator", path: "/creator" },
  { id: 4, icon: FaQuestion, label: "FAQ", path: "/faq" },
  { id: 5, icon: FaBook, label: "Kiat", path: "/kiat" },
];

const CentralPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [blurStyles, setBlurStyles] = useState<React.CSSProperties[]>([]);

  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);

  const offsetXTarget = useRef(0);
  const offsetXCurrent = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const buttonsWidth = useRef(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const lastOffsetX = useRef(0);

  // Inisialisasi useNavigate
  const navigate = useNavigate();

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
      if (buttonGroupRef.current) {
        buttonsWidth.current = buttonGroupRef.current.scrollWidth / 2;
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
      const maxOffset = buttonsWidth.current * 0.5;
      const minOffset = -buttonsWidth.current * 1.5;
      newOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));
    }
    offsetXTarget.current = newOffset;
  };
  
  const onButtonMouseDown = (e: React.MouseEvent, label: string) => {
    e.stopPropagation();
    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({
      label,
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top,
    });
  };

  const onButtonMouseUp = (path: string) => {
    setTooltip(null);
    if (!isDragging.current) {
      navigate(path);
    }
  };

  const onButtonMouseLeave = () => {
    setTooltip(null);
  };
  
  // Logic untuk menghitung blur dan opacity
  const updateBlurStyles = () => {
    if (buttonGroupRef.current && containerRef.current) {
      const buttonElements = Array.from(
        buttonGroupRef.current.querySelectorAll(`.${styles.actionButton}`)
      ) as HTMLElement[];

      const containerRect = containerRef.current.getBoundingClientRect();
      const centerOfContainer = containerRect.width / 2;
      const blurStylesArray = buttonElements.map((button) => {
        const buttonRect = button.getBoundingClientRect();
        const buttonCenter = buttonRect.left + buttonRect.width / 2 - containerRect.left;
        const distanceToCenter = Math.abs(buttonCenter - centerOfContainer);
        const maxDistance = containerRect.width / 2;
        const normalizedDistance = Math.min(distanceToCenter / (maxDistance), 1);
        const blurValue = normalizedDistance * 5;

        const opacityValue = 1 - normalizedDistance * 0.7;

        return {
          filter: `blur(${blurValue}px)`,
          opacity: opacityValue,
        };
      });
      setBlurStyles(blurStylesArray);
    }
  };

  // Animasi lerp supaya smooth (requestAnimationFrame) + update blur
  useEffect(() => {
    let animationFrameId: number;

    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

    const animate = () => {
      offsetXCurrent.current = lerp(offsetXCurrent.current, offsetXTarget.current, 0.1);

      if (buttonGroupRef.current) {
        buttonGroupRef.current.style.transform = `translateX(${offsetXCurrent.current}px)`;
        updateBlurStyles();
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
              style={{ opacity: buttonOpacity }}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUpOrLeave}
              onMouseLeave={onMouseUpOrLeave}
              onMouseMove={onMouseMove}
            >
              <div className={styles.buttonGroup} ref={buttonGroupRef}>
                {actionButtonsData.map((button, index) => {
                  const IconComponent = button.icon;
                  return (
                    <button
                      key={button.id}
                      className={styles.actionButton}
                      aria-label={button.label}
                      style={blurStyles[index] || {}}
                      onMouseDown={(e) => onButtonMouseDown(e, button.label)}
                      onMouseUp={() => onButtonMouseUp(button.path)}
                      onMouseLeave={onButtonMouseLeave}
                    >
                      <IconComponent size={24} />
                    </button>
                  );
                })}
                {actionButtonsData.map((button, index) => {
                  const IconComponent = button.icon;
                  return (
                    <button
                      key={button.id + "_dup"}
                      className={styles.actionButton}
                      aria-hidden="true"
                      tabIndex={-1}
                      style={blurStyles[index + actionButtonsData.length] || {}}
                      onMouseDown={(e) => onButtonMouseDown(e, button.label)}
                      onMouseUp={() => onButtonMouseUp(button.path)}
                      onMouseLeave={onButtonMouseLeave}
                    >
                      <IconComponent size={24} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {tooltip && (
            <div
              className={styles.tooltipText}
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: `translateX(-50%) translateY(-100%)`,
              }}
            >
              {tooltip.label}
              <div className={styles.tooltipArrow} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CentralPage;