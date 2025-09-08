import styles from './page.module.scss';
import Image from 'next/image';
import { TextImage } from '../_components/TextImage/TextImage';

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
          <TextImage 
            key={`${index}-text-image-component`} 
            item={item}
            index={index} 
          />
        )
      })}
    </div>
  )
}