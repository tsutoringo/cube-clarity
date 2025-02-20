import type { ReactNode } from "react";

export const HorizontalRuleContent = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="horizontal-rule-content">
      {children}
    </div>
  );
};
