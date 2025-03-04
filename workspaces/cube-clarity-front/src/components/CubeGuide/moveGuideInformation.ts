import { moveImageList } from "./moveImageList";

// 画像のインポート
import upArrow from "./images/arrows/up_Arrows.svg?inline";
import downArrow from "./images/arrows/down_Arrow.svg?inline";
import leftArrow from "./images/arrows/left_Arrow.svg?inline";
import rightArrow from "./images/arrows/right_Arrow.svg?inline";
import rightCircle from "./images/arrows/right_Circle.svg?inline";
import leftCircle from "./images/arrows/left_Circle.svg?inline";
import type { RubikCubeMoveNotation } from "@cube-clarity/core";
import { Euler, MathUtils, Texture, TextureLoader, Vector3 } from "three";

const GUIDE_ARROW_TEXTURE_REGISTRY = {
  up:  new TextureLoader().load(upArrow),
  down:  new TextureLoader().load(downArrow),
  left: new TextureLoader().load(leftArrow),
  right: new TextureLoader().load(rightArrow),
  leftTurn: new TextureLoader().load(leftCircle),
  rightTurn: new TextureLoader().load(rightCircle),
} as const;

export const getMoveGuideInformation = (move: RubikCubeMoveNotation) => {
  let texture: Texture | null = null;
  const position = new Vector3();
  const rotation = new Euler();
  const spriteRotation = new Euler();
  const size = {
    width: 1,
    height: 1,
  };

  // ここで
  switch (move) {
    case "R":
      position.set(1, 0, 1.6);
      rotation.set(MathUtils.degToRad(-28), 0, 0);
      break;
    case "R'":
      position.set(1, 0, 1.6);
      rotation.set(MathUtils.degToRad(31), 0, 0);
      break;
    case "R2":
      position.set(1, 0, 1.6);
      rotation.set(MathUtils.degToRad(-36), 0, 0);
      break;
    case "L":
      position.set(-1, 0, 1.6);
      rotation.set(MathUtils.degToRad(31), 0, 0);
      break;
    case "L'":
      position.set(-1, 0, 1.6);
      rotation.set(MathUtils.degToRad(-28), 0, 0);
      break;
    case "L2":
      position.set(-1, 0, 1.6);
      rotation.set(MathUtils.degToRad(36), 0, 0);
      break;
    case "U":
      position.set(0, 1, 1.6);
      rotation.set(0, MathUtils.degToRad(-31), 0);
      break;
    case "U'":
      position.set(0, 1, 1.6);
      rotation.set(0, MathUtils.degToRad(28), 0);
      break;
    case "U2":
      position.set(0, 1, 1.6);
      rotation.set(0, MathUtils.degToRad(-36), 0);
      break;
    case "D":
      position.set(0, -1, 1.6);
      rotation.set(0, MathUtils.degToRad(31), 0);
      break;
    case "D'":
      position.set(0, -1, 1.6);
      rotation.set(0, MathUtils.degToRad(-28), 0);
      break;
    case "D2":
      position.set(0, -1, 1.6);
      rotation.set(0, MathUtils.degToRad(36), 0);
      break;
    case "F":
      position.set(0, 0, 1.6);
      break;
    case "F'":
      position.set(0, 0, 1.6);
      break;
    case "F2":
      position.set(0, 0, 1.6);
      break;

    case "B":
      position.set(1.6, 0, -1);
      rotation.set(0, 0, MathUtils.degToRad(27));
      spriteRotation.set(0, MathUtils.degToRad(90), 0);
      break;
    case "B'":
      position.set(1.6, 0, -1);
      rotation.set(0, 0, MathUtils.degToRad(63));
      spriteRotation.set(0, MathUtils.degToRad(90), 0);
      break;
    case "B2":
      position.set(1.6, 0, -1);
      rotation.set(0, 0, MathUtils.degToRad(36));
      spriteRotation.set(0, MathUtils.degToRad(90), 0);
      break;
  }
  if (moveImageList.up.includes(move)) {
    texture = GUIDE_ARROW_TEXTURE_REGISTRY.up;
    size.width = 1;
    size.height = 2.5;
  }
  if (moveImageList.down.includes(move)) {
    texture = GUIDE_ARROW_TEXTURE_REGISTRY.down;
    size.width = 1;
    size.height = 2.5;
  }
  if (moveImageList.left.includes(move)) {
    texture = GUIDE_ARROW_TEXTURE_REGISTRY.left;
    size.width = 2.5;
    size.height = 1;
  }
  if (moveImageList.right.includes(move)) {
    texture = GUIDE_ARROW_TEXTURE_REGISTRY.right;
    size.width = 2.5;
    size.height = 1;
  }
  if (moveImageList.leftTurn.includes(move)) {
    texture = GUIDE_ARROW_TEXTURE_REGISTRY.leftTurn;
    size.width = 2.5;
    size.height = 2.5;
  }
  if (moveImageList.rightTurn.includes(move)) {
    texture = GUIDE_ARROW_TEXTURE_REGISTRY.rightTurn;
    size.width = 2.5;
    size.height = 2.5;
  }
  const is180Rotate = move.endsWith("2");
  return {
    texture,
    position,
    rotation,
    size,
    spriteRotation,
    is180Rotate,
  };
};
