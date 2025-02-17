import { ComponentProps, useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import styles from "./RubikCube.module.css";
import { RubikCubeRenderer } from "../../lib/rubikcube/RubikCubeRenderer";
import {
  parseMoveNotation,
  RubikCube,
} from "../../lib/rubikcube/RubikCube/RubikCube";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import classNames from "classnames";
import { cornerCubeTween } from "../../lib/rubikcube/RubikCube/animator/2d/corner";
import { RubikCubeAnimator } from "../../lib/rubikcube/RubikCube/animator/RubikCubeAnimator";

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
      const rubikCubeGroup = rubikCubeRenderer.rerenderRubikCube(
        rubikCube,
      );

      const animator = RubikCubeAnimator.generate(
        rubikCubeGroup,
        parseMoveNotation("R F R F").unwrap(),
      );

      let acc = 0;
      setInterval(() => {
        animator.patchProgress(acc / 100)
        // const ufr = cornerCubeTween("UR", "UL", acc / 100, "counterclockwise");

        // rubikCubeGroup.cubePieces.UFR.position.y = ufr.y;
        // rubikCubeGroup.cubePieces.UFR.position.x = ufr.x;

        // rubikCubeGroup.cubePieces.UFR.rotation.z = MathUtils.degToRad(ufr.degree);

        // const ufl = cornerCubeTween("UL", "DL", acc / 100, "counterclockwise");

        // rubikCubeGroup.cubePieces.UFL.position.y = ufl.y;
        // rubikCubeGroup.cubePieces.UFL.position.x = ufl.x;

        // rubikCubeGroup.cubePieces.UFL.rotation.z = MathUtils.degToRad(ufl.degree);

        // const dfr = cornerCubeTween("DR", "UR", acc / 100, "counterclockwise");

        // rubikCubeGroup.cubePieces.DFR.position.y = dfr.y;
        // rubikCubeGroup.cubePieces.DFR.position.x = dfr.x;

        // rubikCubeGroup.cubePieces.DFR.rotation.z = MathUtils.degToRad(dfr.degree);

        // const dfl = cornerCubeTween("DL", "DR", acc / 100, "counterclockwise");

        // rubikCubeGroup.cubePieces.DFL.position.y = dfl.y;
        // rubikCubeGroup.cubePieces.DFL.position.x = dfl.x;

        // rubikCubeGroup.cubePieces.DFL.rotation.z = MathUtils.degToRad(dfl.degree);

        acc = (acc + 1) % 100;
      }, 50);

      // const ufr = cornerCubeTween("UR", "UL", 2.5, "counterclockwise");

      // rubikCubeGroup.cubePieces.UFR.position.y = ufr.y;
      // rubikCubeGroup.cubePieces.UFR.position.x = ufr.x;

      // rubikCubeGroup.cubePieces.UFR.rotation.z = ufr.degree;

      // const ufl = cornerCubeTween("UL", "DL", 2.5, "counterclockwise");

      // rubikCubeGroup.cubePieces.UFL.position.y = ufl.y;
      // rubikCubeGroup.cubePieces.UFL.position.x = ufl.x;

      // rubikCubeGroup.cubePieces.UFL.rotation.z = ufl.degree;
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
