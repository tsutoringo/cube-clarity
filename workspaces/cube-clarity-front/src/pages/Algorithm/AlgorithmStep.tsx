import { CSSTransition } from "react-transition-group";
import { type ReactNode, useRef } from "react";

import { HorizontalRule } from "@components/HorizontalRule/HorizontalRule.tsx";
import { SingleRubikCubeDisplay } from "@components/RubikCube/RubikCube.tsx";
import { BottomDrawer } from "@layouts/BottomDrawer/BottomDrawer.tsx";
import type { RubikCube } from "@cube-clarity/core";

// @ts-types="./AlgorithmStep.module.css.d.ts"
import styles from "./AlgorithmStep.module.css";
import { Button } from "@components/Button/Button.tsx";

export const AlgorithmStep = ({
  displaying,
  startRubikCube,
  title,
  description,
  onClickNext,
  onClickPrev,
}: {
  displaying: boolean;
  startRubikCube: RubikCube;
  title: ReactNode;
  description: ReactNode;
  onClickNext?: () => void;
  onClickPrev?: () => void;
}) => {
  const algorithmStepRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      in={displaying}
      mountOnEnter
      unmountOnExit
      timeout={1000}
      classNames={styles}
      nodeRef={algorithmStepRef}
    >
      <BottomDrawer.Layout
        nodeRef={algorithmStepRef}
        className={styles.algorithmStep}
        viewBox={
          <BottomDrawer.ViewBox>
            <SingleRubikCubeDisplay rubikCube={startRubikCube} />
          </BottomDrawer.ViewBox>
        }
        drawer={
          <BottomDrawer.Drawer>
            <BottomDrawer.Drawer.Title>
              {title}
            </BottomDrawer.Drawer.Title>
            {description}
            <HorizontalRule>
              <HorizontalRule.Content>
                <small>アルゴリズムを見る</small>
              </HorizontalRule.Content>
            </HorizontalRule>
            <div className={styles.stepCubes}>
              {}
            </div>
            <footer className={styles.footer}>
              {onClickPrev && (
                <Button onClick={onClickPrev} type="button">
                  前のステップへ
                </Button>
              )}
              {onClickNext && (
                <Button
                  onClick={onClickNext}
                  type="button"
                >
                  次のステップへ
                </Button>
              )}
            </footer>
          </BottomDrawer.Drawer>
        }
      />
    </CSSTransition>
  );
};
