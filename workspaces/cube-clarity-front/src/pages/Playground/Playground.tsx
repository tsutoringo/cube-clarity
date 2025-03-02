import { useMemo, useState } from "react";
import { HorizontalRule } from "@components/HorizontalRule/HorizontalRule.tsx";
import { SingleRubikCubeDisplay } from "@components/RubikCube/RubikCube.tsx";
import { BottomDrawer } from "@layouts/BottomDrawer/BottomDrawer.tsx";
import { Screen } from "@layouts/Screen/Screen.tsx";
import { parseMoveNotation, RubikCube } from "@cube-clarity/core";
import styles from "./Playground.module.css";
import { drop, zip } from "@core/iterutil";

export const Playground = () => {
  const [viewingRubikCube, setViewingRubikCube] = useState(
    RubikCube.default(),
  );

  const [seek, setSeek] = useState(0);

  const [rawStartCube, setRawStartCube] = useState<string>(
    RubikCube.default().encodeBase64(),
  );
  const [startCube, setStartCube] = useState(RubikCube.default());

  const [moves, setMoves] = useState(
    parseMoveNotation("F R F")
      .unwrap(),
  );
  const [rawMoves, setRawMoves] = useState<string>(
    "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
  );

  const steps = useMemo(
    () => {
      let currentCube = startCube;
      const acc: RubikCube[] = [currentCube];

      for (const move of moves) {
        currentCube = currentCube.rotateCubeOnce(move);
        acc.push(currentCube);
      }

      return acc;
    },
    [moves, startCube],
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
            <SingleRubikCubeDisplay
              animation={{
                progress: seek,
                moves,
              }}
              rubikCube={viewingRubikCube}
            />
          </BottomDrawer.ViewBox>
        }
        drawer={
          <BottomDrawer.Drawer className={styles.playground}>
            <BottomDrawer.Drawer.Title>
              Playground
            </BottomDrawer.Drawer.Title>
            <input
              type="range"
              step="0.001"
              max={1}
              value={seek}
              onChange={(evt) => setSeek(Number(evt.target.value))}
            />
            <h2 className={styles.title}>StartCube</h2>
            <div>
              <textarea
                value={rawStartCube}
                onChange={(e) => setRawStartCube(e.target.value)}
              />
              <button
                type="button"
                onClick={() =>
                  setStartCube(RubikCube.decodeBase64(rawStartCube).orThrow())}
              >
                読み込む
              </button>
            </div>
            <h2 className={styles.title}>moves</h2>
            <div>
              <textarea
                value={rawMoves}
                onChange={(e) => setRawMoves(e.target.value)}
              />
              <button type="button" onClick={() => handleSetMoves()}>
                読み込む
              </button>
            </div>
            <h2 className={styles.title}>Current Cube</h2>
            <div>
              <textarea
                value={viewingRubikCube.encodeBase64()}
                onChange={(e) => handleSetRubikCube(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setStartCube(viewingRubikCube)}
              >
                Start Cubeとして読み込む
              </button>
            </div>
            <HorizontalRule>
              <HorizontalRule.Content>
                <small>アルゴリズムを見る</small>
              </HorizontalRule.Content>
            </HorizontalRule>
            <div className={styles.stepCubes}>
              <div className={styles.stepCube}>
                <SingleRubikCubeDisplay
                  onceRender
                  onClick={() => setViewingRubikCube(steps[0])}
                  rubikCube={steps[0]}
                />
              </div>
              {Array.from(zip(drop(steps, 1), moves)).map(
                ([rubikCube, move], index) => {
                  return (
                    <div key={index} className={styles.stepCube}>
                      <span>{move}</span>
                      <SingleRubikCubeDisplay
                        onceRender
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
