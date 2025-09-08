import MasterTextImage from '../_components/MasterTextImage/MasterTextImage';

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
  return <MasterTextImage data={tempData} />;
}