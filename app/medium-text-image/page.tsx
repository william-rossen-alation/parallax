import styles from './page.module.scss';
import Image from 'next/image';

const tempData = [
  {
    image: "/medium-text-image/image1.webp",
    firstTitle: "First Title",
    firstText: "First Text",
  },
  {
    image: "/medium-text-image/image1.webp",
    firstTitle: "Second Title",
    firstText: "Second Text",
  },
  {
    image: "/medium-text-image/image1.webp",
    firstTitle: "Third Title",
    firstText: "Third Text",
  }
]

export default function MediumTextImage() {
  return (
    <div className={styles.container}>
      {tempData.map((item, index) => {
        return (
          <div key={index} className={styles.itemWrapper}>
            <div>{item.firstTitle}</div>
            <div className={styles.imageContainer}>
              <Image 
                src={`${item.image}`}
                alt={item.firstTitle} 
                fill={true}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}