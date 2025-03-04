import { moveImageList } from "./moveImageList";

// 画像のインポート
import upArrow from "./images/arrows/up_Arrows.svg";
import downArrow from "./images/arrows/down_Arrow.svg";
import leftArrow from "./images/arrows/left_Arrow.svg";
import rightArrow from "./images/arrows/right_Arrow.svg";
import rightCircle from "./images/arrows/right_Circle.svg";
import leftCircle from "./images/arrows/left_Circle.svg";
import type { RubikCubeMoveNotation } from "@cube-clarity/core";
import { Euler, MathUtils, Vector3 } from "three";

export const createMovePath = (move: RubikCubeMoveNotation) => {
  let imagePath = "";
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
    imagePath = upArrow;
    size.width = 1;
    size.height = 2.5;
  }
  if (moveImageList.down.includes(move)) {
    imagePath = downArrow;
    size.width = 1;
    size.height = 2.5;
  }
  if (moveImageList.left.includes(move)) {
    imagePath = leftArrow;
    size.width = 2.5;
    size.height = 1;
  }
  if (moveImageList.right.includes(move)) {
    imagePath = rightArrow;
    size.width = 2.5;
    size.height = 1;
  }
  if (moveImageList.leftTurn.includes(move)) {
    imagePath = leftCircle;
    size.width = 2.5;
    size.height = 2.5;
  }
  if (moveImageList.rightTurn.includes(move)) {
    imagePath = rightCircle;
    size.width = 2.5;
    size.height = 2.5;
  }
  const is180Rotate = move.endsWith("2");
  return {
    path: imagePath,
    position,
    rotation,
    size,
    spriteRotation,
    is180Rotate,
  };
};