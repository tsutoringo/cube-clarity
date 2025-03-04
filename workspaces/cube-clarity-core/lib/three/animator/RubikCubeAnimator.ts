import { type Mesh, Quaternion, Vector3 } from "three";
import {
  RUBIK_CUBE_PIECE_NAMES,
  RUBIK_CUBE_PIECES,
  type RubikCubeGroup,
  type RubikCubePiece,
} from "../RubikCubeGroup.ts";
import type { RubikCubeMoveNotation } from "../../rubikcube/mod.ts";
import { MoveNotationTween } from "./MoveNotationTween.ts";

export type RubikCubePieceState = Record<
  RubikCubePiece,
  {
    mesh: Mesh;
    savePoint: CubePieceCoordState;
  }
>;

export const generateDefaultRubikCubeStates = (
  rubikcubePieceMeshes: RubikCubeGroup,
) => {
  const state = {} as RubikCubePieceState;

  for (const cubePiece of RUBIK_CUBE_PIECE_NAMES) {
    state[cubePiece] = {
      mesh: rubikcubePieceMeshes.cubePieces[cubePiece],
      savePoint: {
        quaternion: new Quaternion(),
        position: new Vector3(
          RUBIK_CUBE_PIECES[cubePiece].position[0],
          RUBIK_CUBE_PIECES[cubePiece].position[1],
          RUBIK_CUBE_PIECES[cubePiece].position[2],
        ),
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
    Object.entries(pieceState).map(([key, { mesh, savePoint }]) => {
      return [
        key,
        {
          mesh,
          savePoint: {
            quaternion: savePoint.quaternion.clone(),
            position: savePoint.position.clone(),
          },
        },
      ];
    }),
  ) as RubikCubePieceState;
};

export type CubePieceCoordState = {
  quaternion: Quaternion;
  position: Vector3;
};

export class RubikCubeAnimator {
  static generate(
    rubikCubePieces: RubikCubeGroup,
    moves: RubikCubeMoveNotation[],
  ) {
    const tweens: MoveNotationTween[] = [];

    let currentCubePieceState = generateDefaultRubikCubeStates(rubikCubePieces);

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
    if (this.tweens.length === 0) return 0;

    const tweenPos = progress === 1
      ? this.tweens.length - 1
      : Math.floor(progress * this.tweens.length);

    const tweenProgress = progress === 1
      ? 1
      : (progress - tweenPos / this.tweens.length) * this.tweens.length;

    for (
      const [_piece, { savePoint, mesh }] of Object.entries(
        this.tweens[tweenPos].progress(tweenProgress),
      )
    ) {
      mesh.position.copy(savePoint.position);
      mesh.quaternion.copy(savePoint.quaternion);
    }
  }
}
