import { RubikCube } from "../../lib/rubikcube/RubikCube/RubikCube";
import { RubikCubeMoveNotation } from "../../lib/rubikcube/RubikCube/MoveNotation";
import { BoxGeometry, OrthographicCamera, Scene, Vector3, WebGLRenderer } from "three";
import { generateRubikCubeCubeModel } from "../../lib/rubikcube/RubikCubeModel";
import { CubeGuideRenderer } from "./CubeGuideRenderer"
import { useEffect, useRef } from "react";

const CubeGuide = (
  baseCube: RubikCube,
  cubeList: {
    move: RubikCubeMoveNotation;
    cube: RubikCube;
  }[],
) => {
  const cubeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const refCurrent = cubeRef.current;
    if (!refCurrent) return;
    const CubeRenderer = new CubeGuideRenderer(
      refCurrent,
    );
    CubeRenderer.camera.position.set(0,0,10); // x:0,y:0,z:10の位置にカメラを指定する
    CubeRenderer.camera.lookAt(new Vector3(0,0,0)) // 0,0,0の方向を向かせ続ける

    CubeRenderer.render() // レンダーとセットする

    

    return () => {
      CubeRenderer.unmount();
    };
  }, []);

  return (
    <div
      ref={cubeRef}
    >
    </div>
  );
};
