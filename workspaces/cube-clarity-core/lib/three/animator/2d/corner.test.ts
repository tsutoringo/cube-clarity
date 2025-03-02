import { describe, expect, it } from "vitest";
import {
  CORNER_CUBE_POSITIONS,
  type CornerCubeName,
  cornerCubeTween,
} from "./corner.ts";

describe.each(
  [
    ["UL", "UR"],
    ["UR", "DR"],
    ["DR", "DL"],
    ["DL", "UL"],
    // Reversed
    ["UL", "DL"],
    ["DL", "DR"],
    ["DR", "UR"],
    ["UR", "UL"],
  ] satisfies [a: CornerCubeName, b: CornerCubeName][],
)("cornerTween", (a, b) => {
  it(`from ${a} to ${b} with clockwise, fullprogress`, () => {
    expect(
      Math.round(cornerCubeTween(a, b, 1, "clockwise").x),
    ).equal(
      CORNER_CUBE_POSITIONS[b].x,
    );

    expect(
      Math.round(cornerCubeTween(a, b, 1, "clockwise").y),
    ).equal(
      CORNER_CUBE_POSITIONS[b].y,
    );
  });

  it(`from ${a} to ${b} with counterclockwise, fullprogress`, () => {
    expect(
      Math.round(cornerCubeTween(a, b, 1, "counterclockwise").x),
    ).equal(
      CORNER_CUBE_POSITIONS[b].x,
    );

    expect(
      Math.round(cornerCubeTween(a, b, 1, "counterclockwise").y),
    ).equal(
      CORNER_CUBE_POSITIONS[b].y,
    );
  });

  it(`from ${a} to ${b} with clockwise, noneprogress`, () => {
    expect(
      Math.round(cornerCubeTween(a, b, 0, "clockwise").x),
    ).equal(
      CORNER_CUBE_POSITIONS[a].x,
    );

    expect(
      Math.round(cornerCubeTween(a, b, 0, "clockwise").y),
    ).equal(
      CORNER_CUBE_POSITIONS[a].y,
    );
  });

  it(`from ${a} to ${b} with counterclockwise, noneprogress`, () => {
    expect(
      Math.round(cornerCubeTween(a, b, 0, "counterclockwise").x),
    ).equal(
      CORNER_CUBE_POSITIONS[a].x,
    );

    expect(
      Math.round(cornerCubeTween(a, b, 0, "counterclockwise").y),
    ).equal(
      CORNER_CUBE_POSITIONS[a].y,
    );
  });
});
