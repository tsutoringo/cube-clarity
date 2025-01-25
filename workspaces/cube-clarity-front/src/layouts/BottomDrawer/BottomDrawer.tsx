import { BottomDrawerLayout } from "./BottomDrawerLayout";
import { BottomDrawerViewBox } from "./BottomDrawerViewBox";
import styles from "./BottomDrawer.module.css";
import { ReactNode } from "react";
import { BottomDrawerTitle } from "./Drawer/BottomDrawerTitle";

const _BottomDrawer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={styles.bottomDrawer}>
      {children}
    </div>
  );
};

export const BottomDrawer = Object.assign(
  BottomDrawerLayout,
  {
    Drawer: Object.assign(_BottomDrawer, {
      Title: BottomDrawerTitle,
    }),
    Layout: BottomDrawerLayout,
    ViewBox: BottomDrawerViewBox,
  },
);
