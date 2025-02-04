import { Result } from "@result/result";
import { RubikCube } from "./RubikCube";

export class RubikCubeError extends Error {
}

export class RubikCubeDecodeError extends RubikCubeError {
  constructor(length: number) {
    super(
      `Expected Rubik Cube uint8Array ${RubikCube.RUBIK_CUBE_ENCODED_DATA_LENGTH}. But got ${length}`,
    );
  }
}

export type RubikCubeResult<T> = Result<T, RubikCubeError>;
