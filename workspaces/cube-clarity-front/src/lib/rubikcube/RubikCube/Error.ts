import { Result } from "@result/result";

export class RubikCubeError extends Error {
}

export type RubikCubeResult<T> = Result<T, RubikCubeError>;
