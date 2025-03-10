import type { ReactNode } from "react";
import styles from "./Screen.module.css";

export const Screen = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={styles.screen}>
      <div className={styles.screenInner}>
        {children}
      </div>
    </div>
  );
};
