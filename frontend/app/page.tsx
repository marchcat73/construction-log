import { Suspense } from 'react';
import { HomePage } from '@/views';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <Suspense fallback={<p>Loading list...</p>}>
        <HomePage />
      </Suspense>
    </div>
  );
}
