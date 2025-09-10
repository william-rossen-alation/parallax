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
  },
  {
    id: 'section-4',
    title: 'Advanced Analytics & Insights',
    content: 'Dive deep into performance metrics and understand how your content resonates with different audiences across various platforms.',
    imageUrl: '/medium-text-image/image1.webp',
    imageAlt: 'Analytics dashboard showing content performance'
  }
];

// Test with different section counts
const twoSections = sampleSections.slice(0, 2);
const fiveSections = [...sampleSections, {
  id: 'section-5',
  title: 'Collaborative Workflows',
  content: 'Work seamlessly with your team using real-time collaboration tools and shared workspaces.',
  imageUrl: '/medium-text-image/image2.webp',
  imageAlt: 'Team collaboration interface'
}];

export default function TextImagePage() {
  return (
    <>
      <Spacer className={styles.lightOrange}/>
      <div style={{ padding: '2rem 0' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
          TextImage Component Demo
        </h1>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
          Dynamic Height: {sampleSections.length} sections × 100vh = {sampleSections.length * 100}vh
        </h2>
      </div>
      <TextImage 
        sections={sampleSections}
        aspectRatio="4:3"
        columnRatio={[45, 55]}
      />
      <Spacer className={styles.lightOrange}/>
    </>
  );
}