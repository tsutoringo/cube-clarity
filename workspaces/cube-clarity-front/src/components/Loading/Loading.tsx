// @ts-types="./Loading.module.css.d.ts"
import styles from "./Loading.module.css";

export const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}></div>
      <div className={styles.content}></div>
      <div className={styles.content}></div>
      <div className={styles.content}></div>
      <div className={styles.content}></div>
    </div>
  );
};
