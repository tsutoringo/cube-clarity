import { ComponentProps, useMemo, useState } from "react";
import { HorizontalRule } from "../../components/HorizontalRule/HorizontalRule";
import { RubikCubeDisplay } from "../../components/RubikCube/RubikCube";
import { BottomDrawer } from "../../layouts/BottomDrawer/BottomDrawer";
import { Screen } from "../../layouts/Screen/Screen";
import {
  parseMoveNotation,
  RubikCube,
} from "../../lib/rubikcube/RubikCube/RubikCube";
import styles from "./Playground.module.css";
import { drop, zip } from "@core/iterutil";

export const Playground = () => {
  const [viewingRubikCube, setViewingRubikCube] = useState(
    RubikCube.default(),
  );

  const [moves, setMoves] = useState(
    parseMoveNotation("U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2")
      .unwrap(),
  );

  const [rawMoves, setRawMoves ] = useState<string>("");

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

  const handleSetMoves = () => {
    setMoves(
      parseMoveNotation(rawMoves)
        .orThrow(),
    );
  };

  const handleSetRubikCube = (encodedRubikCube: string) => {
    setViewingRubikCube(RubikCube.decodeBase64(encodedRubikCube).orThrow());
  };

  return (
    <Screen>
      <BottomDrawer.Layout
        // className={styles.algorithmStep}
        viewBox={
          <BottomDrawer.ViewBox>
            <RubikCubeDisplay rubikCube={viewingRubikCube} />
          </BottomDrawer.ViewBox>
        }
        drawer={
          <BottomDrawer.Drawer className={styles.playground}>
            <BottomDrawer.Drawer.Title>
              Playground
            </BottomDrawer.Drawer.Title>
            <h2 className={styles.title}>moves</h2>
            <div>
              <textarea
                value={rawMoves}
                onChange={(e) => setRawMoves(e.target.value)}
              />
              <button onClick={() => handleSetMoves()}>設定</button>
            </div>
            <h2 className={styles.title}>Current Cube</h2>
            <div>
              <textarea
                value={viewingRubikCube.encodeBase64()}
                onChange={(e) => handleSetRubikCube(e.target.value)}
              />
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
                    <div key={index} className={styles.stepCube}>
                      <span>{move}</span>
                      <RubikCubeDisplay
                        noUpdate
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
    </Screen>
  );
};
