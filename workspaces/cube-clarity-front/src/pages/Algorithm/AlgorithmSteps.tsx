import { type RubikCube, solveRubikCube } from "@cube-clarity/core";
import { type ReactNode, useMemo, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
// @ts-types="./AlgorithmStep.module.css.d.ts"
import styles from "./AlgorithmStep.module.css";
import { BottomDrawer } from "@layouts/BottomDrawer/BottomDrawer.tsx";
import { SingleRubikCubeDisplay } from "@components/RubikCube/RubikCube.tsx";
import { HorizontalRule } from "@components/HorizontalRule/HorizontalRule.tsx";
import { Button } from "@components/Button/Button.tsx";
import { CubeGuide } from "@components/CubeGuide/CubeGuide.tsx";
import { CubeHint } from "@components/CubeHint/CubeHint.tsx";
import corner from "./images/corner.webp";
import edge from "./images/edge.webp";
import firstLayer from "./images/first_layer.webp";
import matchCorner from "./images/match_corner.webp";
import matchCrossColor from "./images/match_cross_color.webp";
import matchCrossColorAdjacent from "./images/match_cross_color_adjacent.webp";
import matchCrossColorOpposite from "./images/match_cross_color_opposite.webp";
import secondLayer from "./images/second_layer.webp";
import solveCube from "./images/solve_cube.webp";
import whiteCenter from "./images/white_center.webp";
import whiteCross from "./images/white_cross.webp";
import yellowCross from "./images/yellow_cross.webp";
import yellowCrossDot from "./images/yellow_cross_dot.webp";
import yellowCrossLLetter from "./images/yellow_cross_L_letter.webp";
import yellowCrossMinus from "./images/yellow_cross_minus.webp";

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

  const handleRubikCubeGroup = (index: number) => {
    setCurrentProgress(index / 2);
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
          <BottomDrawer.ViewBox className={styles.viewBox}>
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
                    onRubikCubeClick={handleRubikCubeGroup}
                    baseCube={currentStepInformation.algorithm.startRubikCube}
                    moves={currentStepInformation.algorithm.moves}
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
  // deno-fmt-ignore
  switch (step) {
    case 0:
      return {
        title: <>ステップ1: <CubeHint word="白い十字" imageSrc={whiteCross}/>を作る</>,
        description: (
          <>
            <p>
              <CubeHint word="白センター" imageSrc={whiteCenter} />を上にして持ち、白い部分の
              <CubeHint word="エッジ" imageSrc={edge} />を見つけて下の層へ持っていく。
            </p>
            <p><CubeHint word="エッジ" imageSrc={edge}/>が同じ色のセンターの下になるように下の層を回す。</p>
            <p>その面を回転させて、エッジの部分を上に持っていく。</p>
          </>
        ),
        algorithm: steps.step1,
      };
    case 1:
      return {
        title: <>ステップ2: <CubeHint word="白い面" imageSrc={firstLayer}/>を完成させる</>,
        description: (
          <>
            <p>
              白が含まれる<CubeHint word="コーナーピース" imageSrc={corner}/>を探し、正しい位置に配置する。例えば「白・青・赤」のコーナーピースがあれば、青と赤のセンターの間に配置する。
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
        title: <>ステップ3: <CubeHint word="第二層" imageSrc={secondLayer}/>を完成させる</>,
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
        title: <>ステップ4: <CubeHint word="黄色の十字" imageSrc={yellowCross}/>を作る</>,
        description: (
          <>
            <p>
              このステップでは以下の特定のアルゴリズムを使って黄色の面に十字（クロス）を作る。
            </p>
            <p>
              ここで3つのパターンがある。
            </p>
            <ol>
              <li><CubeHint word="「線」" imageSrc={yellowCrossMinus}/>  :1回のアルゴリズムで完成する。</li>
              <li><CubeHint word="「L字」" imageSrc={yellowCrossLLetter}/> :2回のアルゴリズムで完成する。</li>
              <li><CubeHint word="「点」" imageSrc={yellowCrossDot}/>  :1回アルゴリズムを実行し、黄色の面を1、2回回してからもう一度実行する。</li>
            </ol>
          </>
        ),
        algorithm: steps.step4,
      };
    case 4:
      return {
        title: <>ステップ5: <CubeHint word="クロスの色" imageSrc={matchCrossColor}/>を揃える</>,
        description: (
          <>
            <p>
              黄色のクロスを完成させたら、各エッジピースの色を正しい位置に合わせる。今回は以下のアルゴリズムを使う。
            </p>
            <p>
              ここで2つのパターンがある。<br />
            </p>
            <ol>
              <li>2つの<CubeHint word="エッジピースの色が隣り合っている" imageSrc={matchCrossColorAdjacent}/>場合 : <br />
              そのエッジピースを左側に配置し、アルゴリズムを実行する。</li>
              <li>2つの<CubeHint word="エッジピースの色が向かい合っている" imageSrc={matchCrossColorOpposite}/>場合 : <br />
              アルゴリズムを実行してから、ステップ1と同じ手順を繰り返す。</li>
            </ol>
          </>
        ),
        algorithm: steps.step5,
      };
    case 5:
      return {
        title: <>ステップ6: <CubeHint word="コーナーを配置する" imageSrc={matchCorner}/></>,
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
        title: <>ステップ7: <CubeHint word="コーナーを揃える" imageSrc={solveCube}/></>,
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
