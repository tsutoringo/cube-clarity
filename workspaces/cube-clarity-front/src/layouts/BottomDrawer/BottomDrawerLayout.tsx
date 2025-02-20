import type { ReactNode, RefObject } from "react";
import type { BottomDrawer as _BottomDrawer } from "./BottomDrawer";
import classNames, { type Argument } from "classnames";

import styles from "./BottomDrawerLayout.module.css";

export const BottomDrawerLayout = ({
  viewBox,
  drawer,
  className,
  nodeRef,
}: {
  viewBox: ReactNode;
  drawer: ReactNode;
  className?: Argument;
  nodeRef?: RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      ref={nodeRef}
      className={classNames(styles.bottomDrawerLayout, className)}
    >
      {viewBox}
      {drawer}
    </div>
  );
};
