import { moveImageList } from "./moveImageList";

// 画像のインポート
import upArrow from "./images/arrows/up_Arrows.svg";
import downArrow from "./images/arrows/down_Arrow.svg";
import leftArrow from "./images/arrows/left_Arrow.svg";
import rightArrow from "./images/arrows/right_Arrow.svg";
import rightCircle from "./images/arrows/right_Circle.svg";
import leftCircle from "./images/arrows/left_Circle.svg";
import type { RubikCubeMoveNotation } from "@lib/rubikcube/RubikCube/MoveNotation";
import { Euler, Vector3 } from "three";

export const createMovePath = (move: RubikCubeMoveNotation) => {
  let imagePath = "";
  const position = new Vector3();
  const rotation = new Euler();
  const size = {
    width: 1,
    height: 1,
  };

  // ここで
  switch (move) {
    case "R":
    case "R'":
    case "R2":
    case "L":
    case "L'":
    case "L2":
    case "U":
    case "U'":
    case "U2":
    case "D":
    case "D'":
    case "D2":
      break;
    case "F":
    case "F'":
    case "F2":
      position.set(0, 0, 1.6);
      size.width = 2.5;
      size.height = 2.5;
      break;
    case "B":
    case "B'":
    case "B2":
  }
  if (moveImageList.up.includes(move)) {
    imagePath = upArrow;
    switch (move) {
      case "R":
        position.set(1, 0, 1);
        break;
      case "R2":
        position.set(1, 0, 1);
        break;
      case "B":
        position.set(1, 0, -1);
        rotation.set(0, Math.PI / 2, 0);
        break;
      case "B2":
        position.set(1, 0, -1);
        rotation.set(0, Math.PI / 2, 0);
        break;
      case "L'":
        position.set(-1, 0, 1);
        break;
    }
  }
  if (moveImageList.down.includes(move)) {
    imagePath = downArrow;
    switch (move) {
      case "R'":
        position.set(1, 0, 1);
        break;
      case "B'":
        position.set(1, 0, -1);
        rotation.set(0, Math.PI / 2, 0);
        break;
      case "L":
        position.set(-1, 0, 1);
        break;
      case "L2":
        position.set(-1, 0, 1);
        break;
    }
  }
  if (moveImageList.left.includes(move)) {
    imagePath = leftArrow;
    switch (move) {
      case "U":
        position.set(0, 1, 1);
        break;
      case "U2":
        position.set(0, 1, 1);
        break;
      case "D'":
        position.set(0, -1, 1);
        break;
    }
  }
  if (moveImageList.right.includes(move)) {
    imagePath = rightArrow;
    switch (move) {
      case "U'":
        position.set(0, 1, 1);
        break;
      case "D":
        position.set(0, -1, 1);
        break;
      case "D2":
        position.set(0, -1, 1);
        break;
    }
  }
  if (moveImageList.leftTurn.includes(move)) {
    imagePath = leftCircle;
  }
  if (moveImageList.rightTurn.includes(move)) {
    imagePath = rightCircle;
  }
  return {
    path: imagePath,
    position,
    rotation,
    size,
  };
};
