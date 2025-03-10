import type { RubikCubeMoveNotation } from "@cube-clarity/core";

interface MoveInvertResult {
  moves: RubikCubeMoveNotation[];
  progress: number;
}
/**
 * 回転記号を反転する関数
 */
export const moveInvert = (move: RubikCubeMoveNotation): MoveInvertResult => {
  const moveList = [
    "R",
    "L",
    "U",
    "B",
    "F",
    "D",
  ];

  if (moveList.includes(move)) {
    return {
      moves: [`${move}'` as RubikCubeMoveNotation],
      progress: 0.7,
    };
  }

  if (move.includes("'")) {
    return {
      moves: [move.replace("'", "") as RubikCubeMoveNotation],
      progress: 0.7,
    };
  }

  if (move.includes("2")) {
    const afterMove = move.replace("2", "");
    const reverseMove = `${afterMove}'` as RubikCubeMoveNotation;
    return {
      moves: [reverseMove, reverseMove],
      progress: 0.8,
    };
  }
  return {
    moves: [],
    progress: 0,
  };
};
