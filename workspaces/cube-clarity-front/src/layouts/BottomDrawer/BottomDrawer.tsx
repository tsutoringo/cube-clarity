import { BottomDrawerLayout } from "./BottomDrawerLayout";
import { BottomDrawerViewBox } from "./BottomDrawerViewBox";
import styles from "./BottomDrawer.module.css";
import { ComponentProps, ReactNode } from "react";
import { BottomDrawerTitle } from "./Drawer/BottomDrawerTitle";
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
