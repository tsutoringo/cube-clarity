import { RubikCube, RubikCubeGroup, RubikCubeMoveNotation } from "@cube-clarity/core";
import { Canvas } from "@react-three/fiber";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  RubikCubeGroupContext,
  RubikCubeGroupWithIndex,
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
import { getMoveGuideInformation } from "./moveGuideInformation";
import { Group } from "three";

import twoRad from "./images/two_rad.svg";
import { RaycasterForRubikCubeGroup } from "@components/RubikCube/RubikCubeGroupRaycaster";

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

const DEFAULT_CUBE_ROTATION = new Euler(
  MathUtils.degToRad(10),
  -MathUtils.degToRad(20),
  0,
);

export const CubeGuide = ({
  baseCube,
  moves,
  onRubikCubeClick
}: {
  baseCube: RubikCube;
  moves: RubikCubeMoveNotation[];
  onRubikCubeClick?: (index: number) => void;
}) => {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const [currentCursor, setCurrentCursor] = useState<"pointer" | "default">("pointer");

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

  // キーに使用することで強制的にレンダリングさせる。
  const baseCubeIdentify = useMemo(() => {
    return crypto.randomUUID();
  }, [baseCube]);

  const canvasHeight = (Math.ceil(guides.length / 6) * GAP + PADDING) * 12.8;

  const onRubikCubeGroupClick = (rubikCubeGroup: RubikCubeGroup | null) => {
    if (rubikCubeGroup instanceof RubikCubeGroupWithIndex) {
      onRubikCubeClick?.(rubikCubeGroup.index);
    }
  };

  const onMousemove = (rubikCubeGroup: RubikCubeGroup | null) => {
    if (rubikCubeGroup == null) {
      setCurrentCursor("default");
    } else {
      setCurrentCursor("pointer");
    }
  };

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
        style={{
          cursor: currentCursor
        }}
      >
        <RaycasterForRubikCubeGroup
          onClick={onRubikCubeGroupClick}
          onMousemove={onMousemove}
        />
        {guides.map((guideElement, index) => {
          const x = index % 6 * GAP;
          const y = -(Math.floor(index / 6) * GAP + PADDING);
          // console.log(x, y)
          switch (guideElement.kind) {
            case "cube":
              return (
                <RubikCubeThreeGroup
                  key={index}
                  index={index}
                  // キューブの表示
                  rubikCube={guideElement.cube}
                  position={{
                    x,
                    y,
                    z: 0,
                  }}
                  rotation={DEFAULT_CUBE_ROTATION}
                />
              );
            case "move":
              return (
                <RubikCubeThreeGroup
                  // ムーブキューブの表示
                  key={index + baseCubeIdentify}
                  index={index}
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
                  rotation={DEFAULT_CUBE_ROTATION}
                >
                  <Arrow move={guideElement.move} />
                  {getMoveGuideInformation(guideElement.move).is180Rotate && (
                    <TwoRad />
                  )}
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
    // 座標とパスを取得
    const guideArrowInformation = getMoveGuideInformation(move);
    // パスからthreeオブジェクトを作成してSpriteとしてreturnする

    const geometry = new PlaneGeometry(
      guideArrowInformation.size.width,
      guideArrowInformation.size.height,
    );
    const material = new MeshBasicMaterial({
      map: guideArrowInformation.texture,
      transparent: true,
    });
    const sprite = new Mesh(geometry, material);

    sprite.rotation.copy(guideArrowInformation.spriteRotation);
    sprite.position.copy(guideArrowInformation.position);
    const spriteGroup = new Group();
    spriteGroup.rotation.copy(guideArrowInformation.rotation);
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

    const position = new Vector3();
    const rotation = new Euler();

    sprite.position.copy(
      position.set(2.5, 2.7, 1.6),
    );

    const spriteGroup = new Group();
    spriteGroup.rotation.copy(
      rotation.set(
        0,
        MathUtils.degToRad(20),
        0,
      ),
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
};
