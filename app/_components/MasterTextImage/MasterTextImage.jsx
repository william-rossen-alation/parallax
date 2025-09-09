"use client";

import { useRef, useEffect } from 'react';
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

  // Validation function
  const validateDataLength = (data) => {
    return Array.isArray(data) && data.length > 0;
  };

  // GSAP Timeline Functions
  const createDynamicTimeline = (data, containerRef) => {
    const numSections = data.length;
    const transitionDuration = DEFAULTS.TRANSITION_DURATION;
    const sectionDuration = (1 - (numSections - 1) * transitionDuration) / numSections;
    
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${numSections * scrollDistancePerSection}vh`, // Configurable scroll distance
        pin: true,
        scrub: 1,
        // markers: true, // Disabled for production
        onUpdate: (self) => {
          // Optional: Enable for debugging
          // console.log('Scroll progress:', self.progress);
        }
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
      // Calculate timing for this section
      const sectionStart = index * sectionDuration;
      const sectionEnd = sectionStart + sectionDuration;
      
      // TEXT ANIMATIONS
      // Set initial position (start from bottom of viewport)
      gsap.set(textRefs.current[index], { y: "100vh" });
      
      // Single continuous animation: bottom → center → top
      // This spans the entire section duration for smooth, consistent movement
      masterTimeline.to(textRefs.current[index], {
        y: "-100vh", // Move from 100vh to -100vh (bottom to top)
        duration: sectionDuration, // Use full section duration
        ease: "none" // Linear movement to match scroll speed
      }, sectionStart);
    });
  };

  // Phase 2: Initialize image animations
  useEffect(() => {
    if (!validateDataLength(data)) {
      return;
    }

    const initializeAnimations = () => {
      try {
        if (typeof gsap === 'undefined') {
          throw new Error('GSAP library not loaded');
        }
        
        gsap.registerPlugin(ScrollTrigger);
        
        // Wait for all refs to be initialized
        if (!imageRefs.current.every(ref => ref !== null)) {
          console.warn('Not all image refs are initialized yet');
          return;
        }
        
        if (!textRefs.current.every(ref => ref !== null)) {
          console.warn('Not all text refs are initialized yet');
          return;
        }
        
        const { masterTimeline, sectionDuration, transitionDuration } = createDynamicTimeline(data, containerRef);
        masterTimelineRef.current = masterTimeline;

        // Create both image and text animations
        createImageAnimations(data, masterTimeline, sectionDuration, transitionDuration, imageRefs);
        createTextAnimations(data, masterTimeline, sectionDuration, transitionDuration, textRefs);
        
        // console.log('Phase 4: Optimized animations initialized'); // Debug log
        
      } catch (error) {
        console.error('Failed to initialize animations:', error);
      }
    };

    // Initialize animations after a small delay to ensure refs are populated
    // Note: Next.js handles image optimization and preloading automatically
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
  }, [data, scrollDistancePerSection]);

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
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`${styles.imageItem} ${index === 0 ? styles.firstImage : ''}`}
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
          >
            {item.firstTitle}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterTextImage;
