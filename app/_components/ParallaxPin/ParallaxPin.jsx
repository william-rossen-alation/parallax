"use client";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ParallaxPin({ className, children, speed = 1, id ="parallax"}) {
  const trigger = useRef(null);
  const target = useRef(null);
  const timeline = useRef(null);
  const permanentPinTrigger = useRef(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1100);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 1100);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    //const y = windowHeight * speed * 0.1;
    const y = windowWidth * speed * 0.1;
    const setY = gsap.quickSetter(target.current, 'y', 'px');

    timeline.current = gsap.timeline(
      {
        scrollTrigger: {
          id: id,
          trigger: trigger.current,
          scrub: true,
          start: 'top bottom',
          end: '+=800 50%',
          markers: true,
          // pin: true,
          onUpdate: (e) => {
            setY(e.progress * y)
          },
          onLeave: () => {
            console.log('onLeave')
            gsap.set(target.current, {opacity: 0.5});
      
            // Kill any existing permanent pin before creating a new one
            if (permanentPinTrigger.current) {
              permanentPinTrigger.current.kill();
            }

            // Get the current scroll position where the first timeline ended
            const currentScrollY = window.scrollY;
            
            permanentPinTrigger.current = ScrollTrigger.create({
              id: `${id}-permanent-pin`,
              start: currentScrollY, // Use absolute scroll position
              end: 'max',
              pin: target.current,
              pinSpacing: false,
            });
          },
          onEnterBack: () => {
            console.log('onEnterBack')

            // Kill the permanent pin when entering back
            if (permanentPinTrigger.current) {
              permanentPinTrigger.current.kill();
              permanentPinTrigger.current = null;
            }
          },
        },
      }
    );

      // Second timeline - starts where first one ends
  // const timeline2 = gsap.timeline({
  //   scrollTrigger: {
  //     id: `${id}-second`,
  //     trigger: trigger.current,
  //     scrub: true,
  //     start: '+=800 50%', // Starts where first timeline ended
  //     end: '+=1200 center', // Define where second timeline ends
  //     markers: true,
  //     pin: true,
  //     onUpdate: (e) => {
  //       console.log('2nd timeline running')
  //     },
  //   },
  // });

    return () => {
      timeline?.current?.kill();
      // timeline2?.current?.kill();
    };
  }, [id, speed, windowWidth, windowHeight])

  return (
    <div ref={trigger} className={`${className} trigger`}>
      <div ref={target}>{children}</div>
    </div>
  );
}
