import { RubikCubeAnimator } from "@lib/rubikcube/RubikCube/animator/RubikCubeAnimator";
import type {
  RubikCube,
  RubikCubeMoveNotation,
} from "@lib/rubikcube/RubikCube/RubikCube";
import {
  generateRubikCubeCubeModel,
  type RubikCubeGroup,
} from "@lib/rubikcube/RubikCubeModel";
import { useThree } from "@react-three/fiber";
import { createContext, type ReactNode, useEffect, useMemo } from "react";
import { Vector3, type Vector3Like } from "three";

export const RubikCubeGroupContext = createContext<RubikCubeGroup>(
  "nuaall" as never,
);

export const RubikCubeThreeGroup = ({
  rubikCube,
  animation,
  position = new Vector3(0, 0, 0),
  children,
}: {
  rubikCube: RubikCube;
  animation?: {
    moves: RubikCubeMoveNotation[];
    progress: number;
  };
  position?: Vector3Like;
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
