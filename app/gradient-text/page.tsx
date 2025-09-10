import GradientText from "@/app/_components/GradientText/GradientText";
import styles from "./page.module.scss";

export default function GradientTextPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Gradient Text Animation Demo</h1>
        
        <section className={styles.demoSection}>
          <h2 className={styles.sectionTitle}>Default Animation</h2>
          <GradientText text="Animate this string" />
        </section>

        <section className={styles.demoSection}>
          <h2 className={styles.sectionTitle}>Fast Animation</h2>
          <GradientText 
            text="Quick fade effect" 
            animationDelay={20}
          />
        </section>

        <section className={styles.demoSection}>
          <h2 className={styles.sectionTitle}>Slow Animation</h2>
          <GradientText 
            text="Slow reveal" 
            animationDelay={400}
          />
        </section>

        <section className={styles.demoSection}>
          <h2 className={styles.sectionTitle}>No Controls (Programmatic Only)</h2>
          <GradientText 
            text="Clean display" 
            showControls={false}
          />
        </section>

        <section className={styles.demoSection}>
          <h2 className={styles.sectionTitle}>Long Text Example</h2>
          <GradientText 
            text="This is a longer piece of text to demonstrate how the gradient animation works with multiple words and spaces"
            animationDelay={50}
          />
        </section>
      </div>
    </main>
  );
}
