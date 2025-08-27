import ImageList from "../_components/ImageList/ImageList";
import styles from "./page.module.scss";
import SmoothScrolling from "../_components/SmoothScrolling/SmoothScrolling";

export default function ParallaxGsap() {
  return (
    <SmoothScrolling>
      <main className={styles.main}>
        <ImageList />
      </main>
    </SmoothScrolling>
  );
}