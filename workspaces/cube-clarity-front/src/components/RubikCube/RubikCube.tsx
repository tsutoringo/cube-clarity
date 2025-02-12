import { ComponentProps, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import styles from "./RubikCube.module.css";
import { RubikCubeRenderer } from "../../lib/rubikcube/RubikCubeRenderer";
import {
  parseMoveNotation,
  RubikCube,
} from "../../lib/rubikcube/RubikCube/RubikCube";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import classNames from "classnames";

interface RubikCubeDisplayProps extends ComponentProps<"div"> {
  onceRender?: boolean;
}

interface RubikCubeDisplayPropsWithMoveNotation extends RubikCubeDisplayProps {
  moves: string;
  base64?: never;
  rubikCube?: never;
}

interface RubikCubeDisplayPropsWithBase64 extends RubikCubeDisplayProps {
  moves?: never;
  base64: string;
  rubikCube?: never;
}

interface RubikCubeDisplayPropsWithRubikCube extends RubikCubeDisplayProps {
  moves?: never;
  base64?: never;
  rubikCube: RubikCube;
}

export const RubikCubeDisplay = (
  {
    className,
    moves,
    base64,
    rubikCube: gotRubikCube,
    onceRender = false,
    ...otherProps
  }:
    | RubikCubeDisplayPropsWithBase64
    | RubikCubeDisplayPropsWithMoveNotation
    | RubikCubeDisplayPropsWithRubikCube,
) => {
  const rubikCubeParentRef = useRef<HTMLDivElement>(null);
  const [rubikCubeRenderer, setRubikCubeRenderer] = useState<
    null | RubikCubeRenderer
  >(null);

  const getRubikCube = () => {
    return base64
      ? RubikCube.decodeBase64(base64).unwrap()
      : moves
      ? RubikCube.withMoveNotation(parseMoveNotation(moves).unwrap())
      : gotRubikCube
      ? gotRubikCube
      : null!;
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
      rubikCubeRenderer.rerenderRubikCube(getRubikCube());

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
      const rubikCube = getRubikCube();
      rubikCubeRenderer.rerenderRubikCube(
        rubikCube,
      );
    }
  }, [rubikCubeRenderer, moves, base64, gotRubikCube]);

  return (
    <div
      {...otherProps}
      className={classNames(styles.rubikCube, className)}
      ref={rubikCubeParentRef}
    >
    </div>
  );
};
