import type { ReactNode } from "react";
// @ts-types="./HorizontalRule.module.css.d.ts"
import styles from "./HorizontalRule.module.css";

import { HorizontalRuleContent } from "./Content/HorizontalRuleContent.tsx";

const _HorizontalRule = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={styles.horizontalRule}>
      <div className={styles.stickWrapper}>
        <div className={styles.stick}></div>
      </div>
      {children}
      <div className={styles.stickWrapper}>
        <div className={styles.stick}></div>
      </div>
    </div>
  );
};

export const HorizontalRule = Object.assign(_HorizontalRule, {
  Content: HorizontalRuleContent,
});
