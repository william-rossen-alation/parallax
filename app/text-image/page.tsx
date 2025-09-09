import Spacer from '../_components/spacer/spacer';
import styles from './page.module.scss';
import { TextImage, TextImageSection } from '../_components/TextImage/TextImage';

const sampleSections: TextImageSection[] = [
  {
    id: 'section-1',
    title: 'Writing support right when you need it',
    content: 'Have confidence in every word with real-time help that knows exactly where to look to catch grammar, punctuation, and spelling mistakes.',
    imageUrl: '/medium-text-image/image1.webp',
    imageAlt: 'Writing support interface showing grammar checking'
  },
  {
    id: 'section-2', 
    title: 'Expert advice at your fingertips',
    content: 'Strengthen your work with insights from subject-matter experts and trusted sources, so your writing stands up to scrutiny.',
    imageUrl: '/medium-text-image/image2.webp',
    imageAlt: 'Expert advice panel with research sources'
  },
  {
    id: 'section-3',
    title: 'Get a read on your writing',
    content: 'See your work through your audience\'s eyes and make sure your message is understood the first time.',
    imageUrl: '/medium-text-image/image3.webp',
    imageAlt: 'Reading analysis showing audience perspective'
  }
];

export default function TextImagePage() {
  return (
    <>
      <Spacer className={styles.lightOrange}/>
      <TextImage 
        sections={sampleSections}
        aspectRatio="16:9"
        columnRatio={[45, 55]}
      />
      <Spacer className={styles.lightOrange}/>
    </>
  );
}