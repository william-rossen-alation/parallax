import styles from './styles.module.scss';

// TypeScript interfaces
export interface TextImageSection {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
}

export interface TextImageProps {
  sections: TextImageSection[];
  aspectRatio?: string; // e.g., "16:9", "4:3", "1:1"
  columnRatio?: [number, number]; // e.g., [50, 50] or [40, 60]
  transitionDuration?: number; // milliseconds, default 400
  className?: string;
}

// Default props
const defaultProps: Partial<TextImageProps> = {
  aspectRatio: '16:9',
  columnRatio: [50, 50],
  transitionDuration: 400,
};

export const TextImage: React.FC<TextImageProps> = ({
  sections,
  aspectRatio = defaultProps.aspectRatio,
  columnRatio = defaultProps.columnRatio,
  transitionDuration = defaultProps.transitionDuration,
  className,
}) => {
  return (
    <section className={`${styles.textImageContainer} ${className || ''}`}>
      <div className={styles.content}>
        {/* Mobile View: Stacked layout */}
        <div className={styles.mobileLayout}>
          {sections.map((section, index) => (
            <div key={section.id} className={styles.mobileSection}>
              <div className={styles.textContent}>
                <h2 className={styles.title}>{section.title}</h2>
                <p className={styles.description}>{section.content}</p>
              </div>
              <div className={styles.imageContent}>
                <img 
                  src={section.imageUrl} 
                  alt={section.imageAlt}
                  className={styles.image}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Two-column layout with sticky images */}
        <div className={styles.desktopLayout}>
          <div 
            className={styles.textColumn}
            style={{ flex: columnRatio ? columnRatio[0] : 50 }}
          >
            {sections.map((section, index) => (
              <div key={section.id} className={styles.textSection} data-section-id={section.id}>
                <h2 className={styles.title}>{section.title}</h2>
                <p className={styles.description}>{section.content}</p>
              </div>
            ))}
          </div>
          
          <div 
            className={styles.imageColumn}
            style={{ flex: columnRatio ? columnRatio[1] : 50 }}
          >
            <div className={styles.stickyImageContainer}>
              {sections.map((section, index) => (
                <img
                  key={section.id}
                  src={section.imageUrl}
                  alt={section.imageAlt}
                  className={`${styles.stickyImage} ${index === 0 ? styles.active : ''}`}
                  data-section-id={section.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};