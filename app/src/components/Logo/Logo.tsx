import React from 'react';
import styles from './Logo.module.scss';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <h1 className={`${styles.logo} ${className || ''}`.trim()}>
      Twoje<span className={styles.highlight}>Auto</span>
    </h1>
  );
}