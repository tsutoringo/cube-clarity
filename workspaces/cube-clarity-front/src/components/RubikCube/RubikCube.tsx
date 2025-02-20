import { type ComponentProps, useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";
import styles from "./RubikCube.module.css";
import { RubikCubeRenderer } from "@lib/rubikcube/RubikCubeRenderer";
import type {
  RubikCube,
  RubikCubeMoveNotation,
} from "@lib/rubikcube/RubikCube/RubikCube";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import classNames from "classnames";
import { RubikCubeAnimator } from "@lib/rubikcube/RubikCube/animator/RubikCubeAnimator";

interface RubikCubeDisplayProps extends ComponentProps<"div"> {
  onceRender?: boolean;
  rubikCube: RubikCube;
  animation?: {
    moves: RubikCubeMoveNotation[];
    progress: number;
  };
}

export const RubikCubeDisplay = (
  {
    className,
    rubikCube: gotRubikCube,
    onceRender = false,
    animation,
    ...otherProps
  }: RubikCubeDisplayProps,
) => {
  const rubikCubeParentRef = useRef<HTMLDivElement>(null);
  const rubikCubeRenderer = useMemo(() => {
    const renderer = new RubikCubeRenderer();
    renderer.camera.position.x = 3.5;
    renderer.camera.position.y = 3.5;
    renderer.camera.position.z = 3.5;
    renderer.camera.lookAt(new Vector3(0, 0, 0));

    return renderer;
  }, [rubikCubeParentRef.current]);

  useEffect(() => {
    if (!rubikCubeParentRef.current) return;

    const cleanup = rubikCubeRenderer.setParent(rubikCubeParentRef.current);

    if (!onceRender) {
      new OrbitControls(
        rubikCubeRenderer.camera,
        rubikCubeParentRef.current,
      );

      // clearnuo時に止める機構を作る。
      const frame = () => {
        requestAnimationFrame(frame);
        rubikCubeRenderer.render();
      };

      frame();
    }

    return () => {
      cleanup();
    };
  }, [rubikCubeRenderer]);

  const animator = useMemo(() => {
    const rubikCubeGroup = rubikCubeRenderer.rerenderRubikCube(
      gotRubikCube,
    );

    if (animation) {
      return RubikCubeAnimator.generate(
        rubikCubeGroup,
        animation.moves,
      );
    }
  }, [animation?.moves, rubikCubeRenderer]);

  useEffect(() => {
    if (animator && animation?.progress) {
      animator.patchProgress(animation.progress);
    }
  }, [animator, animation?.progress]);

  return (
    <div
      {...otherProps}
      className={classNames(styles.rubikCube, className)}
      ref={rubikCubeParentRef}
    >
    </div>
  );
};
