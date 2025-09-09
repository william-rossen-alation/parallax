import MasterTextImage from '../_components/MasterTextImage/MasterTextImage';
import SmoothScrolling from '../_components/SmoothScrolling/SmoothScrolling';
import Spacer from '../_components/spacer/spacer';
import styles from './page.module.scss';

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

export default function MediumTextImage() {
  return (
    <>
      <Spacer className={styles.lightOrange}/>
      <SmoothScrolling>
        <MasterTextImage data={tempData} scrollDistancePerSection={10000} />
      </SmoothScrolling>
      <Spacer className={styles.lightOrange}/>
    </>

);
}