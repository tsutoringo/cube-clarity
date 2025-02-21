import { RubikCube } from "../../lib/rubikcube/RubikCube/RubikCube";
import { RubikCubeMoveNotation } from "../../lib/rubikcube/RubikCube/MoveNotation";
import { Vector3, TextureLoader, BoxGeometry, ImageUtils, MeshPhongMaterial, Mesh, PlaneGeometry } from "three";
import { generateRubikCubeCubeModel } from "../../lib/rubikcube/RubikCubeModel";
import { useEffect, useRef, useState } from "react";
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
    
    // 案１
    // const geometry = new BoxGeometry()
    // const texture = ImageUtils.loadTexture("images/arrows/leftArrows.svg")
    // const material = new MeshPhongMaterial({ map:texture });
    // const cube = new Mesh( geometry, material );
    // cubeGuideRenderer.scene.add(cube)

    // 案２
    const texture = new TextureLoader().load("./images/allows/leftAllows.svg",
      (tex) => {
        const w = 5;
        const h = tex.image.height/(tex.image.width/w)

        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshPhongMaterial({map:texture});
        const plane = new Mesh(geometry, material);
        plane.scale.set(w,h,1);
        cubeGuideRenderer.scene.add(plane);
      }
    )




    // const baseCubeGroup = generateRubikCubeCubeModel(baseCube)
    // cubeGuideRenderer.scene.add(baseCubeGroup)
    // =====================================================
    // for(const currentCube of cubeList){
    //   const cubeGroup = generateRubikCubeCubeModel(currentCube.cube)
    //   // 次回ここから処理を書きます
    //   const cloneCubeGroup = cubeGroup.clone()
      
    //   // 回転をかける
    //   RubikCubeAnimator.generate(cloneCubeGroup,[currentCube.move]).patchProgress(0.5)
      
    //   switch(currentCube.move){
    //     case "R":
    //   }

    //   // positionを設定
    //   cubeGroup.position.set(0,0,0)
    //   cloneCubeGroup.position.set(0,0,0)
      
      
    //   // sceneにキューブを追加
    //   cubeGuideRenderer.scene.add(cubeGroup)
    //   cubeGuideRenderer.scene.add(cloneCubeGroup)
      
    // }
    // =====================================================

  }, []);

  return (
    <div
      ref={cubeRef}
    >
    </div>
  );
};