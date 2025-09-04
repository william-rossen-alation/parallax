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