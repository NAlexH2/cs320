import { Value } from "./Expression/Value";

export type ImplType = {
  "num": number;
  "bool": boolean;
};

export type SourceType = "num" | "bool";
export type ReturnType = SourceType | "void";


export class StaticTypeError extends Error { }

export function staticAssertType(expected: ReturnType, actual: ReturnType): void {
  if (expected != actual)
    throw new StaticTypeError(
      "expected type " + expected +
      ", got type " + actual
    );
}


export class DynamicTypeError extends Error { }

export function dynamicAssertNum(value: Value): asserts value is number {
  if (typeof value != "number")
    throw new DynamicTypeError("expected number, got " + value.toString());
}

export function dynamicAssertBool(value: Value): asserts value is boolean {
  if (typeof value != "boolean")
    throw new DynamicTypeError("expected boolean, got " + value.toString());
}

export function dynamicAssertSameType(
  value1: Value,
  value2: Value
): asserts value2 is typeof value1 {
  if (typeof value1 != typeof value2)
    throw new DynamicTypeError(
      "expected same types, got " + value1.toString() +
      " and " + value2.toString()
    );
}
