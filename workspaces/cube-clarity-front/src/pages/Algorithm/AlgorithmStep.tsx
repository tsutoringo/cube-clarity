import { CSSTransition } from 'react-transition-group';
import { HorizontalRule } from "../../components/HorizontalRule/HorizontalRule";
import { BottomDrawer } from "../../layouts/BottomDrawer/BottomDrawer";
import { useRef } from 'react';
import styles from "./AlgorithmStep.module.css";

export const AlgorithmStep = ({
  displaying
}: {
  displaying: boolean
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
            aiue
          </BottomDrawer.ViewBox>
        }
        drawer={
          <BottomDrawer.Drawer>
            <BottomDrawer.Drawer.Title>
              ステップ1
            </BottomDrawer.Drawer.Title>
            <div>
              <p>
                白いセンターを上にして持ち、白い部分のエッジを見つけて下の層の持ってきます。
              </p>
              <p>
                エッジが同じ色のセンターの下になるように下の層を回します。
              </p>
              <p>
                その面を回転させて、エッジの部分を上に持ってきます。
              </p>
            </div>
            <HorizontalRule>
              <HorizontalRule.Content>
                <small>アルゴリズムを見る</small>
              </HorizontalRule.Content>
            </HorizontalRule>
          </BottomDrawer.Drawer>
        }
      />
    </CSSTransition>
  );
};
