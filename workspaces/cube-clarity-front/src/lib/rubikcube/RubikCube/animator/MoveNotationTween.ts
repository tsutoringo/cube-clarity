import { pipe } from '@core/pipe';
import { getRotateNotationDetail, RubikCubeMoveNotation } from "../MoveNotation";
import { RubikCubeFaceName } from '../RubikCube';
import { faceRotation2d } from './2d/faceRotation';
import { CalculatedCubeCoordinate2d, RotateDirection } from './2d/mod';
import { RUBIKC_CUBE_FACE_CUBE_PIECE_MAP } from './3d/faces';
import { rotatedCubePieceState } from "./rotateCubeState";
import { cloneCubePieceState, RubikCubePieceState } from "./RubikCubeAnimator";
import { flatMap, map, zip } from '@core/iterutil/pipe';
import { RubikCubePiece } from '../../RubikCubeModel';

export class MoveNotationTween {
  static generate(
    beforeCubePieceStates: RubikCubePieceState,
    move: RubikCubeMoveNotation,
  ) {
    return {
      moveNotationTween: new MoveNotationTween(beforeCubePieceStates, move),
      rotatedCubePieceState: rotatedCubePieceState(beforeCubePieceStates, move),
    };
  }

  face: RubikCubeFaceName;
  direction: RotateDirection;

  constructor(
    public satrt: RubikCubePieceState,
    public move: RubikCubeMoveNotation,
  ) {
    const { face, rotateTo } = getRotateNotationDetail(move);
    this.face = face;
    this.direction = rotateTo === "diagonal"
     ? "clockwise"
     : rotateTo;
  }

  progress(progress: number) {
    const currentCoords = faceRotation2d(this.direction, progress);
    const clonedCubePieceState = cloneCubePieceState(this.satrt);
    const faceMap = RUBIKC_CUBE_FACE_CUBE_PIECE_MAP[this.face];

    for (const [piece, coord] of pipe(
      faceMap.mapping as RubikCubePiece[][],
      zip(currentCoords),
      flatMap(([a, b]) => pipe(
        a,
        zip(b)
      ))
    )) {
      clonedCubePieceState[piece].coord[faceMap.x.bindTo] = faceMap.x.invert ? -coord.x : coord.x;
      clonedCubePieceState[piece].coord[faceMap.y.bindTo] = faceMap.y.invert ? -coord.y : coord.y;
      clonedCubePieceState[piece].coord.degree[faceMap.rotateAxis.bindTo] = clonedCubePieceState[piece].coord.degree[faceMap.rotateAxis.bindTo] + (faceMap.rotateAxis.invert ? -coord.degree : coord.degree);
    }

    return clonedCubePieceState;
  }
}
