import { Parallax } from "../_components/Parallax/Parallax";
import styles from "./page.module.scss";
import Spacer from "../_components/spacer/spacer";
import SmoothScrolling from "../_components/SmoothScrolling/SmoothScrolling";
import Image from "next/image";


export default function DataLayers() {
  return (
    <SmoothScrolling>
      <main className={styles.main}>
        <Spacer />
          <div className={styles.container}>
            <Parallax speed={2} id="parallax-1" className={`${styles.imageEnd}`}>
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

            <Parallax speed={-4.5} id="parallax-2" className={styles.imageStart}>
              <div className={`${styles.layer2} ${styles.text} ${styles.imageStart}`}>
                Your data is everywhere....
              </div>
            </Parallax>

            <Parallax speed={2} id="parallax-3" className={styles.imageEnd}>
                <Image 
                  src="/data-layers/databases.png"
                  alt="Alation's data catalog"
                  width={1000}
                  height={1000}
                  sizes="100vw"
                  priority
                  style={{ width: '100%', height: 'auto' }}
                />
            </Parallax>

            <Parallax speed={-4.5} id="parallax-4" className={styles.imageStart}>
              <div className={`${styles.layer4} ${styles.text} ${styles.imageStart}`}>
                Alation's data catalog brings it together
              </div>
            </Parallax>

            <Parallax speed={2} id="parallax-5" className={styles.imageEnd}>
              <Image 
                src="/data-layers/dataproducts.png"
                alt="Alation's data products"
                width={1000}
                height={1000}
                sizes="100vw"
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </Parallax>


            <Parallax speed={-4.5} className={`${styles.imageStart}`}id="parallax-6">
              <div>Alation's data products make it actionable</div>
            </Parallax>

            <Parallax speed={2} id="parallax-7" className={styles.imageEnd}>
              <Image 
                src="/data-layers/dashboard.png"
                alt="Alation's dashboard"
                width={1000}
                height={1000}
                sizes="100vw"
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </Parallax>

            <Parallax speed={-4.5} className={`${styles.imageStart}`}id="parallax-8">
              <div>The dashboard gives you insights</div>
            </Parallax>

          </div>
        <Spacer />
      </main>
    </SmoothScrolling>

  );
}