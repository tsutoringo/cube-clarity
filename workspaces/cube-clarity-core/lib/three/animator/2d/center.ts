import type { RotateDirection } from "./mod.ts";

export const centerCubeTween = (
  rotatoTo: number,
  progress: number,
  direction: RotateDirection,
) => {
  const currentRotation = rotatoTo * progress;
  return direction === "clockwise" ? -currentRotation : currentRotation;
};
