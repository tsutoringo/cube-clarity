import { RubikCube } from "../../lib/rubikcube/RubikCube/RubikCube";
import { RubikCubeMoveNotation } from "../../lib/rubikcube/RubikCube/MoveNotation";
import { BoxGeometry, OrthographicCamera, Scene, Vector3, WebGLRenderer } from "three";
import { generateRubikCubeCubeModel } from "../../lib/rubikcube/RubikCubeModel";
import { useEffect, useRef, useState } from "react";
import { RubikCubeGroup } from "../../lib/rubikcube/RubikCubeModel"
import { CubeGuideRenderer } from "./CubeGuideRenderer";
import { RubikCubeAnimator } from "../../lib/rubikcube/RubikCube/animator/RubikCubeAnimator"


export const CubeGuide = (
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
    
    const baseCubeGroup = generateRubikCubeCubeModel(baseCube)
    cubeGuideRenderer.scene.add(baseCubeGroup)
    
    for(const currentCube of cubeList){
      const cubeGroup = generateRubikCubeCubeModel(currentCube.cube)
      // 次回ここから処理を書きます
      const cloneCubeGroup = cubeGroup.clone()

      // 回転を書ける
      const animator = RubikCubeAnimator.generate(cloneCubeGroup,[currentCube.move])
      // 回転を半分で止める
      animator.patchProgress(0.5)
      
      // positionを設定
      cubeGroup.position.set(0,0,0)
      cloneCubeGroup.position.set(0,0,0)
      
      
      // sceneにキューブを追加
      cubeGuideRenderer.scene.add(cubeGroup)
      cubeGuideRenderer.scene.add(cloneCubeGroup)
      
    }
  }, []);

  return (
    <div
      ref={cubeRef}
    >
    </div>
  );
};