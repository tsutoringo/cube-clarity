import { describe, it, assert, expect } from 'vitest';
import { parseMoveNotation, RubikCubeMoveNotation } from './MoveNotation';
import { RubikCube } from './RubikCube';
import { solveRubikCube } from './RubikCubeSolver';
describe.each(
  [
    ["6Y", parseMoveNotation("F R' B R U F' L' F' U2 L' U' D2 B D' F B' U2").unwrap()],
    ["Cage", parseMoveNotation("L U F2 R L' U2 B' U D B2 L F B' R' L F' R").unwrap()],
    ["Advanced Checkerboard", parseMoveNotation("F B2 R' D2 B R U D' R L' D' F' R2 D F2 B'").unwrap()],
    ["6Arrows", parseMoveNotation("D L' U R' B' R B U2 D B D' B' L U D'").unwrap()],
    ["Gift Box", parseMoveNotation("U B2 R2 B2 L2 F2 R2 D' F2 L2 B F' L F2 D U' R2 F' L' R'").unwrap()],
    ["Super Checkerboard", parseMoveNotation("U B2 R2 B2 L2 F2 R2 D' F2 L2 B F' L F2 D U' R2 F' L' R'").unwrap()],
    ["6 Crosses", parseMoveNotation("R2 L' D F2 R' D' R' L U' D R D B2 R' U D2").unwrap()],
    ["Anaconda", parseMoveNotation("L U B' U' R L' B R' F B' D R D' F'").unwrap()],
    ["Super Flip", parseMoveNotation("U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2").unwrap()],
    ["Inverted Column", parseMoveNotation("L2 B2 D' B2 D L2 U R2 D R2 B U R' F2 R U' B' U'").unwrap()],
    ["Python", parseMoveNotation("F2 R' B' U R' L F' L F' B D' R B L2").unwrap()],
    ["Cube in Cube", parseMoveNotation("F L F U' R U F2 L2 U' L' B D' B' L2 U").unwrap()],
    ["Small Spiral", parseMoveNotation("L' B' D U R U' R' D2 R2 D L D' L' R' F U").unwrap()],
    ["Small Cube in Cube", parseMoveNotation("B2 R U2 R' U' R U' R' L' U2 L U L' U L B2").unwrap()],
    ["Large Spiral", parseMoveNotation("F R' U L F' L' F U' R U L' U' L F'").unwrap()],
    ["6T", parseMoveNotation("F2 R2 U2 F' B D2 L2 F B").unwrap()],
    ["Corner Cross", parseMoveNotation("F B' U F U F U L B L2 B' U F' L U L' B").unwrap()],
    ["6U", parseMoveNotation("U' B2 U L2 D L2 R2 D' B' R D' L R' B2 U2 F' L' U'").unwrap()],
    ["Side Stripes", parseMoveNotation("F U F R L2 B D' R D2 L D' B R2 L F U F").unwrap()],
    ["3Cycle Edges", parseMoveNotation("U2 L U' D F R2 L U D' B' D2 F2 L2 U' F2 R2 B2 D F2 L2").unwrap()],
  ] as [name: string, moves: RubikCubeMoveNotation[]][],
)("Resolve cubes", (name, moves) => {
  it(`Solving ${name}`, () => {
    const scrambledCube = RubikCube.withMoveNotation(moves);
    const solvings = solveRubikCube(scrambledCube);

    const patchedCube = scrambledCube
      .rotateCube(solvings.step1moves)
      .rotateCube(solvings.step2moves)
      .rotateCube(solvings.step3moves)
      .rotateCube(solvings.step4moves)
      .rotateCube(solvings.step5moves)
      .rotateCube(solvings.step6moves)
      .rotateCube(solvings.step7moves);

    if (
      !patchedCube.equal(
        RubikCube.default()
      )
    ) {
      console.log("scramble:           ", moves.join(' '));
      console.log("solveWhiteCross:    ", solvings.step1moves.join(' '));
      console.log("solveWhiteLayer:    ", solvings.step2moves.join(' '));
      console.log("solveSecondLayer:   ", solvings.step3moves.join(' '));
      console.log("solveYellowCross:   ", solvings.step4moves.join(' '));
      console.log("solveCrossColor:    ", solvings.step5moves.join(' '));
      console.log("solveYellowCorners: ", solvings.step6moves.join(' '));
      console.log("step7moves:         ", solvings.step7moves.join(' '));
      console.log(patchedCube.net())
    };

    expect(true).equal(
      patchedCube.equal(
        RubikCube.default()
      ),
    )
  });
});