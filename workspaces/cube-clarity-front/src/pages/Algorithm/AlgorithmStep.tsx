import { CSSTransition } from "react-transition-group";
import { useMemo, useRef, useState } from "react";
import { drop, zip } from "@core/iterutil";

import { HorizontalRule } from "@components/HorizontalRule/HorizontalRule";
import { RubikCubeDisplay } from "@components/RubikCube/RubikCube";
import { BottomDrawer } from "@layouts/BottomDrawer/BottomDrawer";
import { parseMoveNotation } from "@lib/rubikcube/RubikCube/MoveNotation";
import { RubikCube } from "@lib/rubikcube/RubikCube/RubikCube";

import styles from "./AlgorithmStep.module.css";

export const AlgorithmStep = ({
  displaying,
}: {
  displaying: boolean;
}) => {
  const algorithmStepRef = useRef<HTMLDivElement>(null);
  const [moves, _setMoves] = useState(
    parseMoveNotation("U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2")
      .unwrap(),
  );
  const [viewingRubikCube, setViewingRubikCube] = useState(
    RubikCube.decodeBase64("AwQFAgEhQVExICQlISMDU0MTQENCQUUFJTUV").unwrap(),
  );
  const steps = useMemo(
    () => {
      let first = RubikCube.default();
      const acc: RubikCube[] = [first];

      for (const move of moves) {
        first = first.rotateCubeOnce(move);
        acc.push(first);
      }

      return acc;
    },
    [moves],
  );

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
            <RubikCubeDisplay rubikCube={viewingRubikCube} />
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
            <div className={styles.stepCubes}>
              <div className={styles.stepCube}>
                <RubikCubeDisplay
                  noUpdate
                  onClick={() => setViewingRubikCube(steps[0])}
                  rubikCube={steps[0]}
                />
              </div>
              {Array.from(zip(drop(steps, 1), moves)).map(
                ([rubikCube, move], index) => {
                  return (
                    <div className={styles.stepCube}>
                      <span>{move}</span>
                      <RubikCubeDisplay
                        noUpdate
                        key={index}
                        onClick={() => setViewingRubikCube(rubikCube)}
                        rubikCube={rubikCube}
                      />
                    </div>
                  );
                },
              )}
            </div>
          </BottomDrawer.Drawer>
        }
      />
    </CSSTransition>
  );
};
