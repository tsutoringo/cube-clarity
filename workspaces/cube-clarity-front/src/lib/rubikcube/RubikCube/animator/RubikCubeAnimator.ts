import { MathUtils, Mesh } from "three";
import {
  RUBIK_CUBE_PIECE_NAMES,
  RUBIK_CUBE_PIECES,
  RubikCubeGroup,
  RubikCubePiece,
} from "../../RubikCubeModel";
import { RubikCubeMoveNotation } from "../MoveNotation";
import { MoveNotationTween } from "./MoveNotationTween";
import { rotatedCubePieceState } from "./rotateCubeState";

export type RubikCubePieceState = Record<
  RubikCubePiece,
  {
    mesh: Mesh;
    coord: CubePieceCoordState;
  }
>;

export const generateDefaultRubikCubeStates = (
  rubikcubePieceMeshes: RubikCubeGroup,
) => {
  const state = {} as RubikCubePieceState;

  for (const cubePiece of RUBIK_CUBE_PIECE_NAMES) {
    state[cubePiece] = {
      mesh: rubikcubePieceMeshes.cubePieces[cubePiece],
      coord: {
        degree: {
          x: 0,
          y: 0,
          z: 0
        },
        x: RUBIK_CUBE_PIECES[cubePiece].position[0],
        y: RUBIK_CUBE_PIECES[cubePiece].position[1],
        z: RUBIK_CUBE_PIECES[cubePiece].position[2],
      },
    };
  }

  return state;
};

/**
 * 使い回すのでDeepCloneする。
 * @param pieceState
 * @returns DeepCloneされたCubePieceState
 */
export const cloneCubePieceState = (
  pieceState: RubikCubePieceState,
): RubikCubePieceState => {
  return Object.fromEntries(
    Object.entries(pieceState).map(([key, { mesh, coord }]) => {
      return [
        key,
        {
          mesh,
          coord: {
            x: coord.x,
            y: coord.y,
            z: coord.z,
            degree: { ...coord.degree }
          },
        },
      ];
    }),
  ) as RubikCubePieceState;
};

export type CubePieceCoordState = {
  degree: {
    x: number;
    y: number;
    z: number;
  };
  x: number;
  y: number;
  z: number;
};

export class RubikCubeAnimator {
  static generate(
    rubikcubePieces: RubikCubeGroup,
    moves: RubikCubeMoveNotation[],
  ) {
    const tweens: MoveNotationTween[] = [];

    let currentCubePieceState = generateDefaultRubikCubeStates(rubikcubePieces);

    for (const move of moves) {
      const { rotatedCubePieceState, moveNotationTween } = MoveNotationTween
        .generate(currentCubePieceState, move);

      tweens.push(moveNotationTween);

      currentCubePieceState = rotatedCubePieceState;
    }

    return new RubikCubeAnimator(tweens);
  }

  constructor(
    public tweens: MoveNotationTween[],
  ) {
  }

  patchProgress(progress: number) {
    const tweenPos = Math.floor(progress * this.tweens.length);
    const tweenProgress = (progress - tweenPos / this.tweens.length) * this.tweens.length;
    for (const [ _piece, { coord, mesh } ] of Object.entries(this.tweens[tweenPos].progress(tweenProgress))) {
      mesh.position.set(coord.x, coord.y, coord.z);
      mesh.rotation.set(
        MathUtils.degToRad(coord.degree.x),
        MathUtils.degToRad(coord.degree.y),
        MathUtils.degToRad(coord.degree.z),
      )
    }
  }
}
