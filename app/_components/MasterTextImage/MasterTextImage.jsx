"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import styles from './MasterTextImage.module.scss';

const MasterTextImage = ({ data }) => {
  const containerRef = useRef(null);
  const imageRefs = useRef(new Array(data.length).fill(null));
  const textRefs = useRef(new Array(data.length).fill(null));
  const masterTimelineRef = useRef(null);

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

  // GSAP Timeline Functions
  const createDynamicTimeline = (data, containerRef) => {
    const numSections = data.length;
    const transitionDuration = 0.05; // 5%
    const sectionDuration = (1 - (numSections - 1) * transitionDuration) / numSections;
    
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${numSections * 100}vh`, // Dynamic scroll distance
        pin: true,
        scrub: 1,
        markers: true, // Enable for Phase 2 testing
        onUpdate: (self) => {
          console.log('Scroll progress:', self.progress);
        }
      }
    });

    // Dynamic timeline labels
    data.forEach((_, index) => {
      const sectionStart = index * sectionDuration;
      const sectionEnd = sectionStart + sectionDuration;
      
      masterTimeline.addLabel(`section${index + 1}Start`, sectionStart)
                    .addLabel(`section${index + 1}End`, sectionEnd);
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
        
        // Wait for images to be referenced
        if (!imageRefs.current.every(ref => ref !== null)) {
          console.warn('Not all image refs are initialized yet');
          return;
        }
        
        const { masterTimeline, sectionDuration, transitionDuration } = createDynamicTimeline(data, containerRef);
        masterTimelineRef.current = masterTimeline;
        
        // Only create image animations for Phase 2
        createImageAnimations(data, masterTimeline, sectionDuration, transitionDuration, imageRefs);
        
        console.log('Phase 2: Image animations initialized');
        
      } catch (error) {
        console.error('Failed to initialize animations:', error);
      }
    };

    // Add a small delay to ensure refs are populated
    const timeoutId = setTimeout(() => {
      initializeAnimations();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
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
  }, [data]);

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
