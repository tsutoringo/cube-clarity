import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import styles from "./RubikCube.module.css";
import { RubikCubeRenderer } from "../../lib/rubikcube/RubikCubeRenderer";
import { RubikCubeMove } from '../../lib/rubikcube/RubikCube';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const RubikCube = () => {
  const rubikCubeParentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rubikCubeParentRef.current) {
      const rubikCubeRenderer = new RubikCubeRenderer(
        rubikCubeParentRef.current,
      );

      rubikCubeRenderer.rerenderRubikCube(
        rubikCubeRenderer.rubikCube.rotateCube("U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2".split(" ") as RubikCubeMove[])
      );

      // cube.rotation.z = 1;
      // cube.rotation.x = -1;
      // cube.rotation.y = 2;
      rubikCubeRenderer.camera.position.x = 3.5;
      rubikCubeRenderer.camera.position.y = 3.5;
      rubikCubeRenderer.camera.position.z = 3.5;
      rubikCubeRenderer.camera.lookAt(new Vector3(0, 0, 0));

      const controls = new OrbitControls(rubikCubeRenderer.camera, rubikCubeParentRef.current);

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
