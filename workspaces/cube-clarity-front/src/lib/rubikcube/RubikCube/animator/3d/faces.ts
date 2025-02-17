import {
  RubikCubeCenterPiece,
  RubikCubeCornerPiece,
  RubikCubeEdgePiece,
} from "../../../RubikCubeModel";
import { RubikCubeFaceName } from "../../RubikCube";

// deno-fmt-ignore
export const RUBIKC_CUBE_FACE_CUBE_PIECE_MAP = {
  U: {
    x: { bindTo: "x", invert: true },
    y: { bindTo: "x", invert: true },
    rotateAxis: { bindTo: "x", invert: true },
    mapping: [
      ["UBL", "UB", "UBR"],
      ["UL",  "U",  "UR" ],
      ["UFL", "UF", "UFR"],
    ]
  },
  D: {
    x: { bindTo: "x", invert: true },
    y: { bindTo: "x", invert: true },
    rotateAxis: { bindTo: "x", invert: true },
    mapping: [
      ["DFL", "DF", "DFR"],
      ["DL",  "D",  "DR" ],
      ["DBL", "DB", "DBR"],
    ]
  },
  F: {
    x: { bindTo: "x", invert: false },
    y: { bindTo: "y", invert: false },
    rotateAxis: { bindTo: "z", invert: false },
    mapping: [
      ["UFL", "UF", "UFR"],
      ["FL",  "F",  "FR" ],
      ["DFL", "DF", "DFR"],
    ]
  },
  B: {
    x: { bindTo: "x", invert: true },
    y: { bindTo: "x", invert: true },
    rotateAxis: { bindTo: "x", invert: true },
    mapping: [
      ["UBR", "UB", "UBL"],
      ["BR",  "B",  "BL" ],
      ["DBR", "DB", "DBL"],
    ]
  },
  L: {
    x: { bindTo: "x", invert: true },
    y: { bindTo: "x", invert: true },
    rotateAxis: { bindTo: "x", invert: true },
    mapping: [
      ["UBL", "UL", "UFL"],
      ["BL",  "L",  "FL" ],
      ["DBL", "DL", "DFL"],
    ]
  },
  R: {
    x: { bindTo: "z", invert: true },
    y: { bindTo: "y", invert: false },
    rotateAxis: { bindTo: "x", invert: false },
    mapping: [
      ["UFR", "UR", "UBR"],
      ["FR",  "R",  "BR" ],
      ["DFR", "DR", "DBR"],
    ]
  },
} as const satisfies Record<RubikCubeFaceName, {
  x: { bindTo: "x" | "y" | "z", invert: boolean },
  y: { bindTo: "x" | "y" | "z", invert: boolean },
  rotateAxis: { bindTo: "x" | "y" | "z", invert: boolean }
  mapping: [
    [RubikCubeCornerPiece, RubikCubeEdgePiece,   RubikCubeCornerPiece],
    [RubikCubeEdgePiece,   RubikCubeCenterPiece, RubikCubeEdgePiece  ],
    [RubikCubeCornerPiece, RubikCubeEdgePiece,   RubikCubeCornerPiece]
  ]
}>;
