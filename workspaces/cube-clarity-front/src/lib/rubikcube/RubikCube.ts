
export type RubikCubeFaceName = "U" | "D" | "F" | "B" | "L" | "R";

export const FACE_COLOR = {
  White: "W",
  Yellow: "Y",
  Green: "G",
  Blue: "B",
  Orange: "O",
  Red: "R"
} as const;
export type RubikCubeFaceColor = typeof FACE_COLOR[keyof typeof FACE_COLOR];

export const rubikCubeFaceColorToHex = (faceColor: RubikCubeFaceColor) => {
  switch (faceColor) {
    case 'W': return 0xFFFFFF;
    case 'Y': return 0xFFD500;
    case 'G': return 0x009B48;
    case 'B': return 0x0045AD;
    case 'O': return 0xFF5900;
    case 'R': return 0xB90000;
  }
}

/**
 * ```plane
 *   x →
 * y ┌──┬──┬──┐
 * ↓ │00│01│02│
 *   ├──┼──┼──┤
 *   │10│11│12│
 *   ├──┼──┼──┤
 *   │20│21│22│
 *   └──┴──┴──┘
 * ```
 */
export type RubikCubeFace = [
  [RubikCubeFaceColor, RubikCubeFaceColor, RubikCubeFaceColor],
  [RubikCubeFaceColor, RubikCubeFaceColor, RubikCubeFaceColor],
  [RubikCubeFaceColor, RubikCubeFaceColor, RubikCubeFaceColor],
];

export type RubikCubeFaceYIndex = 0 | 1 | 2;
export type RubikCubeFaceXIndex = 0 | 1 | 2;

/**
 * ```plane
 *          ┌──┬──┬──┐
 *          │00│01│02│
 *          ├──┼──┼──┤
 *          │10│ U│12│
 *          ├──┼──┼──┤
 *          │20│21│22│
 * ┌──┬──┬──┼──┼──┼──┼──┬──┬──┬──┬──┬──┐
 * │00│01│02│00│01│02│00│01│02│00│01│02│
 * ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤
 * │10│ L│12│10│ F│12│10│ R│12│10│ B│12│
 * ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤
 * │20│21│22│20│21│22│20│21│22│20│21│22│
 * └──┴──┴──┼──┼──┼──┼──┴──┴──┴──┴──┴──┘
 *          │00│01│02│
 *          ├──┼──┼──┤
 *          │10│ D│12│
 *          ├──┼──┼──┤
 *          │20│21│22│
 *          └──┴──┴──┘
 * ```
 */
export type CubeState = Record<RubikCubeFaceName, RubikCubeFace>;

export const RUBIK_CUBE_MOVES = [
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
export type RubikCubeMove = typeof RUBIK_CUBE_MOVES[number];

/**
 * RubikCube class.
 *
 * @exmaple
 * ```
 * const rubikCube = RubikCube.default();
 * ```
 */
export class RubikCube {
  /**
   * すべて揃えられた状態のRubikCubeを返します。
   * @returns すべて揃えられた状態のルービックキューブ
   */
  static default() {
    const cubeSatate = {
      U: Array(3).fill(null).map(() =>
        ["W", "W", "W"] satisfies RubikCubeFace[number]
      ),
      D: Array(3).fill(null).map(() =>
        ["Y", "Y", "Y"] satisfies RubikCubeFace[number]
      ),
      F: Array(3).fill(null).map(() =>
        ["G", "G", "G"] satisfies RubikCubeFace[number]
      ),
      B: Array(3).fill(null).map(() =>
        ["B", "B", "B"] satisfies RubikCubeFace[number]
      ),
      L: Array(3).fill(null).map(() =>
        ["O", "O", "O"] satisfies RubikCubeFace[number]
      ),
      R: Array(3).fill(null).map(() =>
        ["R", "R", "R"] satisfies RubikCubeFace[number]
      ),
    } as CubeState;

    return new RubikCube(cubeSatate);
  }

  constructor(
    public cubeState: CubeState,
  ) {
  }

  /**
   * Deep Cloneされた{@linkcode RubikCube}を返します
   * @returns
   */
  clone(): RubikCube {
    // deno-fmt-ignore
    const newCubeState: CubeState = {
      U: [
        [
          this.cubeState.U[0][0], this.cubeState.U[0][1], this.cubeState.U[0][2],
        ], [
          this.cubeState.U[1][0], this.cubeState.U[1][1], this.cubeState.U[1][2],
        ], [
          this.cubeState.U[2][0], this.cubeState.U[2][1], this.cubeState.U[2][2],
        ],
      ],
      D: [
        [
          this.cubeState.D[0][0], this.cubeState.D[0][1], this.cubeState.D[0][2],
        ], [
          this.cubeState.D[1][0], this.cubeState.D[1][1], this.cubeState.D[1][2],
        ], [
          this.cubeState.D[2][0], this.cubeState.D[2][1], this.cubeState.D[2][2],
        ],
      ],
      F: [
        [
          this.cubeState.F[0][0], this.cubeState.F[0][1], this.cubeState.F[0][2],
        ], [
          this.cubeState.F[1][0], this.cubeState.F[1][1], this.cubeState.F[1][2],
        ], [
          this.cubeState.F[2][0], this.cubeState.F[2][1], this.cubeState.F[2][2],
        ],
      ],
      B: [
        [
          this.cubeState.B[0][0], this.cubeState.B[0][1], this.cubeState.B[0][2],
        ], [
          this.cubeState.B[1][0], this.cubeState.B[1][1], this.cubeState.B[1][2],
        ], [
          this.cubeState.B[2][0], this.cubeState.B[2][1], this.cubeState.B[2][2],
        ],
      ],
      L: [
        [
          this.cubeState.L[0][0], this.cubeState.L[0][1], this.cubeState.L[0][2],
        ], [
          this.cubeState.L[1][0], this.cubeState.L[1][1], this.cubeState.L[1][2],
        ], [
          this.cubeState.L[2][0], this.cubeState.L[2][1], this.cubeState.L[2][2],
        ],
      ],
      R: [
        [
          this.cubeState.R[0][0], this.cubeState.R[0][1], this.cubeState.R[0][2],
        ], [
          this.cubeState.R[1][0], this.cubeState.R[1][1], this.cubeState.R[1][2],
        ], [
          this.cubeState.R[2][0], this.cubeState.R[2][1], this.cubeState.R[2][2],
        ],
      ],
    };

    return new RubikCube(newCubeState);
  }

  /**
   * 一つの回転記号一回の回転
   * @param move ルービックキューブの回転記号
   * @returns 引数moveで指定された回転記号に基づき回転されたDeepCloneされた{@linkcode RubikCube}
   */
  rotateCubeOnce(move: RubikCubeMove) {
    const clonedCube = this.clone();

    // deno-fmt-ignore
    switch (move) {
      case "R":
        [clonedCube.cubeState.U[0][2], clonedCube.cubeState.U[1][2], clonedCube.cubeState.U[2][2]] = [this.cubeState.F[0][2], this.cubeState.F[1][2], this.cubeState.F[2][2]];
        [clonedCube.cubeState.F[0][2], clonedCube.cubeState.F[1][2], clonedCube.cubeState.F[2][2]] = [this.cubeState.D[0][2], this.cubeState.D[1][2], this.cubeState.D[2][2]];
        [clonedCube.cubeState.D[0][2], clonedCube.cubeState.D[1][2], clonedCube.cubeState.D[2][2]] = [this.cubeState.B[2][0], this.cubeState.B[1][0], this.cubeState.B[0][0]];
        [clonedCube.cubeState.B[2][0], clonedCube.cubeState.B[1][0], clonedCube.cubeState.B[0][0]] = [this.cubeState.U[0][2], this.cubeState.U[1][2], this.cubeState.U[2][2]];
  
        [clonedCube.cubeState.R[0][0], clonedCube.cubeState.R[0][1], clonedCube.cubeState.R[0][2]] = [this.cubeState.R[2][0], this.cubeState.R[1][0], this.cubeState.R[0][0]];
        [clonedCube.cubeState.R[1][0], clonedCube.cubeState.R[1][2]] = [this.cubeState.R[2][1], this.cubeState.R[0][1]];
        [clonedCube.cubeState.R[2][0], clonedCube.cubeState.R[2][1], clonedCube.cubeState.R[2][2]] = [this.cubeState.R[2][2], this.cubeState.R[1][2], this.cubeState.R[0][2]];
        break;
      case "R'":
        [clonedCube.cubeState.U[0][2], clonedCube.cubeState.U[1][2], clonedCube.cubeState.U[2][2]] = [this.cubeState.B[2][0], this.cubeState.B[1][0], this.cubeState.B[0][0]];
        [clonedCube.cubeState.F[0][2], clonedCube.cubeState.F[1][2], clonedCube.cubeState.F[2][2]] = [this.cubeState.U[0][2], this.cubeState.U[1][2], this.cubeState.U[2][2]];
        [clonedCube.cubeState.D[0][2], clonedCube.cubeState.D[1][2], clonedCube.cubeState.D[2][2]] = [this.cubeState.F[0][2], this.cubeState.F[1][2], this.cubeState.F[2][2]];
        [clonedCube.cubeState.B[2][0], clonedCube.cubeState.B[1][0], clonedCube.cubeState.B[0][0]] = [this.cubeState.D[0][2], this.cubeState.D[1][2], this.cubeState.D[2][2]];
  
        [clonedCube.cubeState.R[0][0], clonedCube.cubeState.R[0][1], clonedCube.cubeState.R[0][2]] = [this.cubeState.R[0][2], this.cubeState.R[1][2], this.cubeState.R[2][2]];
        [clonedCube.cubeState.R[1][0], clonedCube.cubeState.R[1][2]] = [this.cubeState.R[0][1], this.cubeState.R[2][1]];
        [clonedCube.cubeState.R[2][0], clonedCube.cubeState.R[2][1], clonedCube.cubeState.R[2][2]] = [this.cubeState.R[0][0], this.cubeState.R[1][0], this.cubeState.R[2][0]];
        break;
      case "R2":
        [clonedCube.cubeState.U[0][2], clonedCube.cubeState.U[1][2], clonedCube.cubeState.U[2][2]] = [this.cubeState.D[0][2], this.cubeState.D[1][2], this.cubeState.D[2][2]];
        [clonedCube.cubeState.F[0][2], clonedCube.cubeState.F[1][2], clonedCube.cubeState.F[2][2]] = [this.cubeState.B[2][0], this.cubeState.B[1][0], this.cubeState.B[0][0]];
        [clonedCube.cubeState.D[0][2], clonedCube.cubeState.D[1][2], clonedCube.cubeState.D[2][2]] = [this.cubeState.U[0][2], this.cubeState.U[1][2], this.cubeState.U[2][2]];
        [clonedCube.cubeState.B[2][0], clonedCube.cubeState.B[1][0], clonedCube.cubeState.B[0][0]] = [this.cubeState.F[0][2], this.cubeState.F[1][2], this.cubeState.F[2][2]];
        
        [clonedCube.cubeState.R[0][0], clonedCube.cubeState.R[0][1], clonedCube.cubeState.R[0][2]] = [this.cubeState.R[2][2], this.cubeState.R[2][1], this.cubeState.R[2][0]];
        [clonedCube.cubeState.R[1][0], clonedCube.cubeState.R[1][2]] = [this.cubeState.R[1][2], this.cubeState.R[1][0]];
        [clonedCube.cubeState.R[2][0], clonedCube.cubeState.R[2][1], clonedCube.cubeState.R[2][2]] = [this.cubeState.R[0][2], this.cubeState.R[0][1], this.cubeState.R[0][0]];
        break;
  
      case "L":
        [clonedCube.cubeState.U[0][0], clonedCube.cubeState.U[1][0], clonedCube.cubeState.U[2][0]] = [this.cubeState.B[2][2], this.cubeState.B[1][2], this.cubeState.B[0][2]];
        [clonedCube.cubeState.B[2][2], clonedCube.cubeState.B[1][2], clonedCube.cubeState.B[0][2]] = [this.cubeState.D[0][0], this.cubeState.D[1][0], this.cubeState.D[2][0]];
        [clonedCube.cubeState.D[0][0], clonedCube.cubeState.D[1][0], clonedCube.cubeState.D[2][0]] = [this.cubeState.F[0][0], this.cubeState.F[1][0], this.cubeState.F[2][0]];
        [clonedCube.cubeState.F[0][0], clonedCube.cubeState.F[1][0], clonedCube.cubeState.F[2][0]] = [this.cubeState.U[0][0], this.cubeState.U[1][0], this.cubeState.U[2][0]];
  
        [clonedCube.cubeState.L[0][0], clonedCube.cubeState.L[0][1], clonedCube.cubeState.L[0][2]] = [this.cubeState.L[2][0], this.cubeState.L[1][0], this.cubeState.L[0][0]];
        [clonedCube.cubeState.L[1][0], clonedCube.cubeState.L[1][2]] = [this.cubeState.L[2][1], this.cubeState.L[0][1]];
        [clonedCube.cubeState.L[2][0], clonedCube.cubeState.L[2][1], clonedCube.cubeState.L[2][2]] = [this.cubeState.L[2][2], this.cubeState.L[1][2], this.cubeState.L[0][2]];
        break;
      case "L'":
        [clonedCube.cubeState.U[0][0], clonedCube.cubeState.U[1][0], clonedCube.cubeState.U[2][0]] = [this.cubeState.F[0][0], this.cubeState.F[1][0], this.cubeState.F[2][0]];
        [clonedCube.cubeState.B[2][2], clonedCube.cubeState.B[1][2], clonedCube.cubeState.B[0][2]] = [this.cubeState.U[0][0], this.cubeState.U[1][0], this.cubeState.U[2][0]];
        [clonedCube.cubeState.D[0][0], clonedCube.cubeState.D[1][0], clonedCube.cubeState.D[2][0]] = [this.cubeState.B[2][2], this.cubeState.B[1][2], this.cubeState.B[0][2]];
        [clonedCube.cubeState.F[0][0], clonedCube.cubeState.F[1][0], clonedCube.cubeState.F[2][0]] = [this.cubeState.D[0][0], this.cubeState.D[1][0], this.cubeState.D[2][0]];
  
        [clonedCube.cubeState.L[0][0], clonedCube.cubeState.L[0][1], clonedCube.cubeState.L[0][2]] = [this.cubeState.L[0][2], this.cubeState.L[1][2], this.cubeState.L[2][2]];
        [clonedCube.cubeState.L[1][0], clonedCube.cubeState.L[1][2]] = [this.cubeState.L[0][1], this.cubeState.L[2][1]];
        [clonedCube.cubeState.L[2][0], clonedCube.cubeState.L[2][1], clonedCube.cubeState.L[2][2]] = [this.cubeState.L[0][0], this.cubeState.L[1][0], this.cubeState.L[2][0]];
        break;
      case "L2":
        [clonedCube.cubeState.U[0][0], clonedCube.cubeState.U[1][0], clonedCube.cubeState.U[2][0]] = [this.cubeState.D[0][0], this.cubeState.D[1][0], this.cubeState.D[2][0]];
        [clonedCube.cubeState.B[2][2], clonedCube.cubeState.B[1][2], clonedCube.cubeState.B[0][2]] = [this.cubeState.F[0][0], this.cubeState.F[1][0], this.cubeState.F[2][0]];
        [clonedCube.cubeState.D[0][0], clonedCube.cubeState.D[1][0], clonedCube.cubeState.D[2][0]] = [this.cubeState.U[0][0], this.cubeState.U[1][0], this.cubeState.U[2][0]];
        [clonedCube.cubeState.F[0][0], clonedCube.cubeState.F[1][0], clonedCube.cubeState.F[2][0]] = [this.cubeState.B[2][2], this.cubeState.B[1][2], this.cubeState.B[0][2]];
        
        [clonedCube.cubeState.L[0][0], clonedCube.cubeState.L[0][1], clonedCube.cubeState.L[0][2]] = [this.cubeState.L[2][2], this.cubeState.L[2][1], this.cubeState.L[2][0]];
        [clonedCube.cubeState.L[1][0], clonedCube.cubeState.L[1][2]] = [this.cubeState.L[1][2], this.cubeState.L[1][0]];
        [clonedCube.cubeState.L[2][0], clonedCube.cubeState.L[2][1], clonedCube.cubeState.L[2][2]] = [this.cubeState.L[0][2], this.cubeState.L[0][1], this.cubeState.L[0][0]];
        break;
  
      case "U":
        [clonedCube.cubeState.F[0], clonedCube.cubeState.R[0], clonedCube.cubeState.B[0], clonedCube.cubeState.L[0]] = [this.cubeState.R[0], this.cubeState.B[0], this.cubeState.L[0], this.cubeState.F[0]];
        [clonedCube.cubeState.U[0][0], clonedCube.cubeState.U[0][1], clonedCube.cubeState.U[0][2]] = [this.cubeState.U[2][0], this.cubeState.U[1][0], this.cubeState.U[0][0]];
        [clonedCube.cubeState.U[1][0], clonedCube.cubeState.U[1][2]] = [this.cubeState.U[2][1], this.cubeState.U[0][1]];
        [clonedCube.cubeState.U[2][0], clonedCube.cubeState.U[2][1], clonedCube.cubeState.U[2][2]] = [this.cubeState.U[2][2], this.cubeState.U[1][2], this.cubeState.U[0][2]];
        break;
      case "U'":
        [clonedCube.cubeState.F[0], clonedCube.cubeState.R[0], clonedCube.cubeState.B[0], clonedCube.cubeState.L[0]] = [this.cubeState.L[0], this.cubeState.F[0], this.cubeState.R[0], this.cubeState.B[0]];
        [clonedCube.cubeState.U[0][0], clonedCube.cubeState.U[0][1], clonedCube.cubeState.U[0][2]] = [this.cubeState.U[0][2], this.cubeState.U[1][2], this.cubeState.U[2][2]];
        [clonedCube.cubeState.U[1][0], clonedCube.cubeState.U[1][2]] = [this.cubeState.U[0][1], this.cubeState.U[2][1]];
        [clonedCube.cubeState.U[2][0], clonedCube.cubeState.U[2][1], clonedCube.cubeState.U[2][2]] = [this.cubeState.U[0][0], this.cubeState.U[1][0], this.cubeState.U[2][0]];
        break;
      case "U2":
        [clonedCube.cubeState.F[0], clonedCube.cubeState.R[0], clonedCube.cubeState.B[0], clonedCube.cubeState.L[0]] = [this.cubeState.B[0], this.cubeState.L[0], this.cubeState.F[0], this.cubeState.R[0]];
        [clonedCube.cubeState.U[0][0], clonedCube.cubeState.U[0][1], clonedCube.cubeState.U[0][2]] = [this.cubeState.U[2][2], this.cubeState.U[2][1], this.cubeState.U[2][0]];
        [clonedCube.cubeState.U[1][0], clonedCube.cubeState.U[1][2]] = [this.cubeState.U[1][2], this.cubeState.U[1][0]];
        [clonedCube.cubeState.U[2][0], clonedCube.cubeState.U[2][1], clonedCube.cubeState.U[2][2]] = [this.cubeState.U[0][2], this.cubeState.U[0][1], this.cubeState.U[0][0]];
        break;
  
      case "D":
        [clonedCube.cubeState.F[2], clonedCube.cubeState.L[2], clonedCube.cubeState.B[2], clonedCube.cubeState.R[2]] = [this.cubeState.L[2], this.cubeState.B[2], this.cubeState.R[2], this.cubeState.F[2]];
  
        [clonedCube.cubeState.D[0][0], clonedCube.cubeState.D[0][1], clonedCube.cubeState.D[0][2]] = [this.cubeState.D[2][0], this.cubeState.D[1][0], this.cubeState.D[0][0]];
        [clonedCube.cubeState.D[1][0], clonedCube.cubeState.D[1][2]] = [this.cubeState.D[2][1], this.cubeState.D[0][1]];
        [clonedCube.cubeState.D[2][0], clonedCube.cubeState.D[2][1], clonedCube.cubeState.D[2][2]] = [this.cubeState.D[2][2], this.cubeState.D[1][2], this.cubeState.D[0][2]];
        break;
      case "D'":
        [clonedCube.cubeState.F[2], clonedCube.cubeState.L[2], clonedCube.cubeState.B[2], clonedCube.cubeState.R[2]] = [this.cubeState.R[2], this.cubeState.F[2], this.cubeState.L[2], this.cubeState.B[2]];
  
        [clonedCube.cubeState.D[0][0], clonedCube.cubeState.D[0][1], clonedCube.cubeState.D[0][2]] = [this.cubeState.D[0][2], this.cubeState.D[1][2], this.cubeState.D[2][2]];
        [clonedCube.cubeState.D[1][0], clonedCube.cubeState.D[1][2]] = [this.cubeState.D[0][1], this.cubeState.D[2][1]];
        [clonedCube.cubeState.D[2][0], clonedCube.cubeState.D[2][1], clonedCube.cubeState.D[2][2]] = [this.cubeState.D[0][0], this.cubeState.D[1][0], this.cubeState.D[2][0]];
        break;
      case "D2":
        [clonedCube.cubeState.F[2], clonedCube.cubeState.L[2], clonedCube.cubeState.B[2], clonedCube.cubeState.R[2]] = [this.cubeState.B[2], this.cubeState.R[2], this.cubeState.F[2], this.cubeState.L[2]];
        
        [clonedCube.cubeState.D[0][0], clonedCube.cubeState.D[0][1], clonedCube.cubeState.D[0][2]] = [this.cubeState.D[2][2], this.cubeState.D[2][1], this.cubeState.D[2][0]];
        [clonedCube.cubeState.D[1][0], clonedCube.cubeState.D[1][2]] = [this.cubeState.D[1][2], this.cubeState.D[1][0]];
        [clonedCube.cubeState.D[2][0], clonedCube.cubeState.D[2][1], clonedCube.cubeState.D[2][2]] = [this.cubeState.D[0][2], this.cubeState.D[0][1], this.cubeState.D[0][0]];
        break;
  
      case "F":
        [clonedCube.cubeState.U[2][2], clonedCube.cubeState.U[2][1], clonedCube.cubeState.U[2][0]] = [this.cubeState.L[0][2], this.cubeState.L[1][2], this.cubeState.L[2][2]];
        [clonedCube.cubeState.R[0][0], clonedCube.cubeState.R[1][0], clonedCube.cubeState.R[2][0]] = [this.cubeState.U[2][0], this.cubeState.U[2][1], this.cubeState.U[2][2]];
        [clonedCube.cubeState.D[0][0], clonedCube.cubeState.D[0][1], clonedCube.cubeState.D[0][2]] = [this.cubeState.R[2][0], this.cubeState.R[1][0], this.cubeState.R[0][0]];
        [clonedCube.cubeState.L[2][2], clonedCube.cubeState.L[1][2], clonedCube.cubeState.L[0][2]] = [this.cubeState.D[0][2], this.cubeState.D[0][1], this.cubeState.D[0][0]];
  
        [clonedCube.cubeState.F[0][0], clonedCube.cubeState.F[0][1], clonedCube.cubeState.F[0][2]] = [this.cubeState.F[2][0], this.cubeState.F[1][0], this.cubeState.F[0][0]];
        [clonedCube.cubeState.F[1][0], clonedCube.cubeState.F[1][2]] = [this.cubeState.F[2][1], this.cubeState.F[0][1]];
        [clonedCube.cubeState.F[2][0], clonedCube.cubeState.F[2][1], clonedCube.cubeState.F[2][2]] = [this.cubeState.F[2][2], this.cubeState.F[1][2], this.cubeState.F[0][2]];
  
        break;
      case "F'":
        [clonedCube.cubeState.U[2][2], clonedCube.cubeState.U[2][1], clonedCube.cubeState.U[2][0]] = [this.cubeState.R[2][0], this.cubeState.R[1][0], this.cubeState.R[0][0]];
        [clonedCube.cubeState.R[0][0], clonedCube.cubeState.R[1][0], clonedCube.cubeState.R[2][0]] = [this.cubeState.D[0][2], this.cubeState.D[0][1], this.cubeState.D[0][0]];
        [clonedCube.cubeState.D[0][0], clonedCube.cubeState.D[0][1], clonedCube.cubeState.D[0][2]] = [this.cubeState.L[0][2], this.cubeState.L[1][2], this.cubeState.L[2][2]];
        [clonedCube.cubeState.L[2][2], clonedCube.cubeState.L[1][2], clonedCube.cubeState.L[0][2]] = [this.cubeState.U[2][0], this.cubeState.U[2][1], this.cubeState.U[2][2]];
  
        [clonedCube.cubeState.F[0][0], clonedCube.cubeState.F[0][1], clonedCube.cubeState.F[0][2]] = [this.cubeState.F[0][2], this.cubeState.F[1][2], this.cubeState.F[2][2]];
        [clonedCube.cubeState.F[1][0], clonedCube.cubeState.F[1][2]] = [this.cubeState.F[0][1], this.cubeState.F[2][1]];
        [clonedCube.cubeState.F[2][0], clonedCube.cubeState.F[2][1], clonedCube.cubeState.F[2][2]] = [this.cubeState.F[0][0], this.cubeState.F[1][0], this.cubeState.F[2][0]];
        break;
      case "F2":
        [clonedCube.cubeState.U[2][2], clonedCube.cubeState.U[2][1], clonedCube.cubeState.U[2][0]] = [this.cubeState.D[0][0], this.cubeState.D[0][1], this.cubeState.D[0][2]];
        [clonedCube.cubeState.R[0][0], clonedCube.cubeState.R[1][0], clonedCube.cubeState.R[2][0]] = [this.cubeState.L[2][2], this.cubeState.L[1][2], this.cubeState.L[0][2]];
        [clonedCube.cubeState.D[0][0], clonedCube.cubeState.D[0][1], clonedCube.cubeState.D[0][2]] = [this.cubeState.U[2][2], this.cubeState.U[2][1], this.cubeState.U[2][0]];
        [clonedCube.cubeState.L[2][2], clonedCube.cubeState.L[1][2], clonedCube.cubeState.L[0][2]] = [this.cubeState.R[0][0], this.cubeState.R[1][0], this.cubeState.R[2][0]];
        
        [clonedCube.cubeState.F[0][0], clonedCube.cubeState.F[0][1], clonedCube.cubeState.F[0][2]] = [this.cubeState.F[2][2], this.cubeState.F[2][1], this.cubeState.F[2][0]];
        [clonedCube.cubeState.F[1][0], clonedCube.cubeState.F[1][2]] = [this.cubeState.F[1][2], this.cubeState.F[1][0]];
        [clonedCube.cubeState.F[2][0], clonedCube.cubeState.F[2][1], clonedCube.cubeState.F[2][2]] = [this.cubeState.F[0][2], this.cubeState.F[0][1], this.cubeState.F[0][0]];
        break;

      case "B":
        [clonedCube.cubeState.U[0][0], clonedCube.cubeState.U[0][1], clonedCube.cubeState.U[0][2]] = [this.cubeState.R[0][2], this.cubeState.R[1][2], this.cubeState.R[2][2]];
        [clonedCube.cubeState.L[0][0], clonedCube.cubeState.L[1][0], clonedCube.cubeState.L[2][0]] = [this.cubeState.U[0][2], this.cubeState.U[0][1], this.cubeState.U[0][0]];
        [clonedCube.cubeState.D[2][2], clonedCube.cubeState.D[2][1], clonedCube.cubeState.D[2][0]] = [this.cubeState.L[2][0], this.cubeState.L[1][0], this.cubeState.L[0][0]];
        [clonedCube.cubeState.R[2][2], clonedCube.cubeState.R[1][2], clonedCube.cubeState.R[0][2]] = [this.cubeState.D[2][0], this.cubeState.D[2][1], this.cubeState.D[2][2]];
  
        [clonedCube.cubeState.B[0][0], clonedCube.cubeState.B[0][1], clonedCube.cubeState.B[0][2]] = [this.cubeState.B[2][0], this.cubeState.B[1][0], this.cubeState.B[0][0]];
        [clonedCube.cubeState.B[1][0], clonedCube.cubeState.B[1][2]] = [this.cubeState.B[2][1], this.cubeState.B[0][1]];
        [clonedCube.cubeState.B[2][0], clonedCube.cubeState.B[2][1], clonedCube.cubeState.B[2][2]] = [this.cubeState.B[2][2], this.cubeState.B[1][2], this.cubeState.B[0][2]];
        break;
      case "B'":
        [clonedCube.cubeState.U[0][0], clonedCube.cubeState.U[0][1], clonedCube.cubeState.U[0][2]] = [this.cubeState.L[2][0], this.cubeState.L[1][0], this.cubeState.L[0][0]];
        [clonedCube.cubeState.L[0][0], clonedCube.cubeState.L[1][0], clonedCube.cubeState.L[2][0]] = [this.cubeState.D[2][0], this.cubeState.D[2][1], this.cubeState.D[2][2]];
        [clonedCube.cubeState.D[2][2], clonedCube.cubeState.D[2][1], clonedCube.cubeState.D[2][0]] = [this.cubeState.R[0][2], this.cubeState.R[1][2], this.cubeState.R[2][2]];
        [clonedCube.cubeState.R[2][2], clonedCube.cubeState.R[1][2], clonedCube.cubeState.R[0][2]] = [this.cubeState.U[0][2], this.cubeState.U[0][1], this.cubeState.U[0][0]];
  
        [clonedCube.cubeState.B[0][0], clonedCube.cubeState.B[0][1], clonedCube.cubeState.B[0][2]] = [this.cubeState.B[0][2], this.cubeState.B[1][2], this.cubeState.B[2][2]];
        [clonedCube.cubeState.B[1][0], clonedCube.cubeState.B[1][2]] = [this.cubeState.B[0][1], this.cubeState.B[2][1]];
        [clonedCube.cubeState.B[2][0], clonedCube.cubeState.B[2][1], clonedCube.cubeState.B[2][2]] = [this.cubeState.B[0][0], this.cubeState.B[1][0], this.cubeState.B[2][0]];
        break;
      case "B2":
        [clonedCube.cubeState.U[0][0], clonedCube.cubeState.U[0][1], clonedCube.cubeState.U[0][2]] = [this.cubeState.D[2][2], this.cubeState.D[2][1], this.cubeState.D[2][0]];
        [clonedCube.cubeState.L[0][0], clonedCube.cubeState.L[1][0], clonedCube.cubeState.L[2][0]] = [this.cubeState.R[2][2], this.cubeState.R[1][2], this.cubeState.R[0][2]];
        [clonedCube.cubeState.D[2][2], clonedCube.cubeState.D[2][1], clonedCube.cubeState.D[2][0]] = [this.cubeState.U[0][0], this.cubeState.U[0][1], this.cubeState.U[0][2]];
        [clonedCube.cubeState.R[2][2], clonedCube.cubeState.R[1][2], clonedCube.cubeState.R[0][2]] = [this.cubeState.L[0][0], this.cubeState.L[1][0], this.cubeState.L[2][0]];
        
        [clonedCube.cubeState.B[0][0], clonedCube.cubeState.B[0][1], clonedCube.cubeState.B[0][2]] = [this.cubeState.B[2][2], this.cubeState.B[2][1], this.cubeState.B[2][0]];
        [clonedCube.cubeState.B[1][0], clonedCube.cubeState.B[1][2]] = [this.cubeState.B[1][2], this.cubeState.B[1][0]];
        [clonedCube.cubeState.B[2][0], clonedCube.cubeState.B[2][1], clonedCube.cubeState.B[2][2]] = [this.cubeState.B[0][2], this.cubeState.B[0][1], this.cubeState.B[0][0]];
        break;
    }

    return clonedCube;
  }

  /**
   * 指定された場所のカラーを返します。
   * 指定座標については{@linkcode RubikCubeFace} {@linkcode CubeState}参照のこと
   */
  at(faceName: RubikCubeFaceName, y: RubikCubeFaceYIndex, x: RubikCubeFaceXIndex): RubikCubeFaceColor {
    return this.cubeState[faceName][y][x]
  }

  /**
   * 複数の回転記号、複数回の回転
   * @returns 引数movesで指定された回転記号に基づき回転されたDeepCloneされた{@linkcode RubikCube}
   */
  rotateCube(moves: RubikCubeMove[]) {
    return moves.reduce((prev, move) => {
      return prev.rotateCubeOnce(move);
    }, this as RubikCube);
  }
}
