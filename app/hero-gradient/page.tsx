"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import { Hero } from "../_components/Hero/Hero";
import { HeroGradient, HeroGradientOpacityOverlay } from "../_components/HeroGradient/HeroGradient";
import Spacer from "../_components/spacer/spacer";
import SmoothScrolling from "../_components/SmoothScrolling/SmoothScrolling";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function HeroTest({}) {

  return (
    <SmoothScrolling>
      <div>
        {/* <Spacer /> */}
        {/* <HeroGradient className={styles.heroGradient}/> */}
        <HeroGradientOpacityOverlay className={styles.heroGradientOpacityOverlay}/>
        <Spacer className={styles.lightOrange}/>
      </div>
    </SmoothScrolling>
  )
}