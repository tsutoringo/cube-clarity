import { RubikCube } from "../../lib/rubikcube/RubikCube/RubikCube";
import { RubikCubeMoveNotation } from "../../lib/rubikcube/RubikCube/MoveNotation";
import { BoxGeometry, OrthographicCamera, Scene, WebGLRenderer } from "three";
import { generateRubikCubeCubeModel } from "../../lib/rubikcube/RubikCubeModel";
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

    const width = refCurrent?.clientWidth;
    const height = refCurrent?.clientHeight;
    const aspect = width / height;

    const frustumSize = height;
    const left = (frustumSize * aspect) / -2;
    const right = (frustumSize * aspect) / 2;
    const top = frustumSize / 2;
    const bottom = frustumSize / -2;

    // シーンの作成
    const scene = new Scene();

    // レンダラーの設定
    const renderer = new WebGLRenderer();
    renderer.setSize(width, height);
    refCurrent.appendChild(renderer.domElement);

    // cameraの設定
    const camera = new OrthographicCamera(left, right, top, bottom, 0.1, 1000);
    camera.position.z = 20;
  }, []);

  return (
    <div
      ref={cubeRef}
    >
    </div>
  );
};
