import type { HTMLAttributes } from "react";
import styles from "./RubikCube.module.css";
import type { RubikCube, RubikCubeMoveNotation } from "@cube-clarity/core";
import classNames from "classnames";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RubikCubeThreeGroup } from "./RubikCubeGroup";

interface RubikCubeDisplayProps extends HTMLAttributes<HTMLDivElement> {
  onceRender?: boolean;
  rubikCube: RubikCube;
  animation?: {
    moves: RubikCubeMoveNotation[];
    progress: number;
  };
}

export const SingleRubikCubeDisplay = (
  {
    className,
    rubikCube: gotRubikCube,
    onceRender: _onceRenderer = false,
    animation,
    ...otherProps
  }: RubikCubeDisplayProps,
) => {
  return (
    <Canvas
      {...otherProps}
      camera={{
        position: [3, 3, 3],
      }}
      className={classNames(styles.rubikCube, className)}
    >
      <OrbitControls />
      <RubikCubeThreeGroup
        animation={animation}
        rubikCube={gotRubikCube}
      />
    </Canvas>
  );
};
