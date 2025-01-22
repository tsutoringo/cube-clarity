import { ReactNode } from "react";
import styles from "./HorizontalRule.module.css";

export const HorizontalRule = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={styles["horizontal-rule"]}>
      <div className={styles["stick-wrapper"]}>
        <div className={styles.stick}></div>
      </div>
      <small className={styles.container}>
        {children}
      </small>
      <div className={styles["stick-wrapper"]}>
        <div className={styles.stick}></div>
      </div>
    </div>
  );
};
