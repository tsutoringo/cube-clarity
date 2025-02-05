import { map } from "@core/iterutil/pipe";
import { pipe } from "@core/pipe";
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

export const rubikCubeNet = (colors: Iterable<string>) => {
  const prettyColors = pipe(
    colors,
    map<string, string>((str) => {
      return str.padStart(2);
    }),
    Array.from,
  ) as string[];
  // deno-fmt-ignore ヤメてね！
  return `
         ┌──┬──┬──┐
         │${prettyColors[0]}│${prettyColors[1]}│${prettyColors[2]}│
         ├──┼──┼──┤
         │${prettyColors[3]}│${prettyColors[4]}│${prettyColors[5]}│
         ├──┼──┼──┤
         │${prettyColors[6]}│${prettyColors[7]}│${prettyColors[8]}│
┌──┬──┬──┼──┼──┼──┼──┬──┬──┬──┬──┬──┐
│${prettyColors[36]}│${prettyColors[37]}│${prettyColors[38]}│${prettyColors[18]}│${prettyColors[19]}│${prettyColors[20]}│${prettyColors[45]}│${prettyColors[46]}│${prettyColors[47]}│${prettyColors[27]}│${prettyColors[28]}│${prettyColors[29]}│
├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤
│${prettyColors[39]}│${prettyColors[40]}│${prettyColors[41]}│${prettyColors[21]}│${prettyColors[22]}│${prettyColors[23]}│${prettyColors[48]}│${prettyColors[49]}│${prettyColors[50]}│${prettyColors[30]}│${prettyColors[31]}│${prettyColors[32]}│
├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤
│${prettyColors[42]}│${prettyColors[43]}│${prettyColors[44]}│${prettyColors[24]}│${prettyColors[25]}│${prettyColors[26]}│${prettyColors[51]}│${prettyColors[52]}│${prettyColors[53]}│${prettyColors[33]}│${prettyColors[34]}│${prettyColors[35]}│
└──┴──┴──┼──┼──┼──┼──┴──┴──┴──┴──┴──┘
         │${prettyColors[9]}│${prettyColors[10]}│${prettyColors[11]}│
         ├──┼──┼──┤
         │${prettyColors[12]}│${prettyColors[13]}│${prettyColors[14]}│
         ├──┼──┼──┤
         │${prettyColors[15]}│${prettyColors[16]}│${prettyColors[17]}│
         └──┴──┴──┘
`;
};
