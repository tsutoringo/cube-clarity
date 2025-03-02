import { Result } from "@result/result";
import { RubikCubeError, type RubikCubeResult } from "./Error.ts";
import type { RubikCubeFaceName } from "./RubikCube.ts";

export const RUBIK_CUBE_MOVE_NOTATION = [
  "R",
  "R'",
  "R2",
  "L",
  "L'",
  "L2",
  "U",
  "U'",
  "U2",
  "D",
  "D'",
  "D2",
  "F",
  "F'",
  "F2",
  "B",
  "B'",
  "B2",
] as const;

export type RubikCubeMoveNotation = typeof RUBIK_CUBE_MOVE_NOTATION[number];

/**
 * スペース区切りで指定された、回転記号を{@linkcode RubikCubeMoveNotation}の配列にして返します。
 * なお不正な回転記号が指定された場合エラーになるためResult型を返します。
 *
 * Result型についてはここのドキュメントを参照のこと{@see https://jsr.io/@result/result}
 *
 * @example 絶対にエラーにならないとわかってる際
 * ```
 * const moves = parseMoveNotation("D' L U' B2 D' F2 U' R2 D B2 U' L2 D2 F D2 B' L D L R2").unwrap();
 * ```
 *
 * @example <caption>ユーザーの入力などエラーになる可能性のある場合</caption>
 *
 * ```
 * const moves = parseMoveNotation("D' L U' B2 D' F2 U' R2 D B2 U' L2 D2 F D2 B' L D L R2").match(
 *   (moves) => {
 *     // 成功時処理
 *     return moves;
 *   },
 *   (error) => {
 *     // 失敗時処理
 *     return [];
 *   },
 * );
 * ```
 */
export const parseMoveNotation = (
  rawMoveNotations: string,
): RubikCubeResult<RubikCubeMoveNotation[]> => {
  const splitRawMoveNotations = rawMoveNotations.split(" ");
  const moveNotations = [];

  for (const moveNotation of splitRawMoveNotations) {
    const upperMoveNotation = moveNotation.toUpperCase();
    if (!RUBIK_CUBE_MOVE_NOTATION.includes(upperMoveNotation as never)) {
      return Result.err(
        new RubikCubeBadMoveNotationError(moveNotation),
      );
    }

    moveNotations.push(upperMoveNotation);
  }

  return Result.ok(moveNotations as RubikCubeMoveNotation[]);
};

export class RubikCubeBadMoveNotationError extends RubikCubeError {
  constructor(moveNotation: string) {
    super(`Bad move notation(${moveNotation})`);
  }
}

/**
 * どこに回転するか
 */
export type RotateTo = "clockwise" | "counterclockwise" | "diagonal";

/**
 * 回転するときにどのように回転するかを返す。
 * @param moveNotation
 * @returns
 */
export const getRotateNotationDetail = (moveNotation: RubikCubeMoveNotation): {
  rotateTo: RotateTo;
  face: RubikCubeFaceName;
} => {
  switch (moveNotation) {
    case "R":
      return {
        rotateTo: "clockwise",
        face: "R",
      };
    case "R'":
      return {
        rotateTo: "counterclockwise",
        face: "R",
      };
    case "R2":
      return {
        rotateTo: "diagonal",
        face: "R",
      };
    case "L":
      return {
        rotateTo: "clockwise",
        face: "L",
      };
    case "L'":
      return {
        rotateTo: "counterclockwise",
        face: "L",
      };
    case "L2":
      return {
        rotateTo: "diagonal",
        face: "L",
      };
    case "U":
      return {
        rotateTo: "clockwise",
        face: "U",
      };
    case "U'":
      return {
        rotateTo: "counterclockwise",
        face: "U",
      };
    case "U2":
      return {
        rotateTo: "diagonal",
        face: "U",
      };
    case "D":
      return {
        rotateTo: "clockwise",
        face: "D",
      };
    case "D'":
      return {
        rotateTo: "counterclockwise",
        face: "D",
      };
    case "D2":
      return {
        rotateTo: "diagonal",
        face: "D",
      };
    case "F":
      return {
        rotateTo: "clockwise",
        face: "F",
      };
    case "F'":
      return {
        rotateTo: "counterclockwise",
        face: "F",
      };
    case "F2":
      return {
        rotateTo: "diagonal",
        face: "F",
      };
    case "B":
      return {
        rotateTo: "clockwise",
        face: "B",
      };
    case "B'":
      return {
        rotateTo: "counterclockwise",
        face: "B",
      };
    case "B2":
      return {
        rotateTo: "diagonal",
        face: "B",
      };
  }
};
