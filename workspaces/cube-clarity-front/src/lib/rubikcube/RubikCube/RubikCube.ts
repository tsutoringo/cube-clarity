import { RubikCubeMoveNotation } from "./MoveNotation";
import { decodeBase64, encodeBase64 } from "@std/encoding";
import { chunked, flatMap, flatten, map } from "@core/iterutil/pipe";
import { pipe } from "@core/pipe";
import {
  decodeRubikCubeFaceColor,
  encodeRubikCubeFaceColor,
  RubikCubeFaceColor,
  rubikCubeFaceColorToHex,
} from "./RubikCubeFaceColor";
import { RubikCubeDecodeError, RubikCubeResult } from "./Error";
import { Result } from "@result/result";
import { collectResult, rubikCubeNet } from "./helper";

export * from "./MoveNotation";
export * from "./RubikCubeFaceColor";

export type RubikCubeFaceName = "U" | "D" | "F" | "B" | "L" | "R";

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

/**
 * RubikCube class.
 *
 * @example
 * ```
 * const rubikCube = RubikCube.default();
 * ```
 */
export class RubikCube implements Iterable<RubikCubeFace> {
  static readonly RUBIK_CUBE_ENCODED_DATA_LENGTH = 27;
  /**
   * すべて揃えられた状態のRubikCubeを返します。
   * @returns すべて揃えられた状態のルービックキューブ
   */
  static default() {
    const cubeState = {
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

    return new RubikCube(cubeState);
  }

  /**
   * すべて揃えられた状態から、`moves`で指定された回転記号に従って回した状態のルービックキューブを返します。
   * @param moves
   *
   * @example
   * ```
   * const cube = RubikCube.withMoveNotation(
   *   parseMoveNotation(
   *     "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
   *   ).unwrap(),
   * );
   * ```
   */
  static withMoveNotation(moves: RubikCubeMoveNotation[]) {
    return RubikCube.default().rotateCube(moves);
  }

  /**
   * 4bitずつ、1byteに2面分に色を区切り U, D, F, B, L, R で並べたuint8Arrayを返します。
   * それぞれの面は
   * ```plane
   * [
   *   [0, 1, 2],
   *   [3, 4, 5],
   *   [6, 7, 8],
   * ]
   * ```
   * の順でデコードされます。
   */
  static encode(rubikCube: RubikCube): Uint8Array {
    const encoded = pipe(
      rubikCube[Symbol.iterator](),
      flatten,
      flatten<RubikCubeFaceColor>,
      chunked(2),
      map(([left, right]) => {
        return encodeRubikCubeFaceColor(left) << 4 |
          encodeRubikCubeFaceColor(right);
      }),
    );

    return Uint8Array.from(encoded);
  }

  /**
   * ルービックキューブをbase64にデコードします。
   * 詳しい処理は{@linkcode RubikCube.encode}
   */
  static encodeBase64(rubikCube: RubikCube): string {
    return encodeBase64(RubikCube.encode(rubikCube));
  }

  /**
   * {@linkcode RubikCube.encode}でエンコードされたルービックキューブをdecodeして{@linkcode RubikCube}にして返します。
   * @param buffer
   * @returns
   */
  static decode(buffer: Uint8Array): RubikCubeResult<RubikCube> {
    if (buffer.length !== RubikCube.RUBIK_CUBE_ENCODED_DATA_LENGTH) {
      return Result.err(new RubikCubeDecodeError(buffer.length));
    }

    const decodedColors = pipe(
      buffer,
      flatMap((value) => [
        value >> 4,
        value & 0b1111,
      ]),
      map((value) => {
        return decodeRubikCubeFaceColor(value);
      }),
      collectResult,
    ).branch();

    if (decodedColors.isBreak) return decodedColors.value;

    const decodedRubikCubeState = Array.from(pipe(
      decodedColors.value,
      chunked(9),
      map((value) =>
        Array.from(pipe(
          value,
          chunked(3),
        ))
      ),
    )) as [
      RubikCubeFace,
      RubikCubeFace,
      RubikCubeFace,
      RubikCubeFace,
      RubikCubeFace,
      RubikCubeFace,
    ];

    return Result.ok(
      new RubikCube(
        {
          U: decodedRubikCubeState[0],
          D: decodedRubikCubeState[1],
          F: decodedRubikCubeState[2],
          B: decodedRubikCubeState[3],
          L: decodedRubikCubeState[4],
          R: decodedRubikCubeState[5],
        },
      ),
    );
  }

  /**
   * {@linkcode RubikCube.encodeBase64}でエンコードされたルービックキューブをdecodeして{@linkcode RubikCube}にして返します。
   * @param base64
   * @returns
   */
  static decodeBase64(base64: string) {
    return RubikCube.decode(decodeBase64(base64));
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
  rotateCubeOnce(move: RubikCubeMoveNotation) {
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
   * 複数の回転記号、複数回の回転
   * @returns 引数movesで指定された回転記号に基づき回転されたDeepCloneされた{@linkcode RubikCube}
   *
   * @example
   * ```typescript
   * RubikCube.default().rotateCube(
   *   parseMoveNotation("D' L U' B2 D' F2 U' R2 D B2 U' L2 D2 F D2 B' L D L R2").unwrap()
   * )
   * ```
   */
  rotateCube(rawMoves: RubikCubeMoveNotation[]) {
    return rawMoves.reduce((prev, move) => {
      return prev.rotateCubeOnce(move);
    }, this as RubikCube);
  }

  /**
   * 指定された場所のカラーを返します。
   * 指定座標については{@linkcode RubikCubeFace} {@linkcode CubeState}参照のこと
   */
  at(
    faceName: RubikCubeFaceName,
    y: RubikCubeFaceYIndex,
    x: RubikCubeFaceXIndex,
  ): RubikCubeFaceColor {
    return this.cubeState[faceName][y][x];
  }

  /**
   * ルービックキューブをbase64にエンコードします。
   * 詳細は{@linkcode RubikCube.encodeBase64}
   */
  encodeBase64(): string {
    return RubikCube.encodeBase64(this);
  }

  [Symbol.iterator]() {
    return [
      this.cubeState.U,
      this.cubeState.D,
      this.cubeState.F,
      this.cubeState.B,
      this.cubeState.L,
      this.cubeState.R,
    ][Symbol.iterator]();
  }

  /**
   * 展開図を返します。
   */
  net() {
    return rubikCubeNet(
      pipe(
        this[Symbol.iterator](),
        flatten<RubikCubeFaceColor[]>,
        flatten<RubikCubeFaceColor>,
      ),
    );
  }

  /**
   * Console上で有効なスタイル付きの展開図を返します。
   * @deprecated 色が正しく表示されません。
   * @todo いつか治す
   */
  netWithColor() {
    const converted = pipe(
      this[Symbol.iterator](),
      flatten<RubikCubeFaceColor[]>,
      flatten<RubikCubeFaceColor>,
      map<RubikCubeFaceColor, {
        faceValue: string;
        style: string;
      }>((color) => ({
        faceValue: `%c${color.padStart(2)}%c`,
        style: `background-color: #${
          rubikCubeFaceColorToHex(color).toString(16).padStart(6, "0")
        };`,
      })),
      Array.from<{
        faceValue: string;
        style: string;
      }>,
    );

    return [
      rubikCubeNet(
        pipe(
          converted,
          map((entry) => entry.faceValue),
        ),
      ),
      ...pipe(
        converted,
        flatMap((entry) => [entry.style, ""]),
      ),
    ];
  }
}
