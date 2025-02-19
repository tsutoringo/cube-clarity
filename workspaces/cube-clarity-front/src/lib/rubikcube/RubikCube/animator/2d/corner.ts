import { rubikCubeTween } from "./helper.ts";
import { CubeCoordinate2d, RotateDirection } from "./mod.ts";

/**
 * ```plane
 *     -1  0  1
 *    ┌──┬──┬──┐
 * -1 │UL│ U│UR│
 *    ├──┼──┼──┤
 *  0 │ L│  │ R│
 *    ├──┼──┼──┤
 *  1 │BL│ B│BR│
 *    └──┴──┴──┘
 * ```
 */
export const CORNER_CUBE_POSITIONS = {
  UL: {
    degree: 135,
    x: -1,
    y: 1,
  },
  UR: {
    degree: 45,
    x: 1,
    y: 1,
  },
  DR: {
    degree: 315,
    x: 1,
    y: -1,
  },
  DL: {
    degree: 225,
    x: -1,
    y: -1,
  },
} as const satisfies Record<string, CubeCoordinate2d>;
export type CornerCubeName = keyof typeof CORNER_CUBE_POSITIONS;

export const CORNER_CUBE_RADIUS = Math.sqrt(2);

/**
 * @param _from
 * @param _to
 * @param progress 0 ~ 1
 */
export const cornerCubeTween = (
  from: CornerCubeName,
  to: CornerCubeName,
  progress: number,
  direction: RotateDirection,
) => {
  return rubikCubeTween(
    CORNER_CUBE_POSITIONS,
    CORNER_CUBE_RADIUS,
    from,
    to,
    progress,
    direction,
  );
};
