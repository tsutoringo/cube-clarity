import type { Result } from "@result/result";
import { RubikCube } from "./RubikCube.ts";

export class RubikCubeError extends Error {
}

export class RubikCubeDecodeError extends RubikCubeError {
  constructor(length: number) {
    super(
      `Expected Rubik Cube uint8Array ${RubikCube.RUBIK_CUBE_ENCODED_DATA_LENGTH}. But got ${length}`,
    );
  }
}

export class DecodeRubikCubeFaceColorError extends RubikCubeError {
  constructor(colorNumber: number) {
    super(`Unknown rubik cube face color number(${colorNumber}).`);
  }
}

export type RubikCubeResult<T> = Result<T, RubikCubeError>;
