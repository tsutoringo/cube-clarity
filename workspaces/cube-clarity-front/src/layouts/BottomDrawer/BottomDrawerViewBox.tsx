import type { ComponentProps, ReactNode } from "react";
// @ts-types="./BottomDrawerViewBox.module.css.d.ts"
import styles from "./BottomDrawerViewBox.module.css";
import classNames from "classnames";

export interface BottomDrawerViewBoxProps extends ComponentProps<"div"> {
  children: ReactNode;
}

export const BottomDrawerViewBox = ({
  children,
  className,
  ...otherProps
}: BottomDrawerViewBoxProps) => {
  return (
    <div
      {...otherProps}
      className={classNames(className, styles.bottomDrawerViewBox)}
    >
      {children}
    </div>
  );
};
