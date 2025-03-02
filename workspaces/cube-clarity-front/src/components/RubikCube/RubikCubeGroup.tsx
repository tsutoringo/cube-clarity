import {
  generateRubikCubeCubeModel,
  type RubikCube,
  RubikCubeAnimator,
  type RubikCubeGroup,
  type RubikCubeMoveNotation,
} from "@cube-clarity/core";

import { useThree } from "@react-three/fiber";
import { createContext, type ReactNode, useEffect, useMemo } from "react";
import { Euler, Vector3, type Vector3Like } from "three";

export const RubikCubeGroupContext = createContext<RubikCubeGroup>(
  "nuaall" as never,
);

export const RubikCubeThreeGroup = ({
  rubikCube,
  animation,
  position = new Vector3(0, 0, 0),
  rotation = new Euler(0, 0, 0),
  children,
}: {
  rubikCube: RubikCube;
  animation?: {
    moves: RubikCubeMoveNotation[];
    progress: number;
  };
  position?: Vector3Like;
  rotation?: Euler;
  children?: ReactNode;
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

  useEffect(() => {
    group.rotation.copy(rotation);
    scene.add(group);

    return () => {
      scene.remove(group);
    };
  }, [group]);

  useEffect(() => {
    group.rotation.copy(rotation);
  }, [rotation.x, rotation.y, rotation.z]);

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

    animator?.patchProgress(animation.progress);

    gl.render(scene, camera);
  }, [animation?.progress]);

  return (
    <RubikCubeGroupContext.Provider value={group}>
      {children}
    </RubikCubeGroupContext.Provider>
  );
};
