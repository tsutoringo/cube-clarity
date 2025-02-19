/**
 * @module
 * 実際のアニメーションを生成する前にそれぞれの回転記号を適用段階の状態を生成する。
 * 要は複数ある回転記号回したあとのセーブポイントを生成するような物。
 */

import { pipe } from "@core/pipe";
import {
  getRotateNotationDetail,
  RotateTo,
  RubikCubeMoveNotation,
} from "../../MoveNotation";
import { RUBIK_CUBE_FACE_CUBE_PIECE_MAP } from "./faces";
import { cloneCubePieceState, RubikCubePieceState } from "../RubikCubeAnimator";
import { enumerate, flatMap, map } from "@core/iterutil/pipe";
import { RUBIK_CUBE_PIECES } from "../../../RubikCubeModel";
import { rotateByWorldAxis } from "./helper";

export const ROTATION_INFOMATIONS = {
  clockwise: {
    degree: -90,
    mappingTo: [
      [[2, 0], [1, 0], [0, 0]],
      [[2, 1], [1, 1], [0, 1]],
      [[2, 2], [1, 2], [0, 2]],
    ],
  },
  counterclockwise: {
    degree: 90,
    mappingTo: [
      [[0, 2], [1, 2], [2, 2]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 0], [1, 0], [2, 0]],
    ],
  },
  diagonal: {
    degree: 180,
    mappingTo: [
      [[2, 2], [2, 1], [2, 0]],
      [[1, 2], [1, 1], [1, 0]],
      [[0, 2], [0, 1], [0, 0]],
    ],
  },
} as const satisfies Record<RotateTo, {
  degree: number;
  mappingTo: [
    [[number, number], [number, number], [number, number]],
    [[number, number], [number, number], [number, number]],
    [[number, number], [number, number], [number, number]],
  ];
}>;

/**
 * 回転されたCubeStateを返します。
 */
export const rotatedCubePieceState = (
  beforeCubePieceSatate: RubikCubePieceState,
  moveNotation: RubikCubeMoveNotation,
) => {
  const clonedBefore = cloneCubePieceState(beforeCubePieceSatate);
  const after = cloneCubePieceState(beforeCubePieceSatate);
  const { face, rotateTo } = getRotateNotationDetail(moveNotation);

  const { degree, mappingTo } = ROTATION_INFOMATIONS[rotateTo];
  const { mapping, rotateAxis } = RUBIK_CUBE_FACE_CUBE_PIECE_MAP[face];

  // 頑張って読んで^^
  for (
    const [toI, toJ, [fromI, fromJ]] of pipe(
      mappingTo as [number, number][][],
      enumerate(),
      flatMap(([i, row]) =>
        pipe(
          row,
          enumerate(),
          map(([j, val]) =>
            [i, j, val] satisfies [number, number, [number, number]]
          ),
        )
      ),
    )
  ) {
    const to = mapping[toI][toJ];
    after[to] = clonedBefore[mapping[fromI][fromJ]];

    after[to].savePoint.quaternion = rotateByWorldAxis(
      clonedBefore[mapping[fromI][fromJ]].savePoint.quaternion,
      rotateAxis.bindTo,
      rotateAxis.invert ? -degree : degree,
    );

    after[to].savePoint.position.set(
      RUBIK_CUBE_PIECES[to].position[0],
      RUBIK_CUBE_PIECES[to].position[1],
      RUBIK_CUBE_PIECES[to].position[2],
    );
  }

  return after;
};
