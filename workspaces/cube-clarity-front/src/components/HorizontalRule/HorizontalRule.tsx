import { ReactNode } from "react";
import styles from "./HorizontalRule.module.css";
import { HorizontalRuleContent } from "./Content/HorizontalRuleContent";

const _HorizontalRule = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={styles["horizontal-rule"]}>
      <div className={styles["stick-wrapper"]}>
        <div className={styles.stick}></div>
      </div>
      {children}
      <div className={styles["stick-wrapper"]}>
        <div className={styles.stick}></div>
      </div>
    </div>
  );
};

export const HorizontalRule = Object.assign(_HorizontalRule, {
  Content: HorizontalRuleContent,
});
