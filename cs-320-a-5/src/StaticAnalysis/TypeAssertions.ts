import { SourceType } from "../AST";

export class StaticTypeError extends Error { }

export function assertType(expected: SourceType, actual: SourceType): void {
  if (expected != actual)
    throw new StaticTypeError(
      "expected type " + expected +
      ", got type " + actual
    );
}
