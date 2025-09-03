import styles from "./Hero.module.scss";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


const ImageOverlay = ({ ref }) => {
  return (
    <div ref={ref} className={styles.imageOverlay}>
      <Image  
        src="/dragon.png"
        alt="dragon"
        style={{ objectFit: 'contain' }}
        fill
      />
    </div>
  )
}

export const Hero = ({ className }) => {
  const trigger = useRef(null);
  const target = useRef(null);
  const timeline = useRef(null);
  const overlay = useRef(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);


    let tl = gsap.timeline({
      scrollTrigger: {
        id: "hero",
        trigger: trigger.current,
        start: "top top",
        end: "+=80000",
        pin: true,
        scrub: true,
        // markers: true,
      },
    });

    // tl.fromTo(overlay.current,
    //   { y: 0, rotation: 0, scale: 1 },
    //   { y: -800, rotation: 360, scale: 3},
    //   0,
    // ).set({},{}, 0.2)

    // const dragonArriveTween = gsap.to(overlay.current, {  
    //   y: -800,
    //   rotation: 360,
    //   scale: 2,
    //   duration: 2, // duration in seconds
    // }, 1);  // when to start in seconds after the timeline starts (1 would be 1/5th of timeline with the 5 coming from the duration I set below)

    // const dragonLeaveTween = gsap.to(overlay.current, { 
    //   y: 0,
    //   rotation: 0,
    //   scale: 1,
    //   duration: 2,
    // }, 3);

    // console.log('dragonArriveTween duration: ', dragonArriveTween.duration());
    
    // tl.add(dragonArriveTween, 1);
    tl.to(overlay.current, {  
        y: -800,
        rotation: 360,
        scale: 2,
        duration: 2, // duration in seconds
      }, 0)
      .to(overlay.current, {
        rotation: -360,
        scale: 0.02,
        duration: 2,
      }, 3)

    tl.set({}, {}, 5); // 5 sets to the total timeline duration in seconds
    console.log('tl duration: ', tl.duration());
    /*
    THe seconds are converted to scroll progress, so if we set a total timeline duration of 5 seconds we can then set the percentage of scroll progress on each tween using a second duration (e.g. 2 seconds for the dragon tween means it will finish at 40% of the total timeline duration)
    The Math:
      With your end: "+=80000" (80,000px scroll):
      Timeline = 5 seconds: Animation finishes at ~10% of scroll (8,000px in)
      Timeline = 10 seconds: Animation finishes at ~5% of scroll (4,000px in)
      Timeline = 1 second: Animation finishes at ~50% of scroll (40,000px in)
    
      Animation completion % = (Natural animation duration) / (Total timeline duration)

      Most GSAP tweens default to 0.5 seconds unless specified otherwise
    */

  }, []);
  return (
    <div>
      <div ref={trigger} className={`${styles.background} ${className}`}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>HERO</h1>
        </div>
        <ImageOverlay ref={overlay} />
      </div>

    </div>

  )
}