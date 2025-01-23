import { ReactNode } from "react";
import styles from "./BottomDrawerViewBox.module.css";

export const BottomDrawerViewBox = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={styles["bottom-drawer-view-box"]}>
      {children}
    </div>
  );
};
