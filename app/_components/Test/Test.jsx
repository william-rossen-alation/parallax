"use client";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Test({ children, className, activeClass }) {
  const trigger = useRef(null);
  const target = useRef(null);
  const timeline = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // can use ScrollTrigger to create callbacks
    ScrollTrigger.create({
      trigger: trigger.current,
      start: "top 40%",
      end: "+=600",
      onEnter: () => console.log('you have entered Allies domain'),
      onLeave: () => console.log('you have left Allies domain'),
      onEnterBack: () => console.log('you have re-entered Allies domain'),
      onLeaveBack: () => console.log('you have re-left Allies domain'),
      // onUpdate: (self) => console.log('update: ',self.progress.toFixed(3)), // passes in scroll trigger instance as self
      onToggle: (self) => console.log('toggle: ',self.isActive), // passes in scroll trigger instance as self
      toggleClass: activeClass,
    });

    let tl = gsap.timeline({
      scrollTrigger: {
        id: "allie-test",
        trigger: trigger.current,
        start: "top 40%",
        end: "+=600",  // sets end relative to start [can use functions here if window width is needed]
        // end: "bottom 20%",
        scrub: 3, // locks animation to scroll position with true - using #'s gives it delay
        pin: true, // pins the element to the screen while trigger is active [assumes trigger is the element being pinned but can add ANY element here]
        toggleActions: "restart pause reverse pause",
        // markers: true,
      },
    });

    tl.to(trigger.current, {
      x: 800,
      rotation: 360,
      duration: 3
    });


    // gsap.to(trigger.current, {
    //   scrollTrigger: {
    //     id: "allie-test",
    //     trigger: trigger.current,
    //     start: "top 40%",
    //     end: "+=300",  // sets end relative to start [can use functions here if window width is needed]
    //     // end: "bottom 20%",
    //     scrub: 2, // locks animation to scroll position with true - using #'s gives it delay
    //     toggleActions: "restart pause reverse pause",
    //     markers: true,
    //   },
    //   x: 800,
    //   rotation: 360,
    //   duration: 3
    // });
  }, []);


  return (
    <div id="test" ref={trigger} className={className}>
      <div ref={target}>
        {children}
      </div>
    </div>
  )
}