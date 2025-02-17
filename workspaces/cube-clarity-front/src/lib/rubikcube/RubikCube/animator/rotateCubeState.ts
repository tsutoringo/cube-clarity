import { pipe } from "@core/pipe";
import {
  getRotateNotationDetail,
  RotateTo,
  RubikCubeMoveNotation,
} from "../MoveNotation";
import { RubikCubeFaceName } from "../RubikCube";
import { RUBIKC_CUBE_FACE_CUBE_PIECE_MAP } from "./3d/faces";
import { cloneCubePieceState, RubikCubePieceState } from "./RubikCubeAnimator";
import { enumerate, flatMap, map, zip } from "@core/iterutil/pipe";
import { MathUtils } from "three";
import { RUBIK_CUBE_PIECES } from "../../RubikCubeModel";

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
      [[1, 0], [1, 1], [1, 2]],
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
  const { mapping, rotateAxis } = RUBIKC_CUBE_FACE_CUBE_PIECE_MAP[face];

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

    after[to].coord.degree[rotateAxis.bindTo] = MathUtils.euclideanModulo(
      (rotateAxis.invert ? -degree : degree) + after[to].coord.degree[rotateAxis.bindTo],
      360,
    );

    after[to].coord.x = RUBIK_CUBE_PIECES[to].position[0];
    after[to].coord.y = RUBIK_CUBE_PIECES[to].position[1];
    after[to].coord.z = RUBIK_CUBE_PIECES[to].position[2];
  }

  return after;
};
