import { ReactNode } from "react";
import styles from "./BottomDrawerViewBox.module.css";

export const BottomDrawerViewBox = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={styles.bottomDrawerViewBox}>
      {children}
    </div>
  );
};
