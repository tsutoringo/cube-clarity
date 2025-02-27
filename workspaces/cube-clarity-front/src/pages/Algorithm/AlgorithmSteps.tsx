import type { RubikCube } from "@lib/rubikcube/RubikCube/RubikCube";
import { type ReactNode, useMemo, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./AlgorithmStep.module.css";
import { BottomDrawer } from "@layouts/BottomDrawer/BottomDrawer";
import { SingleRubikCubeDisplay } from "@components/RubikCube/RubikCube";
import { HorizontalRule } from "@components/HorizontalRule/HorizontalRule";
import { solveRubikCube } from "@lib/rubikcube/RubikCube/RubikCubeSolver";
import { Button } from "@components/Button/Button";

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const AlgorithmSteps = ({
  displaying,
  startCube,
}: {
  displaying: boolean;
  startCube: RubikCube;
}) => {
  const [currentStep, setCurrentStep] = useState<StepIndex>(6);
  const solveAlgorithm = useMemo(() => solveRubikCube(startCube), [startCube]);
  const currentStepInformation = stepInformations(currentStep, solveAlgorithm);
  const stepsRef = useRef<HTMLDivElement>(null);

  const [currentProgress, setCurrentProgress] = useState<number>(0);

  const setCurrentStepHandler = (step: StepIndex) => {
    // console.log(currentProgress);
    setCurrentProgress(0);
    setTimeout(() => setCurrentStep(step));
  };

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
              {currentStepInformation.algorithm.moves.join(" ")}
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
  // deno-fmt-ignore
  switch (step) {
    case 0:
      return {
        title: "ステップ1: 白い十字を作る",
        description: (
          <>
            <p>
              白センター?を上にして持ち、白い部分のエッジ?を見つけて下の層へ持っていく。
            </p>
            <p>エッジ?が同じ色のセンターの下になるように下の層を回す。</p>
            <p>その面を回転させて、エッジの部分を上に持っていく。</p>
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
              白が含まれるコーナーピースを探し、正しい位置に配置する。例えば「白・青・赤」のコーナーピースがあれば、青と赤のセンターの間に配置する。
            </p>
            <p>
              コーナーピースを適切な方法で白い面に持っていく。もしすでに白い面にあるが位置が間違っている場合は、一度下の層に出してから再配置する。
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
              黄色が含まれていないエッジピースを探し、正しい位置に配置する。例えば「赤・青」のエッジなら、赤いセンターに合わせる。
            </p>
            <p>
              その後は適切な方法で第二層に持っていく。もしエッジが間違った位置にある場合は、まずそれを取り出して再び正しく配置する。
            </p>
            <p>その面を回転させてエッジの部分を上に持っていく。</p>
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
              このステップでは以下の特定のアルゴリズムを使って黄色の面に十字（クロス）を作る。
            </p>
            <p>
              ここで3つのパターンがある。
            </p>
            <ol>
              <li>「線」  :1回のアルゴリズムで完成する。</li>
              <li>「L字」 :2回のアルゴリズムで完成する。</li>
              <li>「点」  :1回アルゴリズムを実行し、黄色の面を1、2回回してからもう一度実行する。</li>
            </ol>
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
            </p>
            <ol>
              <li>2つのエッジピースの色が隣り合っている場合 : <br />
              そのエッジピースを左側に配置し、アルゴリズムを実行する。</li>
              <li>2つのエッジピースの色が向かい合っている場合 : <br />
              アルゴリズムを実行してから、ステップ1と同じ手順を繰り返す。</li>
            </ol>
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
              黄色の4つのコーナーピースを正しい位置に配置することは目的である。
            </p>
            <p>
              すでに正しい位置にあるコーナーピースを見つけ左手側に持っていく。
              アルゴリズムを繰り返してすべてのコーナーピースが正しい位置になるまで行う。
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
            <p>最後に黄色の面を揃えて、ルービックキューブを完成させます！</p>
            <p>
              正しい位置にある黄色のコーナーを探してそれを右手側に持っていく。
              黄色のピースが下を向くまでアルゴリズムを繰り返す。すべてのコーナーが完成するまで続ける。
            </p>
          </>
        ),
        algorithm: steps.step7,
      };
  }
};
