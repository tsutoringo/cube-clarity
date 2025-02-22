import { type HTMLAttributes, useEffect, useMemo } from "react";
import styles from "./RubikCube.module.css";
import type {
  RubikCube,
  RubikCubeMoveNotation,
} from "@lib/rubikcube/RubikCube/RubikCube";
import classNames from "classnames";
import { RubikCubeAnimator } from "@lib/rubikcube/RubikCube/animator/RubikCubeAnimator";
import { Canvas, useThree } from "@react-three/fiber";
import { generateRubikCubeCubeModel } from "@lib/rubikcube/RubikCubeModel";
import { Vector3, type Vector3Like } from "three";

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
      <axesHelper args={[10]} />
      <RubikCubeThreeGroup
        animation={animation}
        rubikCube={gotRubikCube}
      />
    </Canvas>
  );
};

export const RubikCubeThreeGroup = ({
  rubikCube,
  animation,
  position = new Vector3(0, 0, 0),
}: {
  rubikCube: RubikCube;
  animation?: {
    moves: RubikCubeMoveNotation[];
    progress: number;
  };
  position?: Vector3Like;
}) => {
  const { scene, camera, gl } = useThree();
  const group = useMemo(() => {
    return generateRubikCubeCubeModel(rubikCube);
  }, [rubikCube]);

  useEffect(() => {
    group.position.copy(position);
    scene.add(group);

    return () => {
      scene.remove(group);
    };
  }, [group]);

  useEffect(() => {
    group.position.copy(position);
  }, [position.x, position.y, position.z]);

  const animator = useMemo(() => {
    if (!animation) return;

    const animator = RubikCubeAnimator.generate(
      group,
      animation.moves,
    );
    animator.patchProgress(animation.progress);

    return animator;
  }, [group, animation?.moves]);

  useEffect(() => {
    if (!animation) return;

    console.log(animation.progress);

    animator?.patchProgress(animation.progress);

    gl.render(scene, camera);
  }, [animation?.progress]);

  return null;
};
