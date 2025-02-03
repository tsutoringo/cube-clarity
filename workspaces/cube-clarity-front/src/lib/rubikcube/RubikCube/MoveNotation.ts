import { Result } from "@result/result";
import { RubikCubeError, RubikCubeResult } from "./Error";

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

export type RubikCubeMoveNotate = typeof RUBIK_CUBE_MOVE_NOTATION[number];

/**
 * スペース区切りで指定された、回転記号を{@linkcode RubikCubeMoveNotate}の配列にして返します。
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
): RubikCubeResult<RubikCubeMoveNotate[]> => {
  const splitedRawMoveNotations = rawMoveNotations.split(" ");
  const moveNotations = [];

  for (const moveNotation of splitedRawMoveNotations) {
    const upperdMoveNotation = moveNotation.toUpperCase();
    if (!RUBIK_CUBE_MOVE_NOTATION.includes(upperdMoveNotation as never)) {
      return Result.err(
        new RubikCubeBadMoveNotationError(moveNotation),
      );
    }

    moveNotations.push(upperdMoveNotation);
  }

  return Result.ok(moveNotations as RubikCubeMoveNotate[]);
};

export class RubikCubeBadMoveNotationError extends RubikCubeError {
  constructor(moveNotation: string) {
    super(`Bad move notation(${moveNotation})`);
  }
}
