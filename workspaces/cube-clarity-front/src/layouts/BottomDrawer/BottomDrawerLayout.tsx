import { ReactNode, RefObject } from "react";
import { BottomDrawer as _BottomDrawer } from "./BottomDrawer";
import styles from "./BottomDrawerLayout.module.css";

import cn, { Argument } from "classnames";

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
    <div ref={nodeRef} className={cn(styles.bottomDrawerLayout, className)}>
      {viewBox}
      {drawer}
    </div>
  );
};
