import { RubikCube } from "../../lib/rubikcube/RubikCube/RubikCube";
import { RubikCubeMoveNotation } from "../../lib/rubikcube/RubikCube/MoveNotation";
import { BoxGeometry, OrthographicCamera, Scene, Vector3, WebGLRenderer } from "three";
import { generateRubikCubeCubeModel } from "../../lib/rubikcube/RubikCubeModel";
import { useEffect, useRef, useState } from "react";
import { CubeGuideRenderer } from "./CubeGuideRenderer";


const CubeGuide = (
  baseCube: RubikCube,
  cubeList: {
    move: RubikCubeMoveNotation;
    cube: RubikCube;
  }[],
) => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const [cubeGuideRenderer, setCubeGuideRenderer] = useState<
    null| CubeGuideRenderer
  >(null);
  
  useEffect(() => {
    if (!cubeRef.current) return;
    const cubeGuideRenderer = new CubeGuideRenderer(
      cubeRef.current,
    );
    // カメラの設定
    cubeGuideRenderer.camera.position.set(0,0,10);
    cubeGuideRenderer.camera.lookAt(new Vector3(0,0,0));

    // useStateを利用して新しく設定
    setCubeGuideRenderer(cubeGuideRenderer);
    
    // レンダリングする
    cubeGuideRenderer.render();
    for(const currentCube of cubeList){
      const cubeGroup = generateRubikCubeCubeModel(currentCube.cube)
      // 次回ここから処理を書きます
    }
  }, []);

  return (
    <div
      ref={cubeRef}
    >
    </div>
  );
};
