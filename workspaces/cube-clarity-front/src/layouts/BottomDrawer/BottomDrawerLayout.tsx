import { ReactNode } from "react";
import { BottomDrawer as _BottomDrawer } from "./BottomDrawer";
import styles from "./BottomDrawerLayout.module.css";

export const BottomDrawerLayout = ({
  viewBox,
  drawer,
}: {
  viewBox: ReactNode;
  drawer: ReactNode;
}) => {
  return (
    <div className={styles.bottomDrawerLayout}>
      {viewBox}
      {drawer}
    </div>
  );
};
