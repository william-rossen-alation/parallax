"use client";

import styles from "./TextImage.module.scss";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const TextImage = ({ item, index }) => {
  const trigger = useRef(null);
  const imageTarget = useRef(null);
  const titleTarget = useRef(null);



  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial position of text to start from bottom
    gsap.set(titleTarget.current, {
      y: "100vh", // Start from bottom of viewport
    });

    let tl = gsap.timeline({
      scrollTrigger: {
        id: "textImage",
        trigger: trigger.current,
        start: "top top",
        end: "+=400%", // Adjust this to control scroll distance. +=200% means the effect lasts for 200% of viewport height worth of scrolling
        pin: true,
        scrub: 1, // Smooth scrubbing
        // markers: true, // Uncomment to see trigger points
      },
    });

    // Animate text from bottom to top
    tl.to(titleTarget.current, {
      y: "-100vh", // Move to top of viewport
      ease: "none", // Linear movement for smooth scroll effect
      duration: 1,
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getById("textImage")?.kill();
    };
  }, []);

  return (
    <div ref={trigger} key={`${index}-text-image`} className={styles.itemWrapper}>
      <div ref={titleTarget}>{item.firstTitle}</div>
      <div ref={imageTarget}className={styles.imageContainer}>
        <Image 
          src={`${item.image}`}
          alt={item.firstTitle} 
          fill={true}
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  );
};
