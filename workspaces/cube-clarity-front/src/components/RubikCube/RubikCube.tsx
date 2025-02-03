import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import styles from "./RubikCube.module.css";
import { RubikCubeRenderer } from "../../lib/rubikcube/RubikCubeRenderer";
import { RubikCube } from "../../lib/rubikcube/RubikCube/RubikCube";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { parseMoveNotation } from "../../lib/rubikcube/RubikCube/MoveNotation";

export const RubikCubeDisplay = () => {
  const rubikCubeParentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rubikCubeParentRef.current) {
      const rubikCubeRenderer = new RubikCubeRenderer(
        rubikCubeParentRef.current,
      );

      rubikCubeRenderer.rerenderRubikCube(
        RubikCube.withMoveNotation(
          parseMoveNotation(
            "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
          ).unwrap(),
        ),
      );

      rubikCubeRenderer.camera.position.x = 3.5;
      rubikCubeRenderer.camera.position.y = 3.5;
      rubikCubeRenderer.camera.position.z = 3.5;
      rubikCubeRenderer.camera.lookAt(new Vector3(0, 0, 0));

      new OrbitControls(
        rubikCubeRenderer.camera,
        rubikCubeParentRef.current,
      );

      rubikCubeRenderer.render();

      const frame = () => {
        requestAnimationFrame(frame);
        rubikCubeRenderer.render();
      };

      frame();

      return () => {
        rubikCubeRenderer.unmount();
      };
    }
  }, []);

  return (
    <div className={styles.rubikCube} ref={rubikCubeParentRef}>
    </div>
  );
};
