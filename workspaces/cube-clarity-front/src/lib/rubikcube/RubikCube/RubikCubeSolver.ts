/**
 * @module
 * ルービックキューブの初心者向けの解法方法は7つあります。
 * 関数solveRubikCubeはそれぞれの段階の関数ををまとめて一つの関数に呼び出し、解法方法を返します。
 */

import {
  FACE_COLOR,
  type RubikCube,
  type RubikCubeFaceColor,
  type RubikCubeFaceName,
  type RubikCubeFaceXIndex,
  type RubikCubeFaceYIndex,
  type RubikCubeMoveNotation,
} from "./RubikCube.ts";

type SolvingIndex = {
  face: RubikCubeFaceName;
  x: RubikCubeFaceXIndex;
  y: RubikCubeFaceYIndex;
  moves: RubikCubeMoveNotation[];
}[];

type CornerIndex = {
  position: string;
  face1: RubikCubeFaceName;
  face2: RubikCubeFaceName;
  face3: RubikCubeFaceName;
  x1: RubikCubeFaceXIndex;
  x2: RubikCubeFaceXIndex;
  x3: RubikCubeFaceXIndex;
  y1: RubikCubeFaceYIndex;
  y2: RubikCubeFaceYIndex;
  y3: RubikCubeFaceYIndex;
}[];

type EdgeIndex = {
  position: string;
  face1: RubikCubeFaceName;
  face2: RubikCubeFaceName;
  x1: RubikCubeFaceXIndex;
  x2: RubikCubeFaceXIndex;
  y1: RubikCubeFaceYIndex;
  y2: RubikCubeFaceYIndex;
}[];

export function solveRubikCube(cube: RubikCube) {
  // Step1
  const [step1Cube, step1moves] = solveWhiteCross(cube);
  // Step2
  const [step2Cube, step2moves] = solveWhiteLayer(step1Cube);
  // Step3
  const [step3Cube, step3moves] = solveSecondLayer(step2Cube);
  // Step4
  const [step4Cube, step4moves] = solveYellowCross(step3Cube);
  // Step5
  const [step5Cube, step5moves] = solveCrossColor(step4Cube);
  // Step6
  const [step6Cube, step6moves] = solveYellowCorners(step5Cube);
  // Step7
  const step7moves = solveLastLayer(step6Cube);

  return {
    step1: {
      startRubikCube: cube,
      moves: step1moves,
    },
    step2: {
      startRubikCube: step1Cube,
      moves: step2moves,
    },
    step3: {
      startRubikCube: step2Cube,
      moves: step3moves,
    },
    step4: {
      startRubikCube: step3Cube,
      moves: step4moves,
    },
    step5: {
      startRubikCube: step4Cube,
      moves: step5moves,
    },
    step6: {
      startRubikCube: step5Cube,
      moves: step6moves,
    },
    step7: {
      startRubikCube: step6Cube,
      moves: step7moves,
    },
  } satisfies Record<
    string,
    { moves: RubikCubeMoveNotation[]; startRubikCube: RubikCube }
  >;
}

// 十字の作成
function solveWhiteCross(
  gotCube: RubikCube,
): [RubikCube, RubikCubeMoveNotation[]] {
  let cube = gotCube;
  const movesResult: RubikCubeMoveNotation[] = [];

  const correctEdges: Record<string, RubikCubeFaceColor> = {
    "F": FACE_COLOR.Green,
    "R": FACE_COLOR.Red,
    "B": FACE_COLOR.Blue,
    "L": FACE_COLOR.Orange,
  };

  function getAdjacentFace(key: string): RubikCubeFaceName {
    if (key === "D,0,1") return "F";
    if (key === "D,1,2") return "R";
    if (key === "D,2,1") return "B";
    if (key === "D,1,0") return "L";
    throw new Error(`Invalid key: ${key}`);
  }

  function getUAdjustmentForFandB(
    cube: RubikCube,
  ): RubikCubeMoveNotation | null {
    if (
      cube.at("F", 2, 1) === FACE_COLOR.White ||
      cube.at("B", 2, 1) === FACE_COLOR.White ||
      cube.at("F", 1, 2) === FACE_COLOR.White ||
      cube.at("B", 1, 0) === FACE_COLOR.White
    ) {
      if (
        cube.at("U", 1, 2) === FACE_COLOR.White &&
        cube.at("U", 0, 1) !== FACE_COLOR.White
      ) {
        return "U";
      }
      if (
        cube.at("U", 1, 2) === FACE_COLOR.White &&
        cube.at("U", 0, 1) === FACE_COLOR.White &&
        cube.at("U", 2, 1) !== FACE_COLOR.White
      ) {
        return "U'";
      }
      if (
        cube.at("U", 1, 2) === FACE_COLOR.White &&
        cube.at("U", 0, 1) === FACE_COLOR.White &&
        cube.at("U", 2, 1) === FACE_COLOR.White
      ) {
        return "U2";
      }
    }

    if (
      cube.at("F", 1, 0) === FACE_COLOR.White ||
      cube.at("B", 1, 2) === FACE_COLOR.White
    ) {
      if (
        cube.at("U", 1, 0) === FACE_COLOR.White &&
        cube.at("U", 2, 1) !== FACE_COLOR.White
      ) {
        return "U";
      }
      if (
        cube.at("U", 1, 0) === FACE_COLOR.White &&
        cube.at("U", 2, 1) === FACE_COLOR.White &&
        cube.at("U", 0, 1) !== FACE_COLOR.White
      ) {
        return "U'";
      }
      if (
        cube.at("U", 1, 0) === FACE_COLOR.White &&
        cube.at("U", 2, 1) === FACE_COLOR.White &&
        cube.at("U", 0, 1) === FACE_COLOR.White
      ) {
        return "U2";
      }
    }

    return null;
  }

  function getDAdjustmentForFandB(
    cube: RubikCube,
  ): RubikCubeMoveNotation | null {
    if (
      cube.at("F", 0, 1) === FACE_COLOR.White ||
      cube.at("B", 0, 1) === FACE_COLOR.White ||
      cube.at("F", 1, 2) === FACE_COLOR.White ||
      cube.at("B", 1, 0) === FACE_COLOR.White
    ) {
      if (
        cube.at("D", 1, 2) === FACE_COLOR.White &&
        cube.at("D", 0, 1) !== FACE_COLOR.White
      ) {
        return "D";
      }
      if (
        cube.at("D", 1, 2) === FACE_COLOR.White &&
        cube.at("D", 0, 1) === FACE_COLOR.White &&
        cube.at("D", 2, 1) !== FACE_COLOR.White
      ) {
        return "D'";
      }
      if (
        cube.at("D", 1, 2) === FACE_COLOR.White &&
        cube.at("D", 0, 1) === FACE_COLOR.White &&
        cube.at("D", 2, 1) === FACE_COLOR.White
      ) {
        return "D2";
      }
    }

    if (
      cube.at("F", 1, 0) === FACE_COLOR.White ||
      cube.at("B", 1, 2) === FACE_COLOR.White
    ) {
      if (
        cube.at("D", 1, 0) === FACE_COLOR.White &&
        cube.at("D", 2, 1) !== FACE_COLOR.White
      ) {
        return "D";
      }
      if (
        cube.at("D", 1, 0) === FACE_COLOR.White &&
        cube.at("D", 2, 1) === FACE_COLOR.White &&
        cube.at("D", 0, 1) !== FACE_COLOR.White
      ) {
        return "D'";
      }
      if (
        cube.at("D", 1, 0) === FACE_COLOR.White &&
        cube.at("D", 2, 1) === FACE_COLOR.White &&
        cube.at("D", 0, 1) === FACE_COLOR.White
      ) {
        return "D2";
      }
    }

    return null;
  }

  function getUAdjustmentForRandL(
    cube: RubikCube,
  ): RubikCubeMoveNotation | null {
    if (
      cube.at("R", 2, 1) === FACE_COLOR.White ||
      cube.at("L", 2, 1) === FACE_COLOR.White ||
      cube.at("L", 1, 2) === FACE_COLOR.White ||
      cube.at("R", 1, 0) === FACE_COLOR.White
    ) {
      if (
        cube.at("U", 2, 1) === FACE_COLOR.White &&
        cube.at("U", 1, 2) !== FACE_COLOR.White
      ) {
        return "U";
      }
      if (
        cube.at("U", 2, 1) === FACE_COLOR.White &&
        cube.at("U", 1, 2) === FACE_COLOR.White &&
        cube.at("U", 1, 0) !== FACE_COLOR.White
      ) {
        return "U'";
      }
      if (
        cube.at("U", 2, 1) === FACE_COLOR.White &&
        cube.at("U", 1, 2) === FACE_COLOR.White &&
        cube.at("U", 1, 0) === FACE_COLOR.White
      ) {
        return "U2";
      }
    }

    if (
      cube.at("L", 1, 0) === FACE_COLOR.White ||
      cube.at("R", 1, 2) === FACE_COLOR.White
    ) {
      if (
        cube.at("U", 0, 1) === FACE_COLOR.White &&
        cube.at("U", 1, 0) !== FACE_COLOR.White
      ) {
        return "U";
      }
      if (
        cube.at("U", 0, 1) === FACE_COLOR.White &&
        cube.at("U", 1, 0) === FACE_COLOR.White &&
        cube.at("U", 1, 2) !== FACE_COLOR.White
      ) {
        return "U'";
      }
      if (
        cube.at("U", 0, 1) === FACE_COLOR.White &&
        cube.at("U", 1, 0) === FACE_COLOR.White &&
        cube.at("U", 1, 2) === FACE_COLOR.White
      ) {
        return "U2";
      }
    }

    return null;
  }

  function getDAdjustmentForRandL(
    cube: RubikCube,
  ): RubikCubeMoveNotation | null {
    if (
      cube.at("R", 0, 1) === FACE_COLOR.White ||
      cube.at("L", 0, 1) === FACE_COLOR.White ||
      cube.at("L", 1, 2) === FACE_COLOR.White ||
      cube.at("R", 1, 0) === FACE_COLOR.White
    ) {
      if (
        cube.at("D", 0, 1) === FACE_COLOR.White &&
        cube.at("D", 1, 0) !== FACE_COLOR.White
      ) {
        return "D";
      }
      if (
        cube.at("D", 0, 1) === FACE_COLOR.White &&
        cube.at("D", 1, 0) === FACE_COLOR.White &&
        cube.at("D", 1, 2) !== FACE_COLOR.White
      ) {
        return "D'";
      }
      if (
        cube.at("D", 0, 1) === FACE_COLOR.White &&
        cube.at("D", 1, 0) === FACE_COLOR.White &&
        cube.at("D", 1, 2) === FACE_COLOR.White
      ) {
        return "D2";
      }
    }

    if (
      cube.at("L", 1, 0) === FACE_COLOR.White ||
      cube.at("R", 1, 2) === FACE_COLOR.White
    ) {
      if (
        cube.at("D", 2, 1) === FACE_COLOR.White &&
        cube.at("D", 1, 2) !== FACE_COLOR.White
      ) {
        return "D";
      }
      if (
        cube.at("D", 2, 1) === FACE_COLOR.White &&
        cube.at("D", 1, 2) === FACE_COLOR.White &&
        cube.at("D", 1, 0) !== FACE_COLOR.White
      ) {
        return "D'";
      }
      if (
        cube.at("D", 2, 1) === FACE_COLOR.White &&
        cube.at("D", 1, 2) === FACE_COLOR.White &&
        cube.at("D", 1, 0) === FACE_COLOR.White
      ) {
        return "D2";
      }
    }

    return null;
  }

  for (let repeat = 0; repeat < 2; repeat++) {
    const whiteEdgesF: SolvingIndex = [
      { face: "F", x: 0, y: 1, moves: ["F", "R'", "F'"] },
      { face: "F", x: 1, y: 2, moves: ["R'"] },
      { face: "F", x: 2, y: 1, moves: ["F'", "R'", "F"] },
      { face: "F", x: 1, y: 0, moves: ["L"] },
    ];

    for (const { face, x, y, moves } of whiteEdgesF) {
      while (cube.at(face, x, y) === FACE_COLOR.White) {
        const uAdjustment = getUAdjustmentForFandB(cube);
        const dAdjustment = getDAdjustmentForFandB(cube);

        if (uAdjustment) {
          movesResult.push(uAdjustment);
          cube = cube.rotateCubeOnce(uAdjustment);
        }
        if (dAdjustment) {
          movesResult.push(dAdjustment);
          cube = cube.rotateCubeOnce(dAdjustment);
        }

        movesResult.push(...moves);
        cube = cube.rotateCube(moves);
      }
    }

    const whiteEdgesR: SolvingIndex = [
      { face: "R", x: 0, y: 1, moves: ["R'", "F", "R"] },
      { face: "R", x: 1, y: 2, moves: ["B'"] },
      { face: "R", x: 2, y: 1, moves: ["R", "F", "R'"] },
      { face: "R", x: 1, y: 0, moves: ["F"] },
    ];

    for (const { face, x, y, moves } of whiteEdgesR) {
      while (cube.at(face, x, y) === FACE_COLOR.White) {
        const uAdjustment = getUAdjustmentForRandL(cube);
        const dAdjustment = getDAdjustmentForRandL(cube);

        if (uAdjustment) {
          movesResult.push(uAdjustment);
          cube = cube.rotateCubeOnce(uAdjustment);
        }

        if (dAdjustment) {
          movesResult.push(dAdjustment);
          cube = cube.rotateCubeOnce(dAdjustment);
        }

        movesResult.push(...moves);
        cube = cube.rotateCube(moves);
      }
    }

    const whiteEdgesB: SolvingIndex = [
      { face: "B", x: 0, y: 1, moves: ["B'", "R", "B"] },
      { face: "B", x: 1, y: 2, moves: ["L'"] },
      { face: "B", x: 2, y: 1, moves: ["B", "R", "B'"] },
      { face: "B", x: 1, y: 0, moves: ["R"] },
    ];

    for (const { face, x, y, moves } of whiteEdgesB) {
      while (cube.at(face, x, y) === FACE_COLOR.White) {
        const uAdjustment = getUAdjustmentForFandB(cube);
        const dAdjustment = getDAdjustmentForFandB(cube);

        if (uAdjustment) {
          movesResult.push(uAdjustment);
          cube = cube.rotateCubeOnce(uAdjustment);
        }
        if (dAdjustment) {
          movesResult.push(dAdjustment);
          cube = cube.rotateCubeOnce(dAdjustment);
        }

        movesResult.push(...moves);
        cube = cube.rotateCube(moves);
      }
    }

    const whiteEdgesL: SolvingIndex = [
      { face: "L", x: 0, y: 1, moves: ["L", "F'", "L'"] },
      { face: "L", x: 1, y: 2, moves: ["F'"] },
      { face: "L", x: 2, y: 1, moves: ["L'", "F'", "L"] },
      { face: "L", x: 1, y: 0, moves: ["B"] },
    ];

    for (const { face, x, y, moves } of whiteEdgesL) {
      while (cube.at(face, x, y) === FACE_COLOR.White) {
        const uAdjustment = getUAdjustmentForRandL(cube);
        const dAdjustment = getDAdjustmentForRandL(cube);

        if (uAdjustment) {
          movesResult.push(uAdjustment);
          cube = cube.rotateCubeOnce(uAdjustment);
        }
        if (dAdjustment) {
          movesResult.push(dAdjustment);
          cube = cube.rotateCubeOnce(dAdjustment);
        }

        movesResult.push(...moves);
        cube = cube.rotateCube(moves);
      }
    }
  }

  const edgeMoves: Record<string, Record<string, RubikCubeMoveNotation[]>> = {
    "D,0,1": {
      G: ["F2"],
      R: ["D", "R2"],
      O: ["D'", "L2"],
      B: ["D2", "B2"],
    },
    "D,1,2": {
      R: ["R2"],
      B: ["D", "B2"],
      G: ["D'", "F2"],
      O: ["D2", "L2"],
    },
    "D,2,1": {
      B: ["B2"],
      O: ["D", "L2"],
      R: ["D'", "R2"],
      G: ["D2", "F2"],
    },
    "D,1,0": {
      O: ["L2"],
      G: ["D", "F2"],
      B: ["D'", "B2"],
      R: ["D2", "R2"],
    },
  };

  for (let repeat = 0; repeat < 2; repeat++) {
    for (const key in edgeMoves) {
      const [face, x, y] = key.split(",") as [
        RubikCubeFaceName,
        RubikCubeFaceXIndex,
        RubikCubeFaceYIndex,
      ];

      while (cube.at(face, x, y) === FACE_COLOR.White) {
        const adjacentFace = getAdjacentFace(key);
        const color = cube.at(adjacentFace, 2, 1);

        if (edgeMoves[key][color]) {
          const moves = edgeMoves[key][color];

          movesResult.push(...moves);
          cube = cube.rotateCube(moves);
        } else {
          break;
        }
      }
    }

    for (const face in correctEdges) {
      if (cube.at(face as RubikCubeFaceName, 0, 1) !== correctEdges[face]) {
        if (face === "F") {
          movesResult.push("F2");
          cube = cube.rotateCubeOnce("F2");
        }

        if (face === "R") {
          movesResult.push("R2");
          cube = cube.rotateCubeOnce("R2");
        }

        if (face === "L") {
          movesResult.push("L2");
          cube = cube.rotateCubeOnce("L2");
        }

        if (face === "B") {
          movesResult.push("B2");
          cube = cube.rotateCubeOnce("B2");
        }

        break;
      }
    }
  }

  return [cube, movesResult];
}

// コーナー解法
function findWhiteCorners(
  cube: RubikCube,
): { position: string; colors: string[] }[] {
  const whiteCorners: { position: string; colors: string[] }[] = [];

  const cornerPositions: CornerIndex = [
    {
      position: "DRF",
      face1: "D",
      x1: 0,
      y1: 2,
      face2: "R",
      x2: 2,
      y2: 0,
      face3: "F",
      x3: 2,
      y3: 2,
    },
    {
      position: "DLF",
      face1: "D",
      x1: 0,
      y1: 0,
      face2: "L",
      x2: 2,
      y2: 2,
      face3: "F",
      x3: 2,
      y3: 0,
    },
    {
      position: "DRB",
      face1: "D",
      x1: 2,
      y1: 2,
      face2: "R",
      x2: 2,
      y2: 2,
      face3: "B",
      x3: 2,
      y3: 0,
    },
    {
      position: "DLB",
      face1: "D",
      x1: 2,
      y1: 0,
      face2: "L",
      x2: 2,
      y2: 0,
      face3: "B",
      x3: 2,
      y3: 2,
    },
  ];

  for (
    const { position, face1, x1, y1, face2, x2, y2, face3, x3, y3 }
      of cornerPositions
  ) {
    const colors = [
      cube.at(face1, x1, y1),
      cube.at(face2, x2, y2),
      cube.at(face3, x3, y3),
    ];

    if (colors.includes(FACE_COLOR.White)) {
      whiteCorners.push({ position, colors });
    }
  }

  return whiteCorners;
}

function fixUpperLayer(cube: RubikCube): RubikCubeMoveNotation[] {
  const moves: RubikCubeMoveNotation[] = [];

  const upperLayerCorners: Record<
    string,
    { condition: boolean; condition2: boolean; move: RubikCubeMoveNotation[] }
  > = {
    "URF": {
      condition: cube.at("U", 2, 2) !== FACE_COLOR.White,
      condition2: cube.at("F", 0, 2) !== FACE_COLOR.Green,
      move: ["R'", "D'", "R"],
    },
    "ULF": {
      condition: cube.at("U", 2, 0) !== FACE_COLOR.White,
      condition2: cube.at("L", 0, 2) !== FACE_COLOR.Orange,
      move: ["L", "D", "L'"],
    },
    "URB": {
      condition: cube.at("U", 0, 2) !== FACE_COLOR.White,
      condition2: cube.at("R", 0, 2) !== FACE_COLOR.Red,
      move: ["R", "D", "R'"],
    },
    "ULB": {
      condition: cube.at("U", 0, 0) !== FACE_COLOR.White,
      condition2: cube.at("B", 0, 2) !== FACE_COLOR.Blue,
      move: ["L'", "D'", "L"],
    },
  };

  for (
    const [_, { condition, condition2, move }] of Object.entries(
      upperLayerCorners,
    )
  ) {
    if (condition || condition2) {
      moves.push(...move);
      cube = cube.rotateCube(move);
      return moves;
    }
  }

  return moves;
}

function solveWhiteLayer(
  cube: RubikCube,
): [RubikCube, RubikCubeMoveNotation[]] {
  const movesResult: RubikCubeMoveNotation[] = [];

  const correctCornerPositions: Record<string, Record<string, string>> = {
    "DRF": { "WBR": "D", "WBO": "D2", "WGO": "D'", "WGR": "" },
    "DLF": { "WBR": "D2", "WBO": "D'", "WGO": "", "WGR": "D" },
    "DLB": { "WBR": "D'", "WBO": "", "WGO": "D", "WGR": "D2" },
    "DRB": { "WBR": "", "WBO": "D", "WGO": "D2", "WGR": "D'" },
  };

  const insertCorner: Record<string, Record<string, RubikCubeMoveNotation[]>> =
    {
      "L,2,2": {
        W: ["D'", "F'", "D", "F"],
        O: ["D", "L", "D'", "L'"],
        G: ["D", "L", "D2", "L'", "D", "L", "D'", "L'"],
      },
      "F,2,2": {
        W: ["D'", "R'", "D", "R"],
        R: ["D'", "R'", "D2", "R", "D'", "R'", "D", "R"],
        G: ["D", "F", "D'", "F'"],
      },
      "R,2,2": {
        W: ["D'", "B'", "D", "B"],
        B: ["D'", "B'", "D2", "B", "D'", "B'", "D", "B"],
        R: ["D", "R", "D'", "R'"],
      },
      "B,2,2": {
        W: ["D'", "L'", "D", "L"],
        O: ["D'", "L'", "D2", "L", "D'", "L'", "D", "L"],
        B: ["D", "B", "D'", "B'"],
      },
    };

  function normalizeCornerColors(colors: string[]): string {
    const colorOrder: Record<string, number> = {
      "W": 1,
      "B": 2,
      "G": 3,
      "R": 4,
      "O": 5,
    };
    return colors.sort((a, b) => (colorOrder[a] ?? 10) - (colorOrder[b] ?? 10))
      .join("");
  }

  while (true) {
    const whiteCorners = findWhiteCorners(cube);
    let adjusted = false;

    if (whiteCorners.length === 0) {
      const fixMoves = fixUpperLayer(cube);
      if (fixMoves.length > 0) {
        movesResult.push(...fixMoves);
        cube = cube.rotateCube(fixMoves);
        adjusted = true;
      }
    }

    for (const { position, colors } of whiteCorners) {
      const colorKey = normalizeCornerColors(colors);
      const moveSequence: RubikCubeMoveNotation[] = [];

      if (
        position in correctCornerPositions &&
        colorKey in correctCornerPositions[position]
      ) {
        const move =
          correctCornerPositions[position][colorKey] as RubikCubeMoveNotation;
        if (move) {
          moveSequence.push(move);
          cube = cube.rotateCubeOnce(move);
          adjusted = true;
        }
      }

      const insertMapping: Record<string, string> = {
        "WBR": "R,2,2",
        "WBO": "B,2,2",
        "WGO": "L,2,2",
        "WGR": "F,2,2",
      };

      if (colorKey in insertMapping) {
        const insertKey = insertMapping[colorKey];
        const [face, x, y] = insertKey.split(",") as [
          RubikCubeFaceName,
          RubikCubeFaceXIndex,
          RubikCubeFaceYIndex,
        ];

        if (cube.at(face, x, y) in insertCorner[insertKey]) {
          const color = cube.at(face, x, y);
          if (insertCorner[insertKey][color]) {
            const move = insertCorner[insertKey][color];
            moveSequence.push(...move);
            cube = cube.rotateCube(move);
            adjusted = true;
          }
        }
      }

      if (moveSequence.length > 0) {
        movesResult.push(...moveSequence);
        break;
      }
    }

    if (!adjusted) break;
  }

  return [cube, movesResult];
}

// セコンドレイヤ解法
function findEdges(cube: RubikCube): { position: string; colors: string }[] {
  const noneYellowEdges: { position: string; colors: string }[] = [];

  const edgePositions: EdgeIndex = [
    { position: "DF", face1: "D", x1: 0, y1: 1, face2: "F", x2: 2, y2: 1 },
    { position: "DR", face1: "D", x1: 1, y1: 2, face2: "R", x2: 2, y2: 1 },
    { position: "DL", face1: "D", x1: 1, y1: 0, face2: "L", x2: 2, y2: 1 },
    { position: "DB", face1: "D", x1: 2, y1: 1, face2: "B", x2: 2, y2: 1 },
  ];

  for (const { position, face1, x1, y1, face2, x2, y2 } of edgePositions) {
    const colors = `${cube.at(face1, x1, y1)}${cube.at(face2, x2, y2)}`;

    if (!colors.includes(FACE_COLOR.Yellow)) {
      noneYellowEdges.push({ position, colors });
    }
  }

  return noneYellowEdges;
}

function fixFlippedEdge(cube: RubikCube): RubikCubeMoveNotation[] {
  const moves: RubikCubeMoveNotation[] = [];

  const unOrientedEdge: Record<
    string,
    { condition: boolean; condition2: boolean; move: RubikCubeMoveNotation[] }
  > = {
    "FR": {
      condition: cube.at("F", 1, 2) !== FACE_COLOR.Green,
      condition2: cube.at("R", 1, 0) !== FACE_COLOR.Red,
      move: ["R'", "D", "R", "D", "F", "D'", "F'"],
    },
    "FL": {
      condition: cube.at("F", 1, 0) !== FACE_COLOR.Green,
      condition2: cube.at("L", 1, 2) !== FACE_COLOR.Orange,
      move: ["L", "D'", "L'", "D'", "F'", "D", "F"],
    },
    "BR": {
      condition: cube.at("B", 1, 0) !== FACE_COLOR.Blue,
      condition2: cube.at("R", 1, 2) !== FACE_COLOR.Red,
      move: ["R", "D'", "R'", "D'", "B'", "D", "B"],
    },
    "BL": {
      condition: cube.at("B", 1, 2) !== FACE_COLOR.Blue,
      condition2: cube.at("L", 1, 0) !== FACE_COLOR.Orange,
      move: ["L'", "D", "L", "D", "B", "D'", "B'"],
    },
  };

  for (
    const [_, { condition, condition2, move }] of Object.entries(unOrientedEdge)
  ) {
    if (condition || condition2) {
      moves.push(...move);
      cube = cube.rotateCube(move);
      return moves;
    }
  }

  return moves;
}

function solveSecondLayer(
  cube: RubikCube,
): [RubikCube, RubikCubeMoveNotation[]] {
  const movesResult: RubikCubeMoveNotation[] = [];

  const correctEdgePositions: Record<string, Record<string, string>> = {
    "DF": {
      "OG": "",
      "GO": "D'",
      "BR": "D",
      "RB": "D2",
      "RG": "",
      "GR": "D",
      "BO": "D'",
      "OB": "D2",
    },
    "DR": {
      "OG": "D'",
      "GO": "D2",
      "BR": "",
      "RB": "D",
      "RG": "D'",
      "GR": "",
      "BO": "D2",
      "OB": "D",
    },
    "DL": {
      "OG": "D",
      "GO": "",
      "BR": "D2",
      "RB": "D'",
      "RG": "D",
      "GR": "D2",
      "BO": "",
      "OB": "D'",
    },
    "DB": {
      "OG": "D2",
      "GO": "D",
      "BR": "D'",
      "RB": "",
      "RG": "D2",
      "GR": "D'",
      "BO": "D",
      "OB": "",
    },
  };

  const insertEdge: Record<string, Record<string, RubikCubeMoveNotation[]>> = {
    "D,0,1": {
      O: ["D", "L", "D'", "L'", "D'", "F'", "D", "F"],
      R: ["D'", "R'", "D", "R", "D", "F", "D'", "F'"],
    },
    "D,1,2": {
      G: ["D", "F", "D'", "F'", "D'", "R'", "D", "R"],
      B: ["D'", "B'", "D", "B", "D", "R", "D'", "R'"],
    },
    "D,1,0": {
      B: ["D", "B", "D'", "B'", "D'", "L'", "D", "L"],
      G: ["D'", "F'", "D", "F", "D", "L", "D'", "L'"],
    },
    "D,2,1": {
      R: ["D", "R", "D'", "R'", "D'", "B'", "D", "B"],
      O: ["D'", "L'", "D", "L", "D", "B", "D'", "B'"],
    },
  };

  while (true) {
    const noneYellowEdges = findEdges(cube);
    let adjusted = false;

    if (noneYellowEdges.length === 0) {
      const fixMoves = fixFlippedEdge(cube);
      if (fixMoves.length > 0) {
        movesResult.push(...fixMoves);
        cube = cube.rotateCube(fixMoves);
        adjusted = true;
      }
    }

    for (const { position, colors } of noneYellowEdges) {
      const moveSequence: RubikCubeMoveNotation[] = [];

      if (
        position in correctEdgePositions &&
        colors in correctEdgePositions[position]
      ) {
        const move =
          correctEdgePositions[position][colors] as RubikCubeMoveNotation;
        if (move) {
          moveSequence.push(move);
          cube = cube.rotateCubeOnce(move);
          adjusted = true;
        }
      }

      const insertMapping: Record<string, string> = {
        "OG": "D,0,1",
        "RG": "D,0,1",
        "GR": "D,1,2",
        "BR": "D,1,2",
        "BO": "D,1,0",
        "GO": "D,1,0",
        "RB": "D,2,1",
        "OB": "D,2,1",
      };

      if (colors in insertMapping) {
        const insertKey = insertMapping[colors];
        const [face, x, y] = insertKey.split(",") as [
          RubikCubeFaceName,
          RubikCubeFaceXIndex,
          RubikCubeFaceYIndex,
        ];

        if (cube.at(face, x, y) in insertEdge[insertKey]) {
          const color = cube.at(face, x, y);
          if (insertEdge[insertKey][color]) {
            const move = insertEdge[insertKey][color];
            moveSequence.push(...move);
            cube = cube.rotateCube(move);
            adjusted = true;
          }
        }
      }

      if (moveSequence.length > 0) {
        movesResult.push(...moveSequence);
        break;
      }
    }

    if (!adjusted) break;
  }

  return [cube, movesResult];
}

// 黄色の十字
function solveYellowCross(
  cube: RubikCube,
): [RubikCube, RubikCubeMoveNotation[]] {
  const moveResult: RubikCubeMoveNotation[] = [];

  const yellowEdgePositions: Record<
    string,
    { face: RubikCubeFaceName; x: RubikCubeFaceXIndex; y: RubikCubeFaceYIndex }
  > = {
    "DF": { face: "F", x: 2, y: 1 },
    "DR": { face: "R", x: 2, y: 1 },
    "DL": { face: "L", x: 2, y: 1 },
    "DB": { face: "B", x: 2, y: 1 },
  };

  const yellowEgdes: string[] = [];

  for (
    const [position, { face, x, y }] of Object.entries(yellowEdgePositions)
  ) {
    if (cube.at(face, x, y) !== FACE_COLOR.Yellow) {
      yellowEgdes.push(position);
    }
  }

  const yellowEdgeKey = yellowEgdes.sort().join(" ");

  // deno-fmt-ignore
  const yellowEdgeSolutions: Record<string, RubikCubeMoveNotation[]> = {
    "": ["F'","R'","D'","R","D","F","D2","F'","R'","D'","R","D","R'","D'","R","D","F"],
    "DF DR": ["D2", "F'", "R'", "D'", "R", "D", "R'", "D'", "R", "D", "F"],
    "DF DL": ["D'", "F'", "R'", "D'", "R", "D", "R'", "D'", "R", "D", "F"],
    "DB DR": ["D", "F'", "R'", "D'", "R", "D", "R'", "D'", "R", "D", "F"],
    "DB DL": ["F'", "R'", "D'", "R", "D", "R'", "D'", "R", "D", "F"],
    "DB DF": ["D'", "F'", "R'", "D'", "R", "D", "F"],
    "DL DR": ["F'", "R'", "D'", "R", "D", "F"],
  };

  if (yellowEdgeSolutions[yellowEdgeKey]) {
    const moveSequence = yellowEdgeSolutions[yellowEdgeKey];
    moveResult.push(...moveSequence);
    cube = cube.rotateCube(moveSequence);
  }

  return [cube, moveResult];
}

// Match Cross Color
function findGreenEdgeAndSides(
  cube: RubikCube,
): { position: string; leftColor: string; rightColor: string } | null {
  const edgePositions: Record<
    string,
    {
      face: RubikCubeFaceName;
      x: RubikCubeFaceXIndex;
      y: RubikCubeFaceYIndex;
      left: RubikCubeFaceName;
      right: RubikCubeFaceName;
    }
  > = {
    "DF": { face: "F", x: 2, y: 1, left: "L", right: "R" },
    "DR": { face: "R", x: 2, y: 1, left: "F", right: "B" },
    "DL": { face: "L", x: 2, y: 1, left: "B", right: "F" },
    "DB": { face: "B", x: 2, y: 1, left: "R", right: "L" },
  };

  for (
    const [position, { face, x, y, left, right }] of Object.entries(
      edgePositions,
    )
  ) {
    if (cube.at(face, x, y) === FACE_COLOR.Green) {
      return {
        position,
        leftColor: cube.at(left, 2, 1),
        rightColor: cube.at(right, 2, 1),
      };
    }
  }

  return null;
}

function solveCrossColor(
  cube: RubikCube,
): [RubikCube, RubikCubeMoveNotation[]] {
  const moveResult: RubikCubeMoveNotation[] = [];

  const greenEdgeData = findGreenEdgeAndSides(cube);

  if (!greenEdgeData) {
    return [cube, moveResult];
  }

  const { position, leftColor, rightColor } = greenEdgeData;
  const edgeColors = `${leftColor},${rightColor}`;

  // deno-fmt-ignore
  const adjustmentMoves: Record<
    string,
    Record<string, RubikCubeMoveNotation[]>
  > = {
    "DF": {
      "O,R": [],
      "O,B": ["D2", "R'", "D'", "R", "D'", "R'", "D2", "R", "D"],
      "R,O": ["R'","D'","R","D'","R'","D2","R","D","R'","D'","R","D'","R'","D2","R","D2"],
      "R,B": ["R'", "D'", "R", "D'", "R'", "D2", "R"],
      "B,R": ["D", "R'", "D'", "R", "D'", "R'", "D2", "R", "D2"],
      "B,O": ["D'", "R'", "D'", "R", "D'", "R'", "D2", "R", "D'"],
    },
    "DR": {
      "O,R": ["D'"],
      "O,B": ["D", "R'", "D'", "R", "D'", "R'", "D2", "R", "D"],
      "R,O": ["R'","D'","R","D'","R'","D2","R","D","R'","D'","R","D'","R'","D2","R","D'"],
      "R,B": ["D'", "R'", "D'", "R", "D'", "R'", "D2", "R"],
      "B,R": ["R'", "D'", "R", "D'", "R'", "D2", "R", "D2"],
      "B,O": ["D2", "R'", "D'", "R", "D'", "R'", "D2", "R", "D'"],
    },
    "DL": {
      "O,R": ["D"],
      "O,B": ["D'", "R'", "D'", "R", "D'", "R'", "D2", "R", "D"],
      "R,O": ["R'","D'","R","D'","R'","D2","R","D","R'","D'","R","D'","R'","D2","R","D"],
      "R,B": ["D", "R'", "D'", "R", "D'", "R'", "D2", "R"],
      "B,R": ["D2", "R'", "D'", "R", "D'", "R'", "D2", "R", "D2"],
      "B,O": ["R'", "D'", "R", "D'", "R'", "D2", "R", "D'"],
    },
    "DB": {
      "O,R": ["D2"],
      "O,B": ["R'", "D'", "R", "D'", "R'", "D2", "R", "D"],
      "R,O": ["R'","D'","R","D'","R'","D2","R","D","R'","D'","R","D'","R'","D2","R"],
      "R,B": ["D2", "R'", "D'", "R", "D'", "R'", "D2", "R"],
      "B,R": ["D'", "R'", "D'", "R", "D'", "R'", "D2", "R", "D2"],
      "B,O": ["D", "R'", "D'", "R", "D'", "R'", "D2", "R", "D'"],
    },
  };

  if (adjustmentMoves[position] && adjustmentMoves[position][edgeColors]) {
    const moveSequence = adjustmentMoves[position][edgeColors];
    moveResult.push(...moveSequence);
    cube = cube.rotateCube(moveSequence);
  }

  return [cube, moveResult];
}

// Match Corners
function findCorrectYellowCornerPosition(cube: RubikCube): string {
  const correctCorners: Record<string, RubikCubeFaceColor[]> = {
    "DRF": ["G", "R", "Y"],
    "DLF": ["G", "O", "Y"],
    "DRB": ["B", "R", "Y"],
    "DLB": ["B", "O", "Y"],
  };

  const cornerPositions: CornerIndex = [
    {
      position: "DRF",
      face1: "D",
      x1: 0,
      y1: 2,
      face2: "R",
      x2: 2,
      y2: 0,
      face3: "F",
      x3: 2,
      y3: 2,
    },
    {
      position: "DLF",
      face1: "D",
      x1: 0,
      y1: 0,
      face2: "L",
      x2: 2,
      y2: 2,
      face3: "F",
      x3: 2,
      y3: 0,
    },
    {
      position: "DRB",
      face1: "D",
      x1: 2,
      y1: 2,
      face2: "R",
      x2: 2,
      y2: 2,
      face3: "B",
      x3: 2,
      y3: 0,
    },
    {
      position: "DLB",
      face1: "D",
      x1: 2,
      y1: 0,
      face2: "L",
      x2: 2,
      y2: 0,
      face3: "B",
      x3: 2,
      y3: 2,
    },
  ];

  for (
    const { position, face1, x1, y1, face2, x2, y2, face3, x3, y3 }
      of cornerPositions
  ) {
    const colors = [
      cube.at(face1, x1, y1),
      cube.at(face2, x2, y2),
      cube.at(face3, x3, y3),
    ];

    if (
      correctCorners[position].every((color: RubikCubeFaceColor) =>
        colors.includes(color)
      )
    ) {
      return position;
    }
  }

  return "";
}

function checkCorrectColor(
  cube: RubikCube,
  correctCornerPosition: string,
): boolean {
  const correctDRFColors: Record<string, RubikCubeFaceColor[]> = {
    "DRF": ["B", "R", "Y"],
    "DLF": ["G", "R", "Y"],
    "DRB": ["B", "O", "Y"],
    "DLB": ["O", "G", "Y"],
  };

  const checkCornerPosition = [
    cube.at("F", 2, 2),
    cube.at("R", 2, 0),
    cube.at("D", 0, 2),
  ];

  if (
    !correctDRFColors[correctCornerPosition].every((
      color: RubikCubeFaceColor,
    ) => checkCornerPosition.includes(color))
  ) {
    return true;
  }

  return false;
}

function checkCorrectCornerColors(cube: RubikCube): boolean {
  let count = 0;

  const correctCorners: Record<string, RubikCubeFaceColor[]> = {
    "DRF": ["G", "R", "Y"],
    "DLF": ["G", "O", "Y"],
    "DRB": ["B", "R", "Y"],
    "DLB": ["B", "O", "Y"],
  };

  const cornerPositions: CornerIndex = [
    {
      position: "DRF",
      face1: "D",
      x1: 0,
      y1: 2,
      face2: "R",
      x2: 2,
      y2: 0,
      face3: "F",
      x3: 2,
      y3: 2,
    },
    {
      position: "DLF",
      face1: "D",
      x1: 0,
      y1: 0,
      face2: "L",
      x2: 2,
      y2: 2,
      face3: "F",
      x3: 2,
      y3: 0,
    },
    {
      position: "DRB",
      face1: "D",
      x1: 2,
      y1: 2,
      face2: "R",
      x2: 2,
      y2: 2,
      face3: "B",
      x3: 2,
      y3: 0,
    },
    {
      position: "DLB",
      face1: "D",
      x1: 2,
      y1: 0,
      face2: "L",
      x2: 2,
      y2: 0,
      face3: "B",
      x3: 2,
      y3: 2,
    },
  ];

  for (
    const { position, face1, x1, y1, face2, x2, y2, face3, x3, y3 }
      of cornerPositions
  ) {
    const colors = [
      cube.at(face1, x1, y1),
      cube.at(face2, x2, y2),
      cube.at(face3, x3, y3),
    ];

    if (
      correctCorners[position].every((color: RubikCubeFaceColor) =>
        colors.includes(color)
      )
    ) {
      count = count + 1;
    }
  }

  if (count === 4) {
    return true;
  }

  return false;
}

function solveYellowCorners(
  cube: RubikCube,
): [RubikCube, RubikCubeMoveNotation[]] {
  const moveResult: RubikCubeMoveNotation[] = [];

  const positionAdjustments: Record<string, RubikCubeMoveNotation> = {
    "DRF": "D'",
    "DRB": "D2",
    "DLB": "D",
  };

  // deno-fmt-ignore
  const mainAlgorithm: RubikCubeMoveNotation[] = ["R'","D","L","D'","R","D","L'","D'"];

  const finalAdjustments: Record<string, RubikCubeMoveNotation> = {
    "DRF": "D",
    "DRB": "D2",
    "DLB": "D'",
  };

  let correctCornerPosition = findCorrectYellowCornerPosition(cube);
  const allcornerCorrect = checkCorrectCornerColors(cube);

  if (allcornerCorrect) {
    return [cube, moveResult];
  } else {
    if (!correctCornerPosition) {
      moveResult.push(...mainAlgorithm);
      cube = cube.rotateCube(mainAlgorithm);

      correctCornerPosition = findCorrectYellowCornerPosition(cube);
    }

    if (correctCornerPosition && correctCornerPosition !== "DLF") {
      const adjustmentMove = positionAdjustments[correctCornerPosition];
      moveResult.push(adjustmentMove);
      cube = cube.rotateCubeOnce(adjustmentMove);
    }

    moveResult.push(...mainAlgorithm);
    cube = cube.rotateCube(mainAlgorithm);

    const checkedCorrectCorner = checkCorrectColor(cube, correctCornerPosition);

    if (checkedCorrectCorner) {
      moveResult.push(...mainAlgorithm);
      cube = cube.rotateCube(mainAlgorithm);
    }

    if (correctCornerPosition && correctCornerPosition !== "DLF") {
      const finalMove = finalAdjustments[correctCornerPosition];
      moveResult.push(finalMove);
      cube = cube.rotateCubeOnce(finalMove);
    }
  }

  return [cube, moveResult];
}

// Last Step
function solvedLastLayer(cube: RubikCube): boolean {
  return (
    cube.at("D", 0, 2) === FACE_COLOR.Yellow &&
    cube.at("D", 0, 0) === FACE_COLOR.Yellow &&
    cube.at("D", 2, 2) === FACE_COLOR.Yellow &&
    cube.at("D", 2, 0) === FACE_COLOR.Yellow
  );
}

function solveLastLayer(cube: RubikCube): RubikCubeMoveNotation[] {
  const moveResult: RubikCubeMoveNotation[] = [];
  const lastAlgorithm: RubikCubeMoveNotation[] = [
    "R",
    "U",
    "R'",
    "U'",
    "R",
    "U",
    "R'",
    "U'",
  ];
  const moveNextCorner: RubikCubeMoveNotation = "D'";

  const lastAdjustment: Record<string, RubikCubeMoveNotation> = {
    [FACE_COLOR.Red]: "D'",
    [FACE_COLOR.Orange]: "D",
    [FACE_COLOR.Blue]: "D2",
  };

  for (let i = 0; i < 4; i++) {
    while (cube.at("D", 0, 2) !== FACE_COLOR.Yellow) {
      moveResult.push(...lastAlgorithm);
      cube = cube.rotateCube(lastAlgorithm);
    }
    moveResult.push(moveNextCorner);
    cube = cube.rotateCubeOnce(moveNextCorner);
  }

  if (solvedLastLayer(cube)) {
    const color = cube.at("F", 2, 1);
    if (color in lastAdjustment) {
      const adjustment = lastAdjustment[color];
      if (adjustment) {
        moveResult.push(adjustment);
        cube = cube.rotateCubeOnce(adjustment);
      }
    }
  }

  return moveResult;
}
