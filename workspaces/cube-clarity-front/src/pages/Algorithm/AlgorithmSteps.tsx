import type { RubikCube } from "@lib/rubikcube/RubikCube/RubikCube";
import type { RubikCubeMoveNotation } from "@lib/rubikcube/RubikCube/MoveNotation";
import { type ReactNode, useMemo, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./AlgorithmStep.module.css";
import { BottomDrawer } from "@layouts/BottomDrawer/BottomDrawer";
import { SingleRubikCubeDisplay } from "@components/RubikCube/RubikCube";
import { HorizontalRule } from "@components/HorizontalRule/HorizontalRule";
import { solveRubikCube } from "@lib/rubikcube/RubikCube/RubikCubeSolver";
import { Button } from "@components/Button/Button";
import { CubeGuide } from "@components/CubeGuide/CubeGuide";

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const AlgorithmSteps = ({
  displaying,
  startCube,
}: {
  displaying: boolean;
  startCube: RubikCube;
}) => {
  const [currentStep, setCurrentStep] = useState<StepIndex>(0);
  const solveAlgorithm = useMemo(() => solveRubikCube(startCube), [startCube]);
  const currentStepInformation = useMemo(
    () => stepInformations(currentStep, solveAlgorithm),
    [currentStep, solveAlgorithm],
  );
  const stepsRef = useRef<HTMLDivElement>(null);

  const [currentProgress, setCurrentProgress] = useState<number>(0);

  const setCurrentStepHandler = (step: StepIndex) => {
    setCurrentProgress(0);
    setTimeout(() => setCurrentStep(step));
  };

  const cubeGuideMemo = useMemo(() => {
    return currentStepInformation.algorithm.moves.reduce<{
      moves: {
        move: RubikCubeMoveNotation;
        cube: RubikCube;
      }[];
      currentCube: RubikCube;
    }>((acc, current) => {
      const rotatedCube = acc.currentCube.rotateCubeOnce(current);
      return {
        moves: [...acc.moves, {
          move: current,
          cube: rotatedCube,
        }],
        currentCube: rotatedCube,
      };
    }, {
      moves: [],
      currentCube: currentStepInformation.algorithm.startRubikCube,
    }).moves;
  }, [currentStepInformation.algorithm.moves, startCube]);

  return (
    <CSSTransition
      in={displaying}
      mountOnEnter
      unmountOnExit
      timeout={1000}
      classNames={styles}
      nodeRef={stepsRef}
    >
      <BottomDrawer.Layout
        nodeRef={stepsRef}
        className={styles.algorithmStep}
        viewBox={
          <BottomDrawer.ViewBox>
            <SingleRubikCubeDisplay
              animation={{
                moves: currentStepInformation.algorithm.moves,
                progress: currentProgress /
                  currentStepInformation.algorithm.moves.length,
              }}
              rubikCube={currentStepInformation.algorithm.startRubikCube}
            />
          </BottomDrawer.ViewBox>
        }
        drawer={
          <BottomDrawer.Drawer>
            <input
              type="range"
              step="0.001"
              value={currentProgress}
              max={currentStepInformation.algorithm.moves.length}
              onChange={(evt) => setCurrentProgress(Number(evt.target.value))}
            />
            <BottomDrawer.Drawer.Title>
              {currentStepInformation.title}
            </BottomDrawer.Drawer.Title>
            <section>
              {currentStepInformation.description}
            </section>
            <HorizontalRule>
              <HorizontalRule.Content>
                <small>アルゴリズムを見る</small>
              </HorizontalRule.Content>
            </HorizontalRule>
            <div className={styles.stepCubes}>
              {currentStepInformation.algorithm.moves.length === 0
                ? "このステップは飛ばしてもいいみたいです！"
                : (
                  <CubeGuide
                    baseCube={currentStepInformation.algorithm.startRubikCube}
                    cubeList={cubeGuideMemo}
                  />
                )}
            </div>
            <footer className={styles.footer}>
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={() =>
                    setCurrentStepHandler(currentStep - 1 as StepIndex)}
                >
                  前のステップへ
                </Button>
              )}
              {currentStep < 6 && (
                <Button
                  type="button"
                  onClick={() =>
                    setCurrentStepHandler(currentStep + 1 as StepIndex)}
                  className={styles.nextButton}
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

const stepInformations = (
  step: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  steps: ReturnType<typeof solveRubikCube>,
): {
  title: ReactNode;
  description: ReactNode;
  algorithm: ReturnType<
    typeof solveRubikCube
  >[keyof ReturnType<typeof solveRubikCube>];
} => {
  switch (step) {
    case 0:
      return {
        title: "ステップ1: 白い十字を作る",
        description: (
          <>
            <p>
              白センター?を上にして持ち、白い部分のエッジ?を見つけて下の層の持ってくる。
            </p>
            <p>エッジ?が同じ色のセンターの下になるように下の層を回す。</p>
            <p>その面を回転させて、エッジの部分を上に持ってくる。</p>
          </>
        ),
        algorithm: steps.step1,
      };
    case 1:
      return {
        title: "ステップ2: 白い面を完成させる",
        description: (
          <>
            <p>
              白が含まれるコーナーピースを探し、正しい位置に配置する。例えば、「白・青・赤」のコーナーピースがあれば、青と赤のセンターの間に配置する。
            </p>
            <p>
              コーナーピースを適切な方法で白い面に持ってくる。もしすでに白い面にあるが、位置が間違っている場合は、一度下の層に出してから再配置する。
            </p>
          </>
        ),
        algorithm: steps.step2,
      };
    case 2:
      return {
        title: "ステップ3: 第二層を完成させる",
        description: (
          <>
            <p>
              黄色が含まれていないエッジピースを探し、正しい位置に配置する。例えば、「赤・青」のエッジなら、赤いセンターに合わせる。
            </p>
            <p>
              その後は適切な方法で第二層に持ってくる。もしエッジが間違った位置にある場合、まずそれを取り出して、再び正しく配置する。
            </p>
            <p>その面を回転させて、エッジの部分を上に持ってくる。</p>
          </>
        ),
        algorithm: steps.step3,
      };
    case 3:
      return {
        title: "ステップ4: 黄色の十字を作る",
        description: (
          <>
            <p>
              このステップでは以下の固定なアルゴリズムを使って黄色の面に十字（クロス）を作る。
            </p>
            <p>
              ここで3つのパターンがある。<br />
              ①「線」: １回のアルゴリズムで完成する。➁「L字」:
              ２回のアルゴリズムで完成する。<br />
              ➂「点」:
              １回アルゴリズムを実行し、黄色の面を２回回してからもう一度実行する。
            </p>
          </>
        ),
        algorithm: steps.step4,
      };
    case 4:
      return {
        title: "ステップ5: クロスの色を揃える",
        description: (
          <>
            <p>
              黄色のクロスを完成させたら、各エッジピースの色を正しい位置に合わせる。今回は以下のアルゴリズムを使う。
            </p>
            <p>
              ここで2つのパターンがある。<br />
              ①２つのエッジピースの色が隣り合っている場合:
              そのエッジピースを左側に配置し、アルゴリズムを実行する。<br />
              ➁２つのエッジピースの色が向かい合っている場合：アルゴリズムを実行してから、ステップ1と同じ手順を繰り返す。
            </p>
          </>
        ),
        algorithm: steps.step5,
      };
    case 5:
      return {
        title: "ステップ6: コーナーを配置する",
        description: (
          <>
            <p>
              黄色の４つのコーナーピースを正しい位置に配置することは目的である。
            </p>
            <p>
              すでに正しい位置にあるコーナーピースを見つけ、左手側に持ってくる。アルゴリズムを繰り返し、すべてのコーナーピースが正しい位置になるまで行う。
            </p>
          </>
        ),
        algorithm: steps.step6,
      };
    case 6:
      return {
        title: "ステップ7: コーナーを揃える",
        description: (
          <>
            <p>最後に、黄色の面を揃えて、ルービックキューブを完成させます！</p>
            <p>
              正しい位置にある黄色のコーナーを探し、それを右手側に持ってくる。黄色のピースが下を向くまでアルゴリズムを繰り返す。すべてのコーナーが完成するまで続ける。
            </p>
          </>
        ),
        algorithm: steps.step7,
      };
  }
};
