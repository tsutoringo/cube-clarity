import { cornerCubeTween } from "./corner";
import { edgeCubeTween } from "./edge";
import { CalculatedCubeCoordinate2d, RotateDirection } from "./mod";

// deno-fmt-ignore
export const faceRotation2d = (direction: RotateDirection, progress: number): [
  [CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d],
  [CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d],
  [CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d,CalculatedCubeCoordinate2d],
] => {
  // deno-fmt-ignore
  return direction === "clockwise"
    ? [
      [
        cornerCubeTween("UL", "UR", progress, "clockwise"), edgeCubeTween("U", "R", progress, "clockwise"), cornerCubeTween("UR", "DR", progress, "clockwise")
      ], [
        edgeCubeTween("L", "U", progress, "clockwise"),     {degree: 0, x: 0, y: 0},                        edgeCubeTween("R", "D", progress, "clockwise")
      ], [
        cornerCubeTween("DL", "UL", progress, "clockwise"), edgeCubeTween("D", "L", progress, "clockwise"), cornerCubeTween("DR", "DL", progress, "clockwise")
      ]
    ]
    : [
      [
        cornerCubeTween("UL", "DL", progress, "counterclockwise"), edgeCubeTween("U", "L", progress, "counterclockwise"), cornerCubeTween("UR", "UL", progress, "counterclockwise")
      ], [
        edgeCubeTween("L", "D", progress, "counterclockwise"),     {degree: 0, x: 0, y: 0},                               edgeCubeTween("R", "U", progress, "counterclockwise")
      ], [
        cornerCubeTween("DL", "DR", progress, "counterclockwise"), edgeCubeTween("D", "R", progress, "counterclockwise"), cornerCubeTween("DR", "UR", progress, "counterclockwise")
      ]
    ];
};
