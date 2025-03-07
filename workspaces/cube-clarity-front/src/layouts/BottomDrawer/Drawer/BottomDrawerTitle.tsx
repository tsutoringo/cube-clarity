import type { ReactNode } from "react";
// @ts-types="./BottomDrawerTitle.module.css.d.ts"
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
