"use client";

import { useRef } from 'react';
import Image from 'next/image';
import styles from './MasterTextImage.module.scss';

const MasterTextImage = ({ data }) => {
  const containerRef = useRef(null);
  const imageRefs = useRef(new Array(data.length).fill(null));
  const textRefs = useRef(new Array(data.length).fill(null));

  // Validation function
  const validateDataLength = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Data must be a non-empty array');
      return false;
    }
    
    if (data.length < 2) {
      console.warn('Minimum 2 sections required for smooth transitions');
      return false;
    }
    
    if (data.length > 12) {
      console.error('More than 12 sections will likely cause performance issues');
      return false;
    }
    
    const isValidStructure = data.every(item => 
      item && 
      typeof item.image === 'string' && 
      typeof item.firstTitle === 'string'
    );
    
    if (!isValidStructure) {
      console.error('Invalid data structure: each item must have image and firstTitle strings');
      return false;
    }
    
    return true;
  };

  // For Phase 1: Just validate and render static layout
  if (!validateDataLength(data)) {
    return <div className={styles.errorContainer}>Invalid data provided</div>;
  }

  return (
    <div ref={containerRef} className={styles.masterContainer}>
      {/* Fixed Image Container */}
      <div className={styles.imageContainer}>
        {data.map((item, index) => (
          <Image 
            key={`image-${index}`}
            ref={el => imageRefs.current[index] = el}
            src={item.image} 
            fill={true}
            style={{ 
              opacity: index === 0 ? 1 : 0, // Only show first image initially
              objectFit: 'contain' 
            }}
            alt={item.firstTitle}
          />
        ))}
      </div>
      
      {/* Text Animation Container */}
      <div className={styles.textContainer}>
        {data.map((item, index) => (
          <div 
            key={`text-${index}`}
            ref={el => textRefs.current[index] = el}
            className={styles.textItem}
            style={{ 
              opacity: index === 0 ? 1 : 0 // Only show first text initially
            }}
          >
            {item.firstTitle}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterTextImage;
