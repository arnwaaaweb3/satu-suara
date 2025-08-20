import React, { useRef, useState, useEffect } from 'react';

interface FadeContentProps {
  children: React.ReactNode;
  blur?: number;            // Blur awal dalam px
  duration?: number;        // Durasi animasi dalam ms
  delay?: number;           // Delay sebelum animasi mulai
  threshold?: number;       // Trigger Intersection Observer
  easing?: string;          // Easing animasi
  initialOpacity?: number;  // Opacity awal
  slideY?: number;          // Geser vertikal
  slideX?: number;          // Geser horizontal
  trigger?: 'scroll' | 'always';
}

const FadeContent: React.FC<FadeContentProps> = ({
  children,
  blur = 5,                // default sesuai request
  duration = 1000,          // default sesuai request
  delay = 200,              // default sesuai request
  threshold = 0,          // default sesuai request
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  initialOpacity = 0,
  slideY = 0,
  slideX = 0,
  trigger = 'scroll',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger === 'always') return;

    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, trigger]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : initialOpacity,
        filter: `blur(${isVisible ? 0 : blur}px)`,
        transform: `translate(${isVisible ? 0 : slideX}px, ${isVisible ? 0 : slideY}px)`,
        transition: `
          opacity ${duration}ms ${easing} ${delay}ms,
          filter ${duration}ms ${easing} ${delay}ms,
          transform ${duration}ms ${easing} ${delay}ms
        `
      }}
    >
      {children}
    </div>
  );
};

export default FadeContent;
