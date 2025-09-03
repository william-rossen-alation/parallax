"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import { Hero } from "../_components/Hero/Hero";
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
        <Hero className={styles.hero}/>
        <Spacer />
      </div>
    </SmoothScrolling>
  )
}