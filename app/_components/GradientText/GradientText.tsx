"use client";
import { useRef, useEffect } from "react";
import styles from "./GradientText.module.scss";

interface GradientTextProps {
  text: string;
  animationDelay?: number;
  showControls?: boolean;
  className?: string;
}

export default function GradientText({ 
  text, 
  animationDelay = 200, 
  showControls = true,
  className = ""
}: GradientTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const activeTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Helper: clear all active timeouts
  const clearActiveTimeouts = () => {
    activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    activeTimeoutsRef.current = [];
  };

  // Helper: run forward animation
  const animateForward = () => {
    if (!containerRef.current) return;
    
    // Clear any existing animations
    clearActiveTimeouts();
    
    const letters = containerRef.current.querySelectorAll(`.${styles.letter}`);
    letters.forEach((letter, i) => {
      const timeout = setTimeout(() => {
        letter.classList.add(styles.active);
      }, i * animationDelay);
      activeTimeoutsRef.current.push(timeout);
    });
  };

  // Helper: run reverse animation
  const animateReverse = () => {
    if (!containerRef.current) return;
    
    // Clear any existing animations
    clearActiveTimeouts();
    
    const letters = containerRef.current.querySelectorAll(`.${styles.letter}`);
    const total = letters.length;
    letters.forEach((letter, i) => {
      const timeout = setTimeout(() => {
        letter.classList.remove(styles.active);
      }, (total - 1 - i) * animationDelay); // Reverse the order
      activeTimeoutsRef.current.push(timeout);
    });
  };

  // Build the letters when text changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Clear any existing animations when text changes
    clearActiveTimeouts();
    
    container.innerHTML = ""; // clear old text

    text.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.classList.add(styles.letter);

      // Only apply gradient to non-space characters
      if (char !== " ") {
        // Assign gradient slice - each letter gets a portion of the gradient
        const percent = text.length > 1 ? (i / (text.length - 1)) * 100 : 0;
        span.style.background = `linear-gradient(to right, darkorange ${percent}%, orange ${percent + 10}%)`;
        span.style.webkitBackgroundClip = "text";
        span.style.backgroundClip = "text";
      } else {
        // For spaces, just set width and no background
        span.style.background = "none";
        span.style.width = "0.3em";
      }

      container.appendChild(span);
    });
  }, [text]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearActiveTimeouts();
    };
  }, []);

  return (
    <div className={`${styles.container} ${className}`}>
      <h1 className={styles.text} ref={containerRef}></h1>

      {showControls && (
        <div className={styles.buttons}>
          <button 
            className={styles.button}
            onClick={animateForward}
          >
            Fade In (Forward)
          </button>
          <button 
            className={styles.button}
            onClick={animateReverse}
          >
            Fade Out (Reverse)
          </button>
        </div>
      )}
    </div>
  );
}

// Export the animation functions for external control
export { GradientText };
