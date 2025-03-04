import { useMemo, useRef } from "react";
import { CSSTransition } from "react-transition-group";

import cube from "@assets/CUBE.svg";
import clarity from "@assets/CLARITY.svg";
import { Loading } from "@components/Loading/Loading";

import styles from "./Home.module.css";
import { SingleRubikCubeDisplay } from "@components/RubikCube/RubikCube";
import { RubikCube } from "@cube-clarity/core";

const StartAnimationPage = ({
  displaying,
  onStartEnd,
}: {
  displaying: boolean;
  onStartEnd: () => void;
}) => {
  const startAnimationRef = useRef<HTMLDivElement>(null);
  return (
    <CSSTransition
      timeout={1100}
      mountOnEnter
      unmountOnExit
      in={displaying}
      nodeRef={startAnimationRef}
      classNames={styles}
      onEntered={onStartEnd}
    >
      <div ref={startAnimationRef} className={styles.startAnimation}>
        <p className={styles.alignLeft}>
          <img src={cube} alt="" />
        </p>
        <p className={styles.alignRight}>
          <img src={clarity} alt="" />
        </p>
      </div>
    </CSSTransition>
  );
};

const ScanPage = ({
  displaying,
  onScanStart,
}: {
  displaying: boolean;
  onScanStart: () => void;
}) => {
  const homepageRef = useRef<HTMLDivElement>(null);
  const viewingRubikCube = useMemo(() => RubikCube.default(), []);

  return (
    <CSSTransition
      timeout={1100}
      mountOnEnter
      unmountOnExit
      in={displaying}
      nodeRef={homepageRef}
      classNames={styles}
    >
      <div ref={homepageRef} className={styles.homeSpace}>
        <div className={styles.titleLogo}>
          <p>
            <img src={cube} alt="" className={styles.cubeClarity} />
          </p>
          <p>
            <img src={clarity} alt="" className={styles.cubeClarity} />
          </p>
        </div>
        <section className={styles.mainCube}>
          <SingleRubikCubeDisplay
            rubikCube={viewingRubikCube}
          />
        </section>
        <p className={styles.text}>
          <span className={styles.spanHeader}>スキャンして、解こう！</span>
          <br />
          ルービックキューブを読み取って、<br />
          最速で解く方法を見つけよう
        </p>
        <div className={styles.circle} onClick={() => onScanStart()}></div>
      </div>
    </CSSTransition>
  );
};

export const LoadingPage = ({
  displaying,
}: {
  displaying: boolean;
}) => {
  const loadingPageRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      nodeRef={loadingPageRef}
      timeout={1100}
      mountOnEnter
      unmountOnExit
      in={displaying}
      classNames={styles}
    >
      <div ref={loadingPageRef} className={styles.loadingPage}>
        <Loading />
      </div>
    </CSSTransition>
  );
};

export const Home = {
  StartAnimationPage,
  ScanPage,
  LoadingPage,
} as const;
