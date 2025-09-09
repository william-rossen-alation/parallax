'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import styles from './styles.module.scss';

// Utility functions for aspect ratio calculations
export const parseAspectRatio = (aspectRatio: string): { width: number; height: number } => {
  const parts = aspectRatio.split(':').map(Number);
  if (parts.length !== 2 || parts.some(isNaN)) {
    throw new Error(`Invalid aspect ratio format: ${aspectRatio}. Use format like "16:9" or "4:3"`);
  }
  return { width: parts[0], height: parts[1] };
};

export const calculateAspectRatio = (width: number, height: number): number => {
  return width / height;
};

export const getAspectRatioClass = (aspectRatio: string): string => {
  const normalized = aspectRatio.replace(':', 'x');
  return `aspectRatio${normalized}`;
};

// TypeScript interfaces
export interface TextImageSection {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
}

export interface TextImageProps {
  sections: TextImageSection[];
  aspectRatio?: string; // e.g., "16:9", "4:3", "1:1"
  columnRatio?: [number, number]; // e.g., [50, 50] or [40, 60]
  transitionDuration?: number; // milliseconds, default 400
  className?: string;
}

// Default props
const defaultProps: Partial<TextImageProps> = {
  aspectRatio: '16:9',
  columnRatio: [50, 50],
  transitionDuration: 400,
};

export const TextImage: React.FC<TextImageProps> = ({
  sections,
  aspectRatio = defaultProps.aspectRatio,
  columnRatio = defaultProps.columnRatio,
  transitionDuration = defaultProps.transitionDuration,
  className,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Calculate aspect ratio values
  const aspectRatioData = useMemo(() => {
    if (!aspectRatio) return null;
    try {
      const { width, height } = parseAspectRatio(aspectRatio);
      return {
        ratio: calculateAspectRatio(width, height),
        cssValue: `${width}/${height}`,
        className: getAspectRatioClass(aspectRatio)
      };
    } catch (error: unknown) {
      console.warn('Invalid aspect ratio, falling back to auto:', error);
      return null;
    }
  }, [aspectRatio]);

  // Preload all images
  useEffect(() => {
    const imagePromises = sections.map((section) => {
      return new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = section.imageUrl;
      });
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch((error: unknown) => {
        console.warn('Some images failed to preload:', error);
        setImagesLoaded(true); // Continue anyway
      });
  }, [sections]);

  return (
    <section className={`${styles.textImageContainer} ${className || ''}`}>
      <div className={styles.content}>
        {/* Mobile View: Stacked layout */}
        <div className={styles.mobileLayout}>
          {sections.map((section, index) => (
            <div key={section.id} className={styles.mobileSection}>
              <div className={styles.textContent}>
                <h2 className={styles.title}>{section.title}</h2>
                <p className={styles.description}>{section.content}</p>
              </div>
              <div className={styles.imageContent}>
                <Image
                  src={section.imageUrl}
                  alt={section.imageAlt}
                  width={800}
                  height={aspectRatioData ? Math.round(800 / aspectRatioData.ratio) : 450}
                  className={styles.image}
                  priority={index === 0} // Prioritize first image
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Two-column layout with sticky images */}
        <div className={styles.desktopLayout}>
          <div 
            className={styles.textColumn}
            style={{ flex: columnRatio ? columnRatio[0] : 50 }}
          >
            {sections.map((section, index) => (
              <div key={section.id} className={styles.textSection} data-section-id={section.id}>
                <h2 className={styles.title}>{section.title}</h2>
                <p className={styles.description}>{section.content}</p>
              </div>
            ))}
          </div>
          
          <div 
            className={styles.imageColumn}
            style={{ flex: columnRatio ? columnRatio[1] : 50 }}
          >
            <div 
              className={styles.stickyImageContainer}
              style={{
                aspectRatio: aspectRatioData?.cssValue || '16/9',
                opacity: imagesLoaded ? 1 : 0.7
              }}
            >
              {!imagesLoaded && (
                <div className={styles.loadingPlaceholder}>
                  Loading images...
                </div>
              )}
              {sections.map((section, index) => (
                <Image
                  key={section.id}
                  src={section.imageUrl}
                  alt={section.imageAlt}
                  fill
                  className={`${styles.stickyImage} ${index === activeImageIndex ? styles.active : ''}`}
                  data-section-id={section.id}
                  priority={index === 0}
                  sizes="(max-width: 768px) 0vw, 50vw"
                  style={{
                    objectFit: 'cover',
                    transition: `opacity ${transitionDuration}ms ease-in-out`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};