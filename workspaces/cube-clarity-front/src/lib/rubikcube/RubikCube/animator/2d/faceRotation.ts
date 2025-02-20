import type { RotateTo } from "../../MoveNotation";
import { cornerCubeTween } from "./corner";
import { edgeCubeTween } from "./edge";
import type { CalculatedCubeCoordinate2d } from "./mod";

// deno-fmt-ignore
export const faceRotation2d = (rotateDirection: RotateTo, progress: number, ): [
  [CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d],
  [CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d],
  [CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d],
] => {
  switch (rotateDirection) {
    case 'clockwise':
      return [
        [
          cornerCubeTween("UL", "UR", progress, "clockwise"), edgeCubeTween("U", "R", progress, "clockwise"), cornerCubeTween("UR", "DR", progress, "clockwise")
        ], [
          edgeCubeTween("L", "U", progress, "clockwise"),     {degree: 0, x: 0, y: 0},                        edgeCubeTween("R", "D", progress, "clockwise")
        ], [
          cornerCubeTween("DL", "UL", progress, "clockwise"), edgeCubeTween("D", "L", progress, "clockwise"), cornerCubeTween("DR", "DL", progress, "clockwise")
        ]
      ];
    case 'counterclockwise':
      return [
        [
          cornerCubeTween("UL", "DL", progress, "counterclockwise"), edgeCubeTween("U", "L", progress, "counterclockwise"), cornerCubeTween("UR", "UL", progress, "counterclockwise")
        ], [
          edgeCubeTween("L", "D", progress, "counterclockwise"),     {degree: 0, x: 0, y: 0},                               edgeCubeTween("R", "U", progress, "counterclockwise")
        ], [
          cornerCubeTween("DL", "DR", progress, "counterclockwise"), edgeCubeTween("D", "R", progress, "counterclockwise"), cornerCubeTween("DR", "UR", progress, "counterclockwise")
        ]
      ];
    case 'diagonal':
      return [
        [
          cornerCubeTween("UL", "DR", progress, "clockwise"), edgeCubeTween("U", "D", progress, "clockwise"), cornerCubeTween("UR", "DL", progress, "clockwise")
        ], [
          edgeCubeTween("L", "R", progress, "clockwise"),     {degree: 0, x: 0, y: 0},                               edgeCubeTween("R", "L", progress, "clockwise")
        ], [
          cornerCubeTween("DL", "UR", progress, "clockwise"), edgeCubeTween("D", "U", progress, "clockwise"), cornerCubeTween("DR", "UL", progress, "clockwise")
        ]
      ]
  }
};
