import type { RubikCube } from "@lib/rubikcube/RubikCube/RubikCube";
import type { RubikCubeMoveNotation } from "@lib/rubikcube/RubikCube/MoveNotation";
import { Canvas } from "@react-three/fiber";
import { useContext, useEffect, useMemo, useRef } from "react";
import {
  RubikCubeGroupContext,
  RubikCubeThreeGroup,
} from "@components/RubikCube/RubikCubeGroup";
import {
  Euler,
  MathUtils,
  OrthographicCamera,
  Sprite,
  SpriteMaterial,
  TextureLoader,
} from "three";
import { moveInvert } from "./moveInvert";
import { movePathCreate } from "./movePathCreate";

type MoveGuideElement = {
  kind: "move";
  afterCube: RubikCube;
  move: RubikCubeMoveNotation;
};

type CubeGuideElement = {
  kind: "cube";
  cube: RubikCube;
};

type GuideElement = MoveGuideElement | CubeGuideElement;

const GAP = 6;
const PADDING = 6;

export const CubeGuide = ({
  baseCube,
  cubeList,
}: {
  baseCube: RubikCube;
  cubeList: {
    move: RubikCubeMoveNotation;
    cube: RubikCube;
  }[];
}) => {
  if (cubeList.length === 0) return;

  const canvasElement = useRef<HTMLCanvasElement>(null);

  const camera = useMemo(() => {
    return new OrthographicCamera();
  }, []);

  const guides = useMemo(() => {
    const guides: GuideElement[] = [
      {
        kind: "cube",
        cube: baseCube,
      },
    ];

    return cubeList.reduce((acc, current) => {
      acc.push({
        kind: "move",
        afterCube: current.cube,
        move: current.move,
      });

      acc.push({
        kind: "cube",
        cube: current.cube,
      });

      return acc;
    }, guides);
  }, [baseCube.encodeBase64(), cubeList]);

  useEffect(() => {
    if (!canvasElement.current) return;
    const current = canvasElement.current;

    camera.left = 0;
    camera.right = current.clientWidth;
    camera.top = 0;
    camera.bottom = current.clientHeight;
    camera.zoom = 13;
    camera.updateProjectionMatrix();
    camera.position.x = 15;
    camera.position.z = 20;
  }, []);

  useEffect(() => {
    const y = -((Math.ceil(guides.length / 6) * GAP + PADDING) / 2);
    camera.position.y = y;
  }, [guides.length]);

  const canvasHeight = (Math.ceil(guides.length / 6) * GAP + PADDING) * 12.8;

  const rotation = new Euler(
    MathUtils.degToRad(10),
    -MathUtils.degToRad(20),
    0,
  );

  return (
    <div
      style={{
        height: canvasHeight,
        width: "100%",
      }}
    >
      <Canvas
        camera={camera}
        ref={canvasElement}
      >
        {guides.map((guideElement, index) => {
          const x = index % 6 * GAP;
          const y = -(Math.floor(index / 6) * GAP + PADDING);
          // console.log(x, y)
          switch (guideElement.kind) {
            case "cube":
              return (
                <RubikCubeThreeGroup
                  key={index}
                  // キューブの表示
                  rubikCube={guideElement.cube}
                  position={{
                    x,
                    y,
                    z: 0,
                  }}
                  rotation={rotation}
                />
              );
            case "move":
              return (
                <RubikCubeThreeGroup
                  // ムーブキューブの表示
                  key={index}
                  rubikCube={guideElement.afterCube}
                  animation={{
                    moves: moveInvert(guideElement.move)?.moves,
                    progress: moveInvert(guideElement.move)?.progress,
                  }}
                  position={{
                    x,
                    y,
                    z: 0,
                  }}
                  rotation={rotation}
                >
                  <Arrow move={guideElement.move} />
                </RubikCubeThreeGroup>
              );
          }
        })}
      </Canvas>
    </div>
  );
};

const Arrow = ({
  move,
}: {
  move: RubikCubeMoveNotation;
}) => {
  const group = useContext(RubikCubeGroupContext);
  const sprite = useMemo(() => {
    const textureLoader = new TextureLoader();

    // 座標とパスを取得
    const paths = movePathCreate(move);
    // パスからthreeオブジェクトを作成してSpriteとしてreturnする
    const texture = textureLoader.load(paths.path);
    const material = new SpriteMaterial({ map: texture });
    const sprite = new Sprite(material);
    sprite.position.copy(paths.position);
    sprite.rotation.copy(paths.rotation);

    return sprite;
  }, [move]);

  useEffect(() => {
    group.add(sprite);

    return () => {
      group.remove(sprite);
    };
  }, []);

  return null;
};
