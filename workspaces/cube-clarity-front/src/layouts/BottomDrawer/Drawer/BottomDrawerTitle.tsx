import { ReactNode } from "react";
import styles from "./BottomDrawerTitle.module.css";

export const BottomDrawerTitle = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={styles.bottomDrawerTitle}>
      <h2>{children}</h2>
    </div>
  );
};
