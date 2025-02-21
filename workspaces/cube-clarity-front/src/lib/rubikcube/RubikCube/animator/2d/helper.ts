import type {
  CalculatedCubeCoordinate2d,
  CubeCoordinate2d,
  RotateDirection,
} from "./mod";
import { MathUtils } from "three";

export type Coordnate2d = {
  x: number;
  y: number;
};

/**
 * radian と degree の x, y を返す
 * @param radius
 * @param degree
 * @returns
 */
export const calculateCoord2d = (
  radius: number,
  degree: number,
): Coordnate2d => {
  // 始点をずらし回転方向を逆にする
  const rad = MathUtils.degToRad(degree);
  const x = radius * Math.cos(rad);
  const y = radius * Math.sin(rad);

  return {
    x,
    y,
  };
};

/**
 * @param _from
 * @param _to
 * @param progress 0 ~ 1
 */
export const rubikCubeTween = <T extends Record<string, CubeCoordinate2d>>(
  positions: T,
  radius: number,
  _from: keyof T,
  _to: keyof T,
  progress: number,
  direction: RotateDirection,
): CalculatedCubeCoordinate2d => {
  const from = positions[_from];
  const to = positions[_to];

  // 相対角度
  const degreeDiff = direction === "clockwise"
    ? -((360 - to.degree) + from.degree) % 360
    : ((360 - from.degree) + to.degree) % 360;

  const currentDegreeDiffProgress = degreeDiff * progress;

  const degree = direction === "clockwise"
    ? (360 + (from.degree + currentDegreeDiffProgress)) % 360
    : (from.degree + currentDegreeDiffProgress) % 360;

  const { x, y } = calculateCoord2d(radius, degree);

  return {
    degree: currentDegreeDiffProgress,
    x,
    y,
  };
};
