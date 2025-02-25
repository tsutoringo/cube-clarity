import type { RubikCube } from "../../lib/rubikcube/RubikCube/RubikCube";
import type { RubikCubeMoveNotation } from "../../lib/rubikcube/RubikCube/MoveNotation";
import { Canvas } from "@react-three/fiber";
import { useContext, useEffect, useMemo, useRef } from "react";
import { RubikCubeThreeGroup } from "@components/RubikCube/RubikCube";
import {
  OrthographicCamera,
  Sprite,
  SpriteMaterial,
  TextureLoader,
} from "three";
import { moveImageList } from "./moveImageList";
import { moveInvert } from "./moveInvert";

// 画像のインポート
import upArrow from "./images/arrows/up_Arrows.svg";
import downArrow from "./images/arrows/down_Arrow.svg";
import leftArrow from "./images/arrows/left_Arrow.svg";
import rightArrow from "./images/arrows/right_Arrow.svg";
import rightCircle from "./images/arrows/right_Circle.svg";
import leftCircle from "./images/arrows/left_Circle.svg";

export const CubeGuide = (
  baseCube: RubikCube,
  cubeList: {
    move: RubikCubeMoveNotation;
    cube: RubikCube;
  }[],
) => {
  if (cubeList.length === 0) return;

  const canvasElement = useRef<HTMLCanvasElement>(null);
  if (!canvasElement.current) return;
  const current = canvasElement.current;
  OrthographicCamera;
  const camera = new OrthographicCamera(
    current.width / -2,
    current.width / 2,
    current.height / -2,
    current.height / 2,
    1,
    1000,
  );
  const cubeLength = cubeList.length * 2 - 1;

  // 矢印画像挿入
  const Arrow = ({
    move,
  }: {
    move: RubikCubeMoveNotation;
  }) => {
    const group = useContext(RubikCubeGroupContext);
    const sprite = useMemo(() => {
      const textureLoader = new TextureLoader();
      let imagePath = "";

      // それぞれのmoveに合わせてパスを変更
      if (moveImageList.up.includes(move)) {
        imagePath = upArrow;
      }
      if (moveImageList.down.includes(move)) {
        imagePath = downArrow;
      }
      if (moveImageList.left.includes(move)) {
        imagePath = leftArrow;
      }
      if (moveImageList.right.includes(move)) {
        imagePath = rightArrow;
      }
      if (moveImageList.leftTurn.includes(move)) {
        imagePath = leftCircle;
      }
      if (moveImageList.rightTurn.includes(move)) {
        imagePath = rightCircle;
      }

      // パスからthreeオブジェクトを作成してSpriteとしてreturnする
      const texture = textureLoader.load(imagePath);
      const material = new SpriteMaterial({ map: texture });
      return new Sprite(material);
    }, [move]);

    useEffect(() => {
      group.add(sprite);

      return () => {
        group.remove(sprite);
      };
    }, []);

    return null;
  };

  return (
    <Canvas
      camera={camera}
      ref={canvasElement}
    >
      {/* 最初のキューブ */}
      <RubikCubeThreeGroup
        rubikCube={baseCube}
        position={{ x: 1, y: 1, z: 1 }}
      >
      </RubikCubeThreeGroup>

      {cubeList.map((item, index) => (
        <RubikCubeThreeGroup
          // 折り返しの条件分岐が必用
          rubikCube={item.cube}
          animation={{
            moves: moveInvert(item.move)?.moves,
            progress: moveInvert(item.move)?.progress,
          }}
          position={{
            x: index * 2,
            y: 0,
            z: index * 2,
          }}
        >
          <Arrow move={item.move} />
        </RubikCubeThreeGroup>
      ))}
      <RubikCubeThreeGroup
        rubikCube={cubeList[cubeList.length - 1].cube}
        position={{
          x: cubeLength,
          y: 0,
          z: 0,
        }}
      >
      </RubikCubeThreeGroup>
    </Canvas>
  );
};
