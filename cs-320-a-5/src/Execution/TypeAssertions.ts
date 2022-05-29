import { SourceType, Value } from "../AST";


export class DynamicTypeError extends Error { }


export function assertNum(value: Value): asserts value is number {
  if (typeof value != "number")
    throw new DynamicTypeError("expected number, got " + value.toString());
}

export function assertBool(value: Value): asserts value is boolean {
  if (typeof value != "boolean")
    throw new DynamicTypeError("expected boolean, got " + value.toString());
}

export function assertSameType(
  value1: Value,
  value2: Value
): asserts value2 is typeof value1 {
  if (typeof value1 != typeof value2)
    throw new DynamicTypeError(
      "expected same types, got " + value1.toString() +
      " and " + value2.toString()
    );
}
