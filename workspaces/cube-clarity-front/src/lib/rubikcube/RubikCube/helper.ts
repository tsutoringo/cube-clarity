import { Result } from "@result/result";

export type PickResultInner<R extends Result<unknown, unknown>> = R extends
  Result<infer T, infer E> ? {
    value: T;
    error: E;
  }
  : unknown;

export const collectResult = <
  R extends Result<unknown, unknown>,
  T = PickResultInner<R>["value"],
  E = PickResultInner<R>["error"],
>(iterable: Iterable<R>): Result<T[], E> => {
  const it = iterable[Symbol.iterator]();
  const collected: T[] = [];

  while (true) {
    const { done, value } = it.next();
    if (done) {
      break;
    }

    if (value.isErr()) {
      return Result.err(value.unwrapErr() as E);
    } else {
      collected.push(value.unwrap() as T);
    }
  }

  return Result.ok(collected);
};
