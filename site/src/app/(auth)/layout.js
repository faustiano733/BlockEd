import styles from './layout.module.css';

export default function RootLayout({ children }) {
  return (
    <>
      <div className={styles.layout}>
        {children}
      </div>
    </>
  );
}