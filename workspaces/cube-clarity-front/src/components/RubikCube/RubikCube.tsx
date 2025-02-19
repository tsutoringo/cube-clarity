import { type ComponentProps, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import styles from "./RubikCube.module.css";
import { RubikCubeRenderer } from "../../lib/rubikcube/RubikCubeRenderer";
import type {
  RubikCube,
  RubikCubeMoveNotation,
} from "../../lib/rubikcube/RubikCube/RubikCube";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import classNames from "classnames";
import { RubikCubeAnimator } from "../../lib/rubikcube/RubikCube/animator/RubikCubeAnimator";

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
  const [rubikCubeRenderer, setRubikCubeRenderer] = useState<
    null | RubikCubeRenderer
  >(null);

  const animator = useRef<RubikCubeAnimator | null>(null);

  const patchProgress = () => {
    if (!animator.current || !animation) return;

    animator.current.patchProgress(animation.progress);
  };

  useEffect(() => {
    if (rubikCubeParentRef.current) {
      const rubikCubeRenderer = new RubikCubeRenderer(
        rubikCubeParentRef.current,
      );

      rubikCubeRenderer.camera.position.x = 3.5;
      rubikCubeRenderer.camera.position.y = 3.5;
      rubikCubeRenderer.camera.position.z = 3.5;
      rubikCubeRenderer.camera.lookAt(new Vector3(0, 0, 0));

      setRubikCubeRenderer(rubikCubeRenderer);

      if (!onceRender) {
        new OrbitControls(
          rubikCubeRenderer.camera,
          rubikCubeParentRef.current,
        );

        const frame = () => {
          requestAnimationFrame(frame);
          rubikCubeRenderer.render();
        };

        frame();
      }

      return () => {
        rubikCubeRenderer.unmount();
      };
    }
  }, []);

  useEffect(() => {
    if (rubikCubeRenderer) {
      const rubikCubeGroup = rubikCubeRenderer.rerenderRubikCube(
        gotRubikCube,
      );

      if (animation) {
        animator.current = RubikCubeAnimator.generate(
          rubikCubeGroup,
          animation.moves,
        );
        patchProgress();
      }
    }
  }, [rubikCubeRenderer, gotRubikCube]);

  useEffect(() => {
    patchProgress();
  }, [animation?.progress]);

  useEffect(() => {
    if (animation && rubikCubeRenderer) {
      const rubikCubeGroup = rubikCubeRenderer.rerenderRubikCube(
        gotRubikCube,
      );

      animator.current = RubikCubeAnimator.generate(
        rubikCubeGroup,
        animation.moves,
      );
      patchProgress();
    }
  }, [animation?.moves]);

  return (
    <div
      {...otherProps}
      className={classNames(styles.rubikCube, className)}
      ref={rubikCubeParentRef}
    >
    </div>
  );
};
