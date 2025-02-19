import { pipe } from "@core/pipe";
import {
  getRotateNotationDetail,
  RotateTo,
  RubikCubeMoveNotation,
} from "../MoveNotation";
import { RubikCubeFaceName } from "../RubikCube";
import { faceRotation2d } from "./2d/faceRotation";
import { RUBIKC_CUBE_FACE_CUBE_PIECE_MAP } from "./3d/faces";
import { rotatedCubePieceState } from "./3d/rotatedCubeState";
import { cloneCubePieceState, RubikCubePieceState } from "./RubikCubeAnimator";
import { flatMap, zip } from "@core/iterutil/pipe";
import { RubikCubePiece } from "../../RubikCubeModel";
import { rotateByWorldAxis } from "./3d/helper";

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
  direction: RotateTo;

  constructor(
    public satrt: RubikCubePieceState,
    public move: RubikCubeMoveNotation,
  ) {
    const { face, rotateTo } = getRotateNotationDetail(move);
    this.face = face;
    this.direction = rotateTo;
  }

  progress(progress: number) {
    const currentCoords = faceRotation2d(this.direction, progress);
    const clonedCubePieceState = cloneCubePieceState(this.satrt);
    const faceMap = RUBIKC_CUBE_FACE_CUBE_PIECE_MAP[this.face];

    for (
      const [piece, coord] of pipe(
        faceMap.mapping as RubikCubePiece[][],
        zip(currentCoords),
        flatMap(([a, b]) =>
          pipe(
            a,
            zip(b),
          )
        ),
      )
    ) {
      clonedCubePieceState[piece].savePoint.position[faceMap.x.bindTo] =
        faceMap.x.invert ? -coord.x : coord.x;
      clonedCubePieceState[piece].savePoint.position[faceMap.y.bindTo] =
        faceMap.y.invert ? -coord.y : coord.y;

      clonedCubePieceState[piece].savePoint.quaternion = rotateByWorldAxis(
        this.satrt[piece].savePoint.quaternion,
        faceMap.rotateAxis.bindTo,
        faceMap.rotateAxis.invert ? -coord.degree : coord.degree,
      );
    }

    return clonedCubePieceState;
  }
}
