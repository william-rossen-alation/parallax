import styles from './spacer.module.scss';

export default function Spacer({ className }: { className?: string }) {
  return (
    <div className={`${styles.spacer} ${className}`}></div>
  )
}