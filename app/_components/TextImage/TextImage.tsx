'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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

// Custom hook for scroll-based image transitions
interface ScrollTriggerOptions {
  threshold?: number | number[];
  rootMargin?: string;
}

interface ScrollTriggerReturn {
  activeIndex: number;
  registerSection: (element: HTMLElement | null, index: number) => void;
  unregisterSection: (index: number) => void;
}

const useScrollTrigger = (
  sectionsCount: number, 
  options: ScrollTriggerOptions = {}
): ScrollTriggerReturn => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<Map<number, HTMLElement>>(new Map());
  const lastScrollY = useRef(0);

  const { threshold = 0.5, rootMargin = '-20% 0px -20% 0px' } = options;

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Unregister a section
  const unregisterSection = useCallback((index: number) => {
    const element = sectionsRef.current.get(index);
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
      sectionsRef.current.delete(index);
    }
  }, []);

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
    unregisterSection,
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
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Use our custom scroll trigger hook with enhanced settings
  const { activeIndex: activeImageIndex, registerSection } = useScrollTrigger(
    sections.length,
    {
      threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for better detection
      rootMargin: '-30% 0px -30% 0px' // Trigger when section is centered in viewport
    }
  );

  // State for smooth transitions
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State for dynamic sticky positioning
  const [stickyOffset, setStickyOffset] = useState(32); // Default 2rem
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Handle smooth transitions between image changes
  useEffect(() => {
    // Clear any existing transition timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Set transitioning state
    setIsTransitioning(true);

    // Clear transitioning state after transition completes
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [activeImageIndex, transitionDuration]);

  // Calculate optimal sticky offset based on viewport and content
  useEffect(() => {
    const calculateStickyOffset = () => {
      const viewportHeight = window.innerHeight;
      const textColumnElement = document.querySelector(`.${styles.textColumn}`) as HTMLElement;
      
      if (textColumnElement && imageContainerRef.current) {
        const textRect = textColumnElement.getBoundingClientRect();
        const imageRect = imageContainerRef.current.getBoundingClientRect();
        
        // Calculate offset to center image container vertically within the text content area
        const textCenterY = textRect.top + (textRect.height / 2);
        const imageCenterY = imageRect.height / 2;
        const optimalOffset = Math.max(16, textCenterY - imageCenterY);
        
        setStickyOffset(Math.min(optimalOffset, viewportHeight * 0.3)); // Max 30% of viewport
      }
    };

    // Calculate on mount and resize
    calculateStickyOffset();
    
    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateStickyOffset, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [sections.length, imagesLoaded]);

  // Ref callback to register text sections with intersection observer
  const createSectionRef = useCallback((index: number) => {
    return (element: HTMLElement | null) => {
      if (element) {
        registerSection(element, index);
      }
    };
  }, [registerSection]);

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

  // // Preload images for smooth transitions (optional - Next.js Image handles optimization)
  // useEffect(() => {
  //   // Simple timeout fallback if you want to remove preloading entirely
  //   const timer = setTimeout(() => setImagesLoaded(true), 100);
    
  //   const imagePromises = sections.map((section) => {
  //     return new Promise<void>((resolve, reject) => {
  //       const img = new window.Image();
  //       img.onload = () => resolve();
  //       img.onerror = reject;
  //       img.src = section.imageUrl;
  //     });
  //   });

  //   Promise.all(imagePromises)
  //     .then(() => {
  //       clearTimeout(timer);
  //       setImagesLoaded(true);
  //     })
  //     .catch((error: unknown) => {
  //       console.warn('Some images failed to preload:', error);
  //       clearTimeout(timer);
  //       setImagesLoaded(true); // Continue anyway
  //     });

  //   return () => clearTimeout(timer);
  // }, [sections]);

  // Simple approach - just show immediately
useEffect(() => {
  setImagesLoaded(true);
}, []);

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
              className={`${styles.stickyImageContainer} ${isTransitioning ? styles.transitioning : ''}`}
              style={{
                position: 'sticky',
                top: `${stickyOffset}px`, // Dynamic positioning restored
                aspectRatio: aspectRatioData?.cssValue || '16/9',
                opacity: imagesLoaded ? 1 : 0.7,
                '--transition-duration': `${transitionDuration}ms`
              } as React.CSSProperties & { '--transition-duration': string }}
            >
              {!imagesLoaded && (
                <div className={styles.loadingPlaceholder}>
                  Loading images...
                </div>
              )}
              
              {/* Debug indicator - remove in production */}
              <div className={styles.debugIndicator}>
                <div>Active: {activeImageIndex + 1} / {sections.length}</div>
                <div>Sections: {sections.length}</div>
                <div>Container: {sections.length * 100}vh</div>
                <div>Transition: {isTransitioning ? 'Active' : 'Idle'}</div>
                <div>Offset: {Math.round(stickyOffset)}px</div>
                <div>Position: sticky</div>
              </div>
              {sections.map((section, index) => (
                <Image
                  key={section.id}
                  src={section.imageUrl}
                  alt={section.imageAlt}
                  width={600}
                  height={aspectRatioData ? Math.round(600 / aspectRatioData.ratio) : 400}
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