import type { RubikCubeMoveNotation } from "@cube-clarity/core";

interface MoveImageList {
  up: RubikCubeMoveNotation[];
  down: RubikCubeMoveNotation[];
  left: RubikCubeMoveNotation[];
  right: RubikCubeMoveNotation[];
  rightTurn: RubikCubeMoveNotation[];
  leftTurn: RubikCubeMoveNotation[];
}
export const moveImageList: MoveImageList = {
  "up": [
    "R",
    "R2",
    "B",
    "B2",
    "L'",
  ],
  "down": [
    "R'",
    "B'",
    "L",
    "L2",
  ],
  "left": [
    "U",
    "U2",
    "D'",
  ],
  "right": [
    "U'",
    "D",
    "D2",
  ],
  "rightTurn": [
    "F",
    "F2",
  ],
  "leftTurn": [
    "F'",
  ],
};
