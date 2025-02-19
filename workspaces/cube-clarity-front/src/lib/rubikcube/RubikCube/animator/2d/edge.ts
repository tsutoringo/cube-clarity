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
export const EDGE_CUBE_POSITIONS = {
  U: {
    degree: 90,
    x: 0,
    y: 1,
  },
  L: {
    degree: 180,
    x: -1,
    y: 0,
  },
  D: {
    degree: 270,
    x: 0,
    y: -1,
  },
  R: {
    degree: 360,
    x: 1,
    y: 0,
  },
} as const satisfies Record<string, CubeCoordinate2d>;
export type EdgeCubeName = keyof typeof EDGE_CUBE_POSITIONS;

/**
 * @param _from
 * @param _to
 * @param progress 0 ~ 1
 */
export const edgeCubeTween = (
  from: EdgeCubeName,
  to: EdgeCubeName,
  progress: number,
  direction: RotateDirection,
) => {
  return rubikCubeTween(
    EDGE_CUBE_POSITIONS,
    1,
    from,
    to,
    progress,
    direction,
  );
};
