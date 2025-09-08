# TextImage Component Animation Implementation Plan

## Overview
Create a coordinated scroll-based animation system where text and images transition together seamlessly. Each text animation is synchronized with its corresponding image fade transitions.

## Animation Requirements
- **Image Transitions**: Fade in/out effect between N images (variable quantity)
- **Text Animation**: Each text moves from bottom of screen → center → top of screen
- **Coordination**: Text appears as its image fades in, exits as its image fades out
- **No Image Gaps**: Users never see empty space on the right side - always a centered image
- **Scalability**: Handle any number of Text & Image combinations dynamically

## Approach 1: Master Timeline Implementation

### Core Strategy
- Single ScrollTrigger spanning all three TextImage sections
- One master GSAP timeline with percentage-based keyframes
- Shared image container fixed on right side of viewport
- Individual text animations coordinated through timeline labels

### Dynamic Timeline Structure (100% = total scroll distance)

#### Timeline Calculation Formula
For N sections:
- **Section Duration**: `(100 - (N-1) * transitionDuration) / N`
- **Transition Duration**: `5%` (configurable overlap period)
- **Text Enter Duration**: `10%` of section
- **Text Visible Duration**: `75%` of section  
- **Text Exit Duration**: `15%` of section
- **Image Overlap**: Transitions overlap with previous section end

#### Example for 3 Sections:
```
Section Duration = (100 - 2*5) / 3 = 30%
Transition Duration = 5%

Section 1: 0% - 30%
├── 0%: Image 1 fully visible (opacity: 1)
├── 0-3%: Text 1 enters from bottom (10% of 30%)
├── 3-25.5%: Text 1 visible in center (75% of 30%)
├── 25.5-30%: Text 1 exits to top (15% of 30%)
└── 25-30%: Image 1 fades out (overlaps with text exit)

Transition Zone 1: 25% - 30%
├── 25-30%: Image 1 fades out
└── 25-30%: Image 2 fades in (simultaneous crossfade)

Section 2: 30% - 60%
├── 30%: Image 2 fully visible
├── 30-33%: Text 2 enters from bottom
├── 33-55.5%: Text 2 visible in center
├── 55.5-60%: Text 2 exits to top
└── 55-60%: Image 2 fades out

Transition Zone 2: 55% - 60%
├── 55-60%: Image 2 fades out
└── 55-60%: Image 3 fades in

Section 3: 60% - 90%
├── 60%: Image 3 fully visible
├── 60-63%: Text 3 enters from bottom
├── 63-85.5%: Text 3 visible in center
└── 85.5-90%: Text 3 exits to top
```

#### Example for 5 Sections:
```
Section Duration = (100 - 4*5) / 5 = 16%
Each section gets 16% of timeline
Transition zones: 5% each
```

### Technical Implementation

#### 1. Component Structure Changes
```jsx
// page.tsx - Remove individual TextImage components
// Create single container with:
// - Fixed image container (right side)
// - Text animation areas (left side)
// - Master ScrollTrigger
```

#### 2. Complete Component Implementation
```jsx
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

  // Animation initialization
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
        
        if (!imageRefs.current.every(ref => ref !== null)) {
          throw new Error('Not all image refs are initialized');
        }
        
        if (!textRefs.current.every(ref => ref !== null)) {
          throw new Error('Not all text refs are initialized');
        }
        
        const { masterTimeline, sectionDuration, transitionDuration } = createDynamicTimeline(data, containerRef);
        masterTimelineRef.current = masterTimeline;
        
        createAnimations(data, masterTimeline, sectionDuration, transitionDuration, imageRefs, textRefs);
        
      } catch (error) {
        console.error('Failed to initialize animations:', error);
      }
    };

    // Preload images before starting animations
    const imagePromises = data.map((item, index) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(index);
        img.onerror = () => {
          console.error(`Failed to load image: ${item.image}`);
          reject(new Error(`Image ${index} failed to load`));
        };
        img.src = item.image;
      });
    });
    
    Promise.allSettled(imagePromises).then((results) => {
      const failedImages = results.filter(result => result.status === 'rejected');
      if (failedImages.length > 0) {
        console.warn(`${failedImages.length} images failed to load`);
      }
      
      initializeAnimations();
    });

    // Cleanup function
    return () => {
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
              opacity: index === 0 ? 1 : 0,
              objectFit: 'contain' 
            }}
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
```

#### 3. Dynamic GSAP Timeline Setup
```javascript
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
```

#### 4. Dynamic Animation Keyframes
```javascript
const createAnimations = (data, masterTimeline, sectionDuration, transitionDuration, imageRefs, textRefs) => {
  data.forEach((item, index) => {
    const isLastSection = index === data.length - 1;
    
    // Calculate timing for this section
    const sectionStart = index * sectionDuration;
    const textEnterStart = sectionStart;
    const textEnterEnd = sectionStart + (sectionDuration * 0.10); // 10% of section
    const textExitStart = sectionStart + (sectionDuration * 0.85); // 85% of section
    const textExitEnd = sectionStart + sectionDuration;
    
    // Image transition timing (overlaps with text exit)
    const imageFadeOutStart = sectionStart + sectionDuration - transitionDuration;
    const imageFadeInEnd = sectionStart + sectionDuration;
    
    // TEXT ANIMATIONS
    // Set initial position
    gsap.set(textRefs.current[index], { y: "100vh" });
    
    // Text enter animation
    masterTimeline.to(textRefs.current[index], {
      y: "0vh",
      duration: textEnterEnd - textEnterStart,
      ease: "power2.out"
    }, textEnterStart);
    
    // Text exit animation
    masterTimeline.to(textRefs.current[index], {
      y: "-100vh", 
      duration: textExitEnd - textExitStart,
      ease: "power2.in"
    }, textExitStart);
    
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

// Usage:
const { masterTimeline, sectionDuration, transitionDuration } = createDynamicTimeline(data, containerRef);
createAnimations(data, masterTimeline, sectionDuration, transitionDuration, imageRefs, textRefs);
```

### CSS Requirements

#### 1. Master Container
```scss
.masterContainer {
  height: 100vh;
  display: flex;
  overflow: hidden;
}
```

#### 2. Image Container (Right Side)
```scss
.imageContainer {
  position: relative; // Required for Next.js Image with fill={true}
  flex: 1;
  width: 50%;
  height: 100%;
  
  // Next.js Image component styles
  img {
    position: absolute !important; // Override Next.js defaults
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
  }
}
```

#### 3. Text Container (Left Side)
```scss
.textContainer {
  flex: 1;
  width: 50%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .textItem {
    position: absolute;
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    width: 80%; // Prevent text from touching edges
    white-space: nowrap; // Prevent wrapping during animation
    overflow: hidden; // Hide overflow during animation
  }
}
```

## Scalability Features

### Configuration Options
```javascript
const CONFIG = {
  transitionDuration: 0.05, // 5% - Time for image fade transitions
  textEnterRatio: 0.10,     // 10% - Text enter animation as % of section
  textVisibleRatio: 0.75,   // 75% - Text visible time as % of section  
  textExitRatio: 0.15,      // 15% - Text exit animation as % of section
  scrollMultiplier: 100,    // 100vh per section base scroll distance
  imageOverlap: 0.05        // 5% - Image transition overlap
};
```

### Dynamic Data Handling
```javascript
// Component can handle variable array lengths
const data = [
  { image: "/path1.jpg", firstTitle: "Title 1" },
  { image: "/path2.jpg", firstTitle: "Title 2" },
  { image: "/path3.jpg", firstTitle: "Title 3" },
  { image: "/path4.jpg", firstTitle: "Title 4" },
  { image: "/path5.jpg", firstTitle: "Title 5" },
  // Recommended: 2-8 sections for optimal UX
  // Technical limit: ~12 sections before performance degrades
];

// Timeline automatically adjusts:
// 2 items: Each section gets ~47.5% of timeline (5% transition)
// 3 items: Each section gets ~30% of timeline  
// 4 items: Each section gets ~21.67% of timeline  
// 5 items: Each section gets ~16% of timeline
// 8 items: Each section gets ~8.75% of timeline
```

### Responsive Section Sizing
```javascript
const calculateSectionMetrics = (numSections, config = CONFIG) => {
  const totalTransitionTime = (numSections - 1) * config.transitionDuration;
  const availableTime = 1 - totalTransitionTime;
  const sectionDuration = availableTime / numSections;
  
  return {
    sectionDuration,
    textEnterDuration: sectionDuration * config.textEnterRatio,
    textVisibleDuration: sectionDuration * config.textVisibleRatio,
    textExitDuration: sectionDuration * config.textExitRatio,
    scrollDistance: `+=${numSections * config.scrollMultiplier}vh`
  };
};
```

### Validation and Constraints
```javascript
const validateDataLength = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Data must be a non-empty array');
    return false;
  }
  
  if (data.length < 2) {
    console.warn('Minimum 2 sections required for smooth transitions');
    return false;
  }
  
  if (data.length > 8) {
    console.warn('More than 8 sections may impact user experience (too much scrolling)');
  }
  
  if (data.length > 12) {
    console.error('More than 12 sections will likely cause performance issues');
    return false;
  }
  
  // Validate data structure
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
```

### Page Implementation
```jsx
// app/medium-text-image/page.tsx
import MasterTextImage from '../_components/MasterTextImage/MasterTextImage';

const tempData = [
  {
    image: "/medium-text-image/image1.webp",
    firstTitle: "First Title",
  },
  {
    image: "/medium-text-image/image2.webp",
    firstTitle: "Second Title",
  },
  {
    image: "/medium-text-image/image3.webp",
    firstTitle: "Third Title",
  }
];

export default function MediumTextImagePage() {
  return <MasterTextImage data={tempData} />;
}
```

### Performance Optimizations

The component now includes built-in optimizations:
- **Image Preloading**: All images load before animations start
- **Error Handling**: Graceful degradation for failed images or missing GSAP
- **GPU Acceleration**: Automatic force3D application via GSAP
- **Memory Management**: Proper cleanup of timelines and ScrollTriggers

### Testing & Debugging

1. **Enable ScrollTrigger Markers**
   ```javascript
   scrollTrigger: {
     // ... other options
     markers: true, // Remove in production
   }
   ```

2. **Console Logging for Timeline Progress**
   ```javascript
   onUpdate: (self) => {
     console.log('Progress:', self.progress);
     console.log('Current section:', getCurrentSection(self.progress));
   }
   ```

3. **Manual Timeline Control for Testing**
   ```javascript
   // Add to component for testing
   const testProgress = (progress) => {
     masterTimeline.progress(progress);
   };
   ```

### File Structure Changes

#### New Files to Create:
- `MasterTextImage.jsx` - New component replacing individual TextImage components
- `MasterTextImage.module.scss` - Styles for the master container

#### Files to Modify:
- `page.tsx` - Update to use new MasterTextImage component
- Remove or archive existing `TextImage.jsx` and `TextImage.module.scss`

### Implementation Steps

1. **Phase 1**: Create basic master container structure
2. **Phase 2**: Implement image fade transitions
3. **Phase 3**: Add coordinated text animations  
4. **Phase 4**: Fine-tune timing and transitions
5. **Phase 5**: Add performance optimizations
6. **Phase 6**: Testing and debugging

### Expected Outcome

Users will experience:
- Smooth scroll-based navigation through three content sections
- Seamless image transitions with no empty states
- Text that appears to "ride" with its corresponding image
- Perfectly synchronized animations that feel natural and engaging

---

*This plan ensures precise control over timing while maintaining smooth performance and visual continuity.*
