import { BottomDrawerLayout } from "./BottomDrawerLayout.tsx";
import { BottomDrawerViewBox } from "./BottomDrawerViewBox.tsx";
// @ts-types="./BottomDrawer.module.css.d.ts"
import styles from "./BottomDrawer.module.css";
import type { ComponentProps, ReactNode } from "react";
import { BottomDrawerTitle } from "./Drawer/BottomDrawerTitle.tsx";
import classNames from "classnames";

interface BottomDrawerProps extends ComponentProps<"div"> {
  children: ReactNode;
}

const _BottomDrawer = ({
  children,
  className,
  ...otherProps
}: BottomDrawerProps) => {
  return (
    <div {...otherProps} className={classNames(styles.bottomDrawer, className)}>
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
