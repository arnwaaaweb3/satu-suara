// src/front-end/components/CustomCursor.tsx
import React, { useState, useEffect } from 'react';
import styles from '../styles/CustomCursor.module.css';

interface CustomCursorProps {
  cursorType: 'default' | 'click';
}

const CustomCursor: React.FC<CustomCursorProps> = ({ cursorType }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove as any);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
    };
  }, []);

  const cursorImage = cursorType === 'click' ? '/click.svg' : '/cursor.svg';

  return (
    <div
      className={styles.cursor}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundImage: `url(${cursorImage})`,
      }}
    />
  );
};

export default CustomCursor;