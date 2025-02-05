import { parseMoveNotation, RubikCubeMoveNotation } from "./RubikCube.ts";
import { FACE_COLOR } from "./RubikCube.ts";
import { RubikCube, RubikCubeFaceName, RubikCubeFaceXIndex, RubikCubeFaceYIndex } from "./RubikCube.ts";

// Scramble 2
const scrambledCube = RubikCube.default().rotateCube("R' B D' L2 B2 D U B2 D R2 B2 R2 U2 L D2 R D' U R2 B L2".split(" ") as RubikCubeMoveNotation[]);
export const scramble = parseMoveNotation("R' B D' L2 B2 D U B2 D R2 B2 R2 U2 L D2 R D' U R2 B L2").unwrap();

type SolvingIndex = {
  face: RubikCubeFaceName;
  x: RubikCubeFaceXIndex;
  y: RubikCubeFaceYIndex;
  moves: RubikCubeMoveNotation[];
}[]

// 🚀 十字の作成
function solveWhiteCross(gotCube: RubikCube): RubikCubeMoveNotation[] {
  let cube = gotCube;
  const movesResult: RubikCubeMoveNotation[] = [];

  function getAdjacentFace(key: string): RubikCubeFaceName {
    if (key === "D,0,1") return "F";
    if (key === "D,1,2") return "R";
    if (key === "D,2,1") return "B";
    if (key === "D,1,0") return "L";
    throw new Error(`Invalid key: ${key}`);
  }

  function getUAdjustmentForFandB(cube: RubikCube): RubikCubeMoveNotation | null{
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
        return "U"
      } if (
        cube.at("U", 1, 2) === FACE_COLOR.White &&
        cube.at("U", 0, 1) === FACE_COLOR.White &&
        cube.at("U", 2, 1) !== FACE_COLOR.White
      ) {
        return "U'"
      } if (
        cube.at("U", 1, 2) === FACE_COLOR.White &&
        cube.at("U", 0, 1) === FACE_COLOR.White &&
        cube.at("U", 2, 1) === FACE_COLOR.White
      ) {
        return "U2"
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
        return "U"
      } if (
        cube.at("U", 1, 0) === FACE_COLOR.White &&
        cube.at("U", 2, 1) === FACE_COLOR.White &&
        cube.at("U", 0, 1) !== FACE_COLOR.White
      ) {
        return "U'"
      } if (
        cube.at("U", 1, 0) === FACE_COLOR.White &&
        cube.at("U", 2, 1) === FACE_COLOR.White &&
        cube.at("U", 0, 1) === FACE_COLOR.White
      ) {
        return "U2"
      }
    }

    return null
  }

  function getDAdjustmentForFandB(cube: RubikCube): RubikCubeMoveNotation | null{
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
        return "D"
      } if (
        cube.at("D", 1, 2) === FACE_COLOR.White &&
        cube.at("D", 0, 1) === FACE_COLOR.White &&
        cube.at("D", 2, 1) !== FACE_COLOR.White
      ) {
        return "D'"
      } if (
        cube.at("D", 1, 2) === FACE_COLOR.White &&
        cube.at("D", 0, 1) === FACE_COLOR.White &&
        cube.at("D", 2, 1) === FACE_COLOR.White
      ) {
        return "D2"
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
        return "D"
      } if (
        cube.at("D", 1, 0) === FACE_COLOR.White &&
        cube.at("D", 2, 1) === FACE_COLOR.White &&
        cube.at("D", 0, 1) !== FACE_COLOR.White
      ) {
        return "D'"
      } if (
        cube.at("D", 1, 0) === FACE_COLOR.White &&
        cube.at("D", 2, 1) === FACE_COLOR.White &&
        cube.at("D", 0, 1) === FACE_COLOR.White
      ) {
        return "D2"
      }
    }

    return null
  }
  
  function getUAdjustmentForRandL(cube: RubikCube): RubikCubeMoveNotation | null {
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
        return "U"
      } if (
        cube.at("U", 2, 1) === FACE_COLOR.White &&
        cube.at("U", 1, 2) === FACE_COLOR.White &&
        cube.at("U", 1, 0) !== FACE_COLOR.White
      ) {
        return "U'"
      } if (
        cube.at("U", 2, 1) === FACE_COLOR.White &&
        cube.at("U", 1, 2) === FACE_COLOR.White &&
        cube.at("U", 1, 0) === FACE_COLOR.White
      ) {
        return "U2"
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
        return "U"
      } if (
        cube.at("U", 0, 1) === FACE_COLOR.White &&
        cube.at("U", 1, 0) === FACE_COLOR.White &&
        cube.at("U", 1, 2) !== FACE_COLOR.White
      ) {
        return "U'"
      } if (
        cube.at("U", 0, 1) === FACE_COLOR.White &&
        cube.at("U", 1, 0) === FACE_COLOR.White &&
        cube.at("U", 1, 2) === FACE_COLOR.White
      ) {
        return "U2"
      }
    }

    return null;
  }

  function getDAdjustmentForRandL(cube: RubikCube): RubikCubeMoveNotation | null {
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
        return "D"
      } if (
        cube.at("D", 0, 1) === FACE_COLOR.White &&
        cube.at("D", 1, 0) === FACE_COLOR.White &&
        cube.at("D", 1, 2) !== FACE_COLOR.White
      ) {
        return "D'"
      } if (
        cube.at("D", 0, 1) === FACE_COLOR.White &&
        cube.at("D", 1, 0) === FACE_COLOR.White &&
        cube.at("D", 1, 2) === FACE_COLOR.White
      ) {
        return "D2"
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
        return "D"
      } if (
        cube.at("D", 2, 1) === FACE_COLOR.White &&
        cube.at("D", 1, 2) === FACE_COLOR.White &&
        cube.at("D", 1, 0) !== FACE_COLOR.White
      ) {
        return "D'"
      } if (
        cube.at("D", 2, 1) === FACE_COLOR.White &&
        cube.at("D", 1, 2) === FACE_COLOR.White &&
        cube.at("D", 1, 0) === FACE_COLOR.White
      ) {
        return "D2"
      }
    }

    return null;
  }

  // ➀ F талд байгаа цагаан ирмэгүүдийг шилжүүлэх
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

  // ➁ R талд байгаа цагаан ирмэгүүдийг шилжүүлэх
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

  // ➂ B талд байгаа цагаан ирмэгүүдийг шилжүүлэх
  const whiteEdgesB: SolvingIndex = [
    { face: "B", x: 0, y: 1, moves: ["B'","R", "B"] },
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

  // ➃ L талд байгаа цагаан ирмэгүүдийг шилжүүлэх
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
      const [face, x, y] = key.split(",") as [RubikCubeFaceName, RubikCubeFaceXIndex, RubikCubeFaceYIndex];

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
  }

  return movesResult;
}

// 🔥 Турших жишээ
console.log("Solving White Cross...");
const moves = solveWhiteCross(scrambledCube);
console.log("Moves: ", moves.join(" "));

export default moves;