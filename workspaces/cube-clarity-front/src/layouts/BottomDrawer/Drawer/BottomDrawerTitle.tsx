import { ReactNode } from "react";
import styles from "./BottomDrawerTitle.module.css";

export const BottomDrawerTitle = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={styles["bottom-drawer-title"]}>
      <h2>{children}</h2>
    </div>
  );
};
