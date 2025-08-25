'use client';
import { useRef, useEffect, useState } from 'react';
import styles from './page.module.scss';
import Picture1 from '@/public/parallax-scroll/4.jpg';
import Picture2 from '@/public/parallax-scroll/5.jpg';
import Picture3 from '@/public/parallax-scroll/6.jpg';
import Picture4 from '@/public/parallax-scroll/1.jpg';
import Picture5 from '@/public/parallax-scroll/2.jpg';
import Picture6 from '@/public/parallax-scroll/3.jpg';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Spacer from '../_components/spacer/spacer';
import Lenis from "@studio-freight/lenis";

const word = "with framer-motion";

export default function ParallaxScroll() {

  const [dimension, setDimension] = useState({width: 0, height: 0});

  useEffect(() => {
    // Initialize Lenis with custom settings
    const lenis = new Lenis({
      duration: 1.2,        // Scroll duration (smoothness)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Animation loop for Lenis
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup function to destroy Lenis instance
    return () => {
      lenis.destroy();
    }
  }, [])


  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  });

  const sm = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const md = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const lg = useTransform(scrollYProgress, [0, 1], [0, -250]);

   const images = [
    {
      src: Picture1,
      y: 0
    },
    {
      src: Picture2,
      y: lg
    },
    {
      src: Picture3,
      y: md
    }
   ];

   const images2 = [
    {
      src: Picture4,
      y: 0
    },
    {
      src: Picture5,
      y: lg
    },
    {
      src: Picture6,
      y: md
    }
   ];

  return (
    <div className={styles.main}>
      <Spacer />
      <div className={styles.container} ref={container}>
        <div className={styles.body}>
          <motion.div style={{ y: sm }}>Parallax</motion.div>
          <h1>Scroll</h1>
          <div className={styles.word}>
            <p>
              {word.split("").map((letter: string, i: number) => {
                const y = useTransform(scrollYProgress, [0, 1], [0, Math.floor(Math.random() * -75) - 25]);
                return <motion.span style={{top: y}} key={`l_${i}`}>{letter}</motion.span>
              })}
            </p>
          </div>
        </div>
        <div className={styles.images}>
          {images.map(({src, y}, i) => {
            return (
              <motion.div 
                key={`i_${i}`} 
                style={{y}}
                className={styles.imageContainer}
              >
                <Image
                  src={src}
                  alt='image'
                  fill 
                />
              </motion.div>
            )
          })}
        </div>
      </div>
      <div className={styles.container} ref={container}>
        <div className={styles.body}>
          <motion.div style={{ y: sm }}>Parallax</motion.div>
          <h1>Scroll</h1>
          <div className={styles.word}>
            <p>
              {word.split("").map((letter: string, i: number) => {
                const y = useTransform(scrollYProgress, [0, 1], [0, Math.floor(Math.random() * -75) - 25]);
                return <motion.span style={{top: y}} key={`l_${i}`}>{letter}</motion.span>
              })}
            </p>
          </div>
        </div>
        <div className={styles.images}>
          {images2.map(({src, y}, i) => {
            return (
              <motion.div 
                key={`i_${i}`} 
                style={{y}}
                className={styles.imageContainer}
              >
                <Image
                  src={src}
                  alt='image'
                  fill 
                />
              </motion.div>
            )
          })}
        </div>
      </div>
      <Spacer />
    </div>
  )
}