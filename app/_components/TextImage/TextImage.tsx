'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import styles from './styles.module.scss';

// Simple aspect ratio utility
const getAspectRatio = (aspectRatio?: string): { cssValue: string; ratio: number } => {
  if (!aspectRatio) return { cssValue: '16/9', ratio: 16/9 };
  
  const parts = aspectRatio.split(':').map(Number);
  if (parts.length === 2 && !parts.some(isNaN)) {
    return { cssValue: `${parts[0]}/${parts[1]}`, ratio: parts[0] / parts[1] };
  }
  
  // Fallback to 16:9
  return { cssValue: '16/9', ratio: 16/9 };
};


// Custom hook for scroll-based image transitions
interface ScrollTriggerOptions {
  threshold?: number | number[];
  rootMargin?: string;
}

interface ScrollTriggerReturn {
  activeIndex: number;
  registerSection: (element: HTMLElement | null, index: number) => void;
}

const useScrollTrigger = (
  sectionsCount: number, 
  options: ScrollTriggerOptions = {}
): ScrollTriggerReturn => {
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<Map<number, HTMLElement>>(new Map());

  const { threshold = 0.5, rootMargin = '-20% 0px -20% 0px' } = options;

  // Intersection Observer callback
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    let maxIntersectionRatio = 0;
    let mostVisibleIndex = 0;

    entries.forEach((entry) => {
      const element = entry.target as HTMLElement;
      const sectionIndex = parseInt(element.dataset.sectionIndex || '0', 10);

      // Find the section with the highest intersection ratio (most visible)
      if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
        maxIntersectionRatio = entry.intersectionRatio;
        mostVisibleIndex = sectionIndex;
      }
    });

    // Only update if we found an intersecting section
    if (maxIntersectionRatio > 0) {
      setActiveIndex(mostVisibleIndex);
    }
  }, []);

  // Register a section for observation
  const registerSection = useCallback((element: HTMLElement | null, index: number) => {
    if (!element) return;

    // Store element reference
    sectionsRef.current.set(index, element);
    element.dataset.sectionIndex = index.toString();

    // Create observer if it doesn't exist
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold,
        rootMargin,
      });
    }

    // Start observing
    observerRef.current.observe(element);
  }, [handleIntersection, threshold, rootMargin]);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      sectionsRef.current.clear();
    };
  }, []);

  return {
    activeIndex,
    registerSection,
  };
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
  showDebug?: boolean; // Show debug indicator, default false for production
}

// Default props
const defaultProps: Partial<TextImageProps> = {
  aspectRatio: '16:9',
  columnRatio: [50, 50],
  transitionDuration: 400,
  showDebug: process.env.NODE_ENV === 'development', // Auto-enable in development
};

export const TextImage: React.FC<TextImageProps> = ({
  sections,
  aspectRatio = defaultProps.aspectRatio,
  columnRatio = defaultProps.columnRatio,
  transitionDuration = defaultProps.transitionDuration,
  className,
  showDebug = defaultProps.showDebug,
}) => {
  const imagesLoaded = true; // Simplified - Next.js Image handles loading
  
  // Use our custom scroll trigger hook with enhanced settings
  const { activeIndex: activeImageIndex, registerSection } = useScrollTrigger(
    sections.length,
    {
      threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for better detection
      rootMargin: '-30% 0px -30% 0px' // Trigger when section is centered in viewport
    }
  );

  // Ref for the image container
  const imageContainerRef = useRef<HTMLDivElement>(null);



  // Ref callback to register text sections with intersection observer
  const createSectionRef = useCallback((index: number) => {
    return (element: HTMLElement | null) => {
      if (element) {
        registerSection(element, index);
      }
    };
  }, [registerSection]);

  // Get aspect ratio values
  const aspectRatioData = useMemo(() => getAspectRatio(aspectRatio), [aspectRatio]);


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
                  height={Math.round(800 / aspectRatioData.ratio)}
                  className={styles.image}
                  priority={index === 0} // Prioritize first image
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Two-column layout with sticky images */}
        <div 
          className={styles.desktopLayout}
          style={{
            height: `${sections.length * 100}vh`,
            maxHeight: `${sections.length * 40}rem`
          }}
        >
          <div 
            className={styles.textColumn}
            style={{ flexBasis: `${columnRatio ? columnRatio[0] : 50}%` }}
          >
            {sections.map((section, index) => (
              <div 
                key={section.id} 
                ref={createSectionRef(index)}
                className={`${styles.textSection} ${index === activeImageIndex ? styles.activeSection : ''}`} 
                data-section-id={section.id}
              >
                <h2 className={styles.title}>{section.title}</h2>
                <p className={styles.description}>{section.content}</p>
              </div>
            ))}
          </div>
          
          <div 
            className={styles.imageColumn}
            style={{ flexBasis: `${columnRatio ? columnRatio[1] : 50}%` }}
          >
            <div 
              ref={imageContainerRef}
              className={styles.stickyImageContainer}
              style={{
                position: 'sticky',
                top: '2rem', // Simple fixed offset
                aspectRatio: aspectRatioData.cssValue,
                opacity: imagesLoaded ? 1 : 0.7,
                '--transition-duration': `${transitionDuration}ms`
              } as React.CSSProperties & { '--transition-duration': string }}
            >
              
              {/* Debug indicator - controlled by showDebug prop */}
              {showDebug && (
                <div className={styles.debugIndicator}>
                  <div>Active: {activeImageIndex + 1} / {sections.length}</div>
                  <div>Sections: {sections.length}</div>
                  <div>Container: {sections.length * 100}vh</div>
                  <div>Offset: 2rem</div>
                  <div>Position: sticky</div>
                </div>
              )}
              {sections.map((section, index) => (
                <Image
                  key={section.id}
                  src={section.imageUrl}
                  alt={section.imageAlt}
                  width={600}
                  height={Math.round(600 / aspectRatioData.ratio)}
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