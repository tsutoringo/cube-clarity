import { Result } from '@result/result';
import { CubeState } from '@cube-clarity/core';

class ApiError extends Error {}

export type DetectfaceResult = Result<CubeState, ApiError>;

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const detectCube = async (): Promise<DetectfaceResult> => {
  const response = await fetch("//localhost:8000/detectface");
  if (!response.ok) {
    return Result.err(new ApiError("Api error"));
  }

  while (true) {
    const response = await fetch("//localhost:8000/getface");

    if (response.ok) {
      return Result.ok(await response.json());
    }

    if (response.status === 404) {
      return Result.err(new ApiError("detectface が 開始されてません。"));
    }

    await sleep(1000);
  }
};
