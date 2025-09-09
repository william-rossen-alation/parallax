"use client";

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import styles from './MasterTextImage.module.scss';

// Constants
const DEFAULTS = {
  TRANSITION_DURATION: 0.05, // 5% of section duration for image crossfades
  INITIALIZATION_DELAY: 100, // ms delay for refs to populate
  SCROLL_DISTANCE_PER_SECTION: 400 // vh per section
};

const MasterTextImage = ({ data, scrollDistancePerSection = DEFAULTS.SCROLL_DISTANCE_PER_SECTION }) => {
  const containerRef = useRef(null);
  const imageRefs = useRef(new Array(data.length).fill(null));
  const textRefs = useRef(new Array(data.length).fill(null));
  const masterTimelineRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Validation function
  const validateDataLength = (data) => {
    return Array.isArray(data) && data.length > 0;
  };

  // GSAP Timeline Functions
  const createDynamicTimeline = (data, containerRef) => {
    const numSections = data.length;
    const transitionDuration = DEFAULTS.TRANSITION_DURATION;
    const sectionDuration = (1 - (numSections - 1) * transitionDuration) / numSections;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${numSections * scrollDistancePerSection}vh`,
        pin: true,
        scrub: prefersReducedMotion ? false : 1
      }
    });
    
    return { masterTimeline, sectionDuration, transitionDuration };
  };

  const createImageAnimations = (data, masterTimeline, sectionDuration, transitionDuration, imageRefs) => {
    data.forEach((item, index) => {
      const isLastSection = index === data.length - 1;
      
      // Calculate timing for this section
      const sectionStart = index * sectionDuration;
      
      // Image transition timing (overlaps with previous section end)
      const imageFadeOutStart = sectionStart + sectionDuration - transitionDuration;
      
      // IMAGE TRANSITIONS (except for last section)
      if (!isLastSection) {
        // Fade out current image (starts before section ends)
        masterTimeline.to(imageRefs.current[index], {
          opacity: 0,
          duration: transitionDuration,
          ease: "none"
        }, imageFadeOutStart);
        
        // Fade in next image (simultaneous crossfade)
        masterTimeline.to(imageRefs.current[index + 1], {
          opacity: 1,
          duration: transitionDuration,
          ease: "none"
        }, imageFadeOutStart); // Same start time for crossfade
      }
    });
  };

  const createTextAnimations = (data, masterTimeline, sectionDuration, transitionDuration, textRefs) => {
    data.forEach((item, index) => {
      const sectionStart = index * sectionDuration;
      
      // Set initial position and create smooth bottom-to-top animation
      gsap.set(textRefs.current[index], { y: "100vh" });
      
      masterTimeline.to(textRefs.current[index], {
        y: "-100vh",
        duration: sectionDuration,
        ease: "none"
      }, sectionStart);
    });
  };

  // Initial mobile detection (once on page load only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    }
  }, []);

  // Initialize scroll-triggered animations (desktop only)
  useEffect(() => {
    // Skip GSAP initialization on mobile
    if (isMobile) {
      return;
    }
    if (!validateDataLength(data)) {
      return;
    }

    // Performance warning for large datasets
    if (data.length > 8) {
      console.warn(`${data.length} sections may impact performance. Consider splitting into multiple components.`);
    }

    const validateRefs = () => {
      const allRefsValid = imageRefs.current.every(ref => ref !== null) && 
                          textRefs.current.every(ref => ref !== null);
      if (!allRefsValid) {
        console.warn('Not all refs are initialized yet');
        return false;
      }
      return true;
    };

    const initializeAnimations = () => {
      try {
        gsap.registerPlugin(ScrollTrigger);
        
        if (!validateRefs()) {
          return;
        }
        
        const { masterTimeline, sectionDuration, transitionDuration } = createDynamicTimeline(data, containerRef);
        masterTimelineRef.current = masterTimeline;

        // Create both image and text animations
        createImageAnimations(data, masterTimeline, sectionDuration, transitionDuration, imageRefs);
        createTextAnimations(data, masterTimeline, sectionDuration, transitionDuration, textRefs);
        
      } catch (error) {
        console.error('Failed to initialize animations:', error);
        setHasError(true);
      }
    };

    // Initialize animations after a small delay to ensure refs are populated
    const timeoutId = setTimeout(() => {
      initializeAnimations();
    }, DEFAULTS.INITIALIZATION_DELAY);

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      try {
        if (masterTimelineRef.current) {
          masterTimelineRef.current.kill();
        }
        
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger) trigger.kill();
        });
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    };
  }, [data, scrollDistancePerSection, isMobile]);

  if (!validateDataLength(data)) {
    return <div className={styles.errorContainer}>Invalid data provided</div>;
  }

  // Fallback UI when animations fail
  if (hasError) {
    return (
      <div className={styles.fallbackContainer}>
        <div className={styles.fallbackContent}>
          <p className={styles.fallbackMessage}>
            Interactive animations are unavailable, but content is still accessible:
          </p>
          {data.map((item, index) => (
            <div key={index} className={styles.fallbackSection}>
              <h2 className={styles.fallbackTitle}>{item.firstTitle}</h2>
              <div className={styles.fallbackImageWrapper}>
                <Image
                  src={item.image}
                  alt={`${item.firstTitle} - Section ${index + 1} image`}
                  width={600}
                  height={400}
                  className={styles.fallbackImage}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mobile Layout (early return - completely separate from desktop)
  if (isMobile) {
    return (
      <div className={styles.mobileContainer}>
        <div className={styles.mobileContent}>
          {data.map((item, index) => (
            <section key={index} className={styles.mobileSection}>
              <div className={styles.mobileImageWrapper}>
                <Image
                  src={item.image}
                  width={400}
                  height={300}
                  className={styles.mobileImage}
                  alt={`${item.firstTitle} - Section ${index + 1}`}
                  sizes="100vw"
                />
              </div>
              <div className={styles.mobileTextWrapper}>
                <h2 className={styles.mobileTitle}>{item.firstTitle}</h2>
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={styles.masterContainer}
      role="region"
      aria-label="Interactive scroll-based content with text and images"
    >
      {/* Fixed Image Container */}
      <div className={styles.imageContainer}>
        {data.map((item, index) => (
          <Image 
            key={`image-${index}`}
            ref={el => imageRefs.current[index] = el}
            src={item.image} 
            fill={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`${styles.imageItem} ${index === 0 ? styles.firstImage : ''}`}
            alt={`${item.firstTitle} - Section ${index + 1} image`}
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
            role="heading"
            aria-level="2"
            aria-live="polite"
            aria-label={`Section ${index + 1}: ${item.firstTitle}`}
          >
            {item.firstTitle}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterTextImage;
