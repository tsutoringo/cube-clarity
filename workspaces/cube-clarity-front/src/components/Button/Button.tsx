import classNames from "classnames";
import type { ComponentProps } from "react";

// @ts-types="./Button.module.css.d.ts"
import styles from "./Button.module.css";

export interface ButtonProps extends ComponentProps<"button"> {
}

export const Button = ({
  className,
  children,
  ...otherProps
}: ButtonProps) => {
  return (
    <button {...otherProps} className={classNames(styles.button, className)}>
      {children}
    </button>
  );
};
