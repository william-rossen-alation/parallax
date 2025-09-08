import styles from "./HeroGradient.module.scss";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const HeroGradient = ({ className }) => {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(hero, 
      {
        "--gradient-start": "#001C2D",
        "--gradient-end": "#003A5C",
      },
      {
        "--gradient-start": "#7AB8D9",
        "--gradient-end": "#B8D4E3",
        scrollTrigger: {
          id: "hero-gradient",
          trigger: hero,
          pin: true,
          start: "top top",
          end: "+=10000",
          scrub: 1,
          markers: true,
        }
      }
    )
  },[])

  return (
    <div>
      <div
        ref={heroRef} 
        className={`${styles.hero} hero h-screen`}
        style={{
          background: "linear-gradient(180deg, var(--gradient-start, #001C2D) 0%, var(--gradient-end, #003A5C) 100%)"
        }}
      >
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>HERO</h1>
        </div>
      </div>
    </div>
  )
}

export const HeroGradientOpacityOverlay = ({ className }) => {
  const overlayRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        pin: heroRef.current,
        start: "top top",
        end: "+=40000",
        scrub: 1,
        markers: true,
      }
    })
    .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1 })
    // .fromTo(heroRef.current, { "--text-color": "#ffffff" }, { "--text-color": "#35444D" }, 0); // 0 means start at the same time

    // gsap.fromTo(overlayRef.current, 
    //   {
    //     opacity: 0,
    //   },
    //   {
    //     opacity: 1,
    //     scrollTrigger: {
    //       trigger: heroRef.current,
    //       pin: heroRef.current,
    //       start: "top top",
    //       end: "+=40000",
    //       // end: "bottom top",
    //       scrub: 1,
    //       markers: true,
    //     }
    //   }
    // )
  },[])

  return (
    <div ref={heroRef} className={`${styles.heroOverlay} hero h-screen relative bg-gradient-to-b from-gray-900 to-gray-800`}>
      <div 
      ref={overlayRef}
      className={`${styles.heroOverlay__overlay} absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-500 opacity-0`}
      />
      <div className={styles.heroOverlay__content}>
        <h1 style={{ color: "var(--text-color, #ffffff)" }}>Opacity Overlay Hero Gradient</h1>
      </div>
    </div>
  )
}