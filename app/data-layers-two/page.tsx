import { Parallax } from "../_components/Parallax/Parallax";
import styles from "./page.module.scss";
import Spacer from "../_components/spacer/spacer";
import SmoothScrolling from "../_components/SmoothScrolling/SmoothScrolling";
import Image from "next/image";
import { Test } from "../_components/Test/Test";

export default function DataLayersTwo() {
  return (
    <SmoothScrolling>
      <main className={styles.main}>
        <Spacer />
        <div className={styles.container}>
          <div>DIV 1</div>
          <div className={`${styles.div2} ${styles.grid}`}>
            <Parallax speed={4} id="parallax-1" className={`${styles.imageToGrid} ${styles.overflowHidden}`}>
                <Image 
                  src="/data-layers/datamess.webp"
                  alt="Messy Data image"
                  width={1000}
                  height={1000}
                  sizes="100vw"
                  priority
                  style={{ width: '100%', height: 'auto' }}
                />
            </Parallax>
          </div>
          <div className={`${styles.div3} ${styles.grid}`}>
            <Test className={`${styles.test} ${styles.allie}`} activeClass={styles.active}>
              <Image 
                src="/allie/allie-test.png"
                alt="Allie test image"
                width={100}
                height={100}
                sizes="100vw"
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </Test>

          </div>
          <div className={`${styles.div4} ${styles.grid}`}>DIV 4</div>
          <div className={`${styles.div5} ${styles.grid}`}>DIV 5</div>
          <div className={`${styles.div6} ${styles.grid}`}>DIV 6</div>
          <div className={`${styles.div7} ${styles.grid}`}>DIV 7</div>
          <div className={`${styles.div8} ${styles.grid}`}>DIV 8</div>
          <div className={`${styles.div9} ${styles.grid}`}>DIV 9</div>
          <div className={`${styles.div10} ${styles.grid}`}>DIV 10</div>
          <div className={`${styles.div11} ${styles.grid}`}>DIV 11</div>
          <div className={`${styles.div12} ${styles.grid}`}>DIV 12</div>
        </div>
        <Spacer />
      </main>
    </SmoothScrolling>

  );
}

// export default function DataLayers() {
//   return (
//     <SmoothScrolling>
//       <main className={styles.main}>
//         <Spacer />
//           <div className={styles.container}>
//             <Parallax speed={2} id="parallax-1" className={`${styles.imageEnd}`}>
//                 <Image 
//                   src="/data-layers/datamess.webp"
//                   alt="Messy Data image"
//                   width={1000}
//                   height={1000}
//                   sizes="100vw"
//                   priority
//                   style={{ width: '100%', height: 'auto' }}
//                 />
//             </Parallax>

//             <Parallax speed={-4.5} id="parallax-2" className={styles.imageStart}>
//               <div className={`${styles.layer2} ${styles.text} ${styles.imageStart}`}>
//                 Your data is everywhere....
//               </div>
//             </Parallax>

//             <Parallax speed={2} id="parallax-3" className={styles.imageEnd}>
//                 <Image 
//                   src="/data-layers/databases.png"
//                   alt="Alation's data catalog"
//                   width={1000}
//                   height={1000}
//                   sizes="100vw"
//                   priority
//                   style={{ width: '100%', height: 'auto' }}
//                 />
//             </Parallax>

//             <Parallax speed={-4.5} id="parallax-4" className={styles.imageStart}>
//               <div className={`${styles.layer4} ${styles.text} ${styles.imageStart}`}>
//                 Alation's data catalog brings it together
//               </div>
//             </Parallax>

//             <Parallax speed={2} id="parallax-5" className={styles.imageEnd}>
//               <Image 
//                 src="/data-layers/dataproducts.png"
//                 alt="Alation's data products"
//                 width={1000}
//                 height={1000}
//                 sizes="100vw"
//                 priority
//                 style={{ width: '100%', height: 'auto' }}
//               />
//             </Parallax>


//             <Parallax speed={-4.5} className={`${styles.imageStart}`}id="parallax-6">
//               <div>Alation's data products make it actionable</div>
//             </Parallax>

//             <Parallax speed={2} id="parallax-7" className={styles.imageEnd}>
//               <Image 
//                 src="/data-layers/dashboard.png"
//                 alt="Alation's dashboard"
//                 width={1000}
//                 height={1000}
//                 sizes="100vw"
//                 priority
//                 style={{ width: '100%', height: 'auto' }}
//               />
//             </Parallax>

//             <Parallax speed={-4.5} className={`${styles.imageStart}`}id="parallax-8">
//               <div>The dashboard gives you insights</div>
//             </Parallax>

//           </div>
//         <Spacer />
//       </main>
//     </SmoothScrolling>

//   );
// }