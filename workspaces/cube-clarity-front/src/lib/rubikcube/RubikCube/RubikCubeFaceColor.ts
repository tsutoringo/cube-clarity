import { Result } from "@result/result";
import {
  DecodeRubikCubeFaceColorError,
  RubikCubeError,
  type RubikCubeResult,
} from "./Error";

export const FACE_COLOR = {
  White: "W",
  Yellow: "Y",
  Green: "G",
  Blue: "B",
  Orange: "O",
  Red: "R",
} as const;

export type RubikCubeFaceColor = typeof FACE_COLOR[keyof typeof FACE_COLOR];

export const rubikCubeFaceColorToHex = (faceColor: RubikCubeFaceColor) => {
  switch (faceColor) {
    case "W":
      return 0xFFFFFF;
    case "Y":
      return 0xFFD500;
    case "G":
      return 0x009B48;
    case "B":
      return 0x0045AD;
    case "O":
      return 0xFF5900;
    case "R":
      return 0xB90000;
  }
};

/**
 * 色に対応した番号を4bitで返します。
 */
export const encodeRubikCubeFaceColor = (color: RubikCubeFaceColor) => {
  switch (color) {
    case "W":
      return 0b0000;
    case "Y":
      return 0b0001;
    case "G":
      return 0b0010;
    case "B":
      return 0b0011;
    case "O":
      return 0b0100;
    case "R":
      return 0b0101;
  }
};

/**
 * {@link encodeRubikCubeFaceColor}で符号化された色を戻す。
 */
export const decodeRubikCubeFaceColor = (
  colorNumber: number,
): RubikCubeResult<RubikCubeFaceColor> => {
  switch (colorNumber) {
    case 0b0000:
      return Result.ok("W");
    case 0b0001:
      return Result.ok("Y");
    case 0b0010:
      return Result.ok("G");
    case 0b0011:
      return Result.ok("B");
    case 0b0100:
      return Result.ok("O");
    case 0b0101:
      return Result.ok("R");
    default:
      return Result.err(new DecodeRubikCubeFaceColorError(colorNumber));
  }
};
