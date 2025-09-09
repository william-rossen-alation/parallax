import Spacer from '../_components/spacer/spacer';
import styles from './page.module.scss';
import { TextImage } from '../_components/TextImage/TextImage';

const tempData = [
  {
    image: "/medium-text-image/image1.webp",
    firstTitle: "First Title",
  },
  {
    image: "/medium-text-image/image2.webp",
    firstTitle: "Second Title",
  },
  {
    image: "/medium-text-image/image3.webp",
    firstTitle: "Third Title",
  }
];

export default function TextImagePage() {
  return (
    <>
      <Spacer className={styles.lightOrange}/>
      <TextImage />
      <Spacer className={styles.lightOrange}/>
    </>

);
}