import type { RubikCube, RubikCubeMoveNotation } from "@cube-clarity/core";
import { Canvas } from "@react-three/fiber";
import { useContext, useEffect, useMemo, useRef } from "react";
import {
  RubikCubeGroupContext,
  RubikCubeThreeGroup,
} from "@components/RubikCube/RubikCubeGroup";
import {
  Euler,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  TextureLoader,
  Vector3,
} from "three";
import { moveInvert } from "./moveInvert";
import { createMovePath } from "./movePathCreate";
import { Group } from "three";

import twoRad from "./images/two_rad.svg"

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
  moves,
}: {
  baseCube: RubikCube;
  moves: RubikCubeMoveNotation[];
}) => {
  if (moves.length === 0) return;

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

    return moves.reduce((acc, currentMoves) => {
      const beforeCube = acc[acc.length - 1] as CubeGuideElement;
      const afterCube = beforeCube.cube.rotateCubeOnce(currentMoves);

      acc.push({
        kind: "move",
        afterCube,
        move: currentMoves,
      });

      acc.push({
        kind: "cube",
        cube: afterCube,
      });

      return acc;
    }, guides);
  }, [baseCube.encodeBase64(), moves]);

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
                  {createMovePath(guideElement.move).is180Rotate && <TwoRad/>}
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
    const paths = createMovePath(move);
    // パスからthreeオブジェクトを作成してSpriteとしてreturnする
    const texture = textureLoader.load(paths.path);
    const geometry = new PlaneGeometry(paths.size.width, paths.size.height);
    const material = new MeshBasicMaterial({ map: texture, transparent: true });
    const sprite = new Mesh(geometry, material);

    sprite.rotation.copy(paths.spriteRotation);
    sprite.position.copy(paths.position);
    const spriteGroup = new Group();
    spriteGroup.rotation.copy(paths.rotation);
    spriteGroup.add(sprite);

    return spriteGroup;
  }, [move]);

  useEffect(() => {
    group.add(sprite);

    return () => {
      group.remove(sprite);
    };
  }, [move]);

  return null;
};

const TwoRad = () => {
  const group = useContext(RubikCubeGroupContext);
  const sprite = useMemo(() => {
    const textureLoader = new TextureLoader();

    const texture = textureLoader.load(twoRad);
    const geometry = new PlaneGeometry(1.75, 1.2);
    const material = new MeshBasicMaterial({ map: texture, transparent: true });
    const sprite = new Mesh(geometry, material);

    const position = new Vector3()
    const rotation = new Euler()

    sprite.position.copy(
      position.set( 2.5, 2.7, 1.6 )
    );

    const spriteGroup = new Group();
    spriteGroup.rotation.copy(
      rotation.set(
        0,
        MathUtils.degToRad(20),
        0
      )
    );

    spriteGroup.add(sprite);
    return spriteGroup;



  }, []);

  useEffect(() => {
    group.add(sprite);

    return () => {
      group.remove(sprite);
    };
  }, []);

  return null;
}