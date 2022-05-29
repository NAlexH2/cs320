import "jest-extended";

import { Value } from "../AST";
import { interpretExpr } from "./Expression";
import { Scope, declare } from "./Scope";
import { DynamicTypeError } from "./TypeAssertions";

test("conditional expression test", () => {
  const scope: Scope = new Map();

  expect(interpretExpr(scope, {
    tag: "conditional",
    condition: { tag: "bool", value: true },
    trueExpr: { tag: "num", value: 2 },
    falseExpr: { tag: "num", value: 3 }
  })).toEqual(2);

  expect(scope).toEqual(new Map());

  expect(interpretExpr(scope, {
    tag: "conditional",
    condition: { tag: "bool", value: false },
    trueExpr: { tag: "num", value: 2 },
    falseExpr: { tag: "num", value: 3 }
  })).toEqual(3);

  expect(scope).toEqual(new Map());

  expect(() => interpretExpr(scope, {
    tag: "conditional",
    condition: { tag: "num", value: 0 },
    trueExpr: { tag: "num", value: 2 },
    falseExpr: { tag: "num", value: 3 }
  })).toThrowError(DynamicTypeError);

  expect(scope).toEqual(new Map());

  expect(interpretExpr(scope, {
    tag: "conditional",
    condition: {
      tag: "and",
      leftSubexpr: { tag: "bool", value: true },
      rightSubexpr: { tag: "bool", value: false }
    },
    trueExpr: { tag: "num", value: 10 },
    falseExpr: { tag: "num", value: 100 }
  })).toEqual(100);

  expect(scope).toEqual(new Map());

  expect(interpretExpr(scope, {
    tag: "conditional",
    condition: {
      tag: "or",
      leftSubexpr: {
        tag: "and",
        leftSubexpr: { tag: "bool", value: true },
        rightSubexpr: { tag: "bool", value: false }
      },
      rightSubexpr: {
        tag: "or",
        leftSubexpr: { tag: "bool", value: false },
        rightSubexpr: { tag: "bool", value: true }
      }
    },
    trueExpr: { tag: "num", value: 10 },
    falseExpr: { tag: "num", value: 100 }
  })).toEqual(10);

  expect(scope).toEqual(new Map());

  expect(() => interpretExpr(scope, {
    tag: "conditional",
    condition: {
      tag: "or",
      leftSubexpr: {
        tag: "and",
        leftSubexpr: { tag: "bool", value: true },
        rightSubexpr: { tag: "bool", value: false }
      },
      rightSubexpr: {
        tag: "or",
        leftSubexpr: { tag: "num", value: 1 },
        rightSubexpr: { tag: "bool", value: true }
      }
    },
    trueExpr: { tag: "num", value: 10 },
    falseExpr: { tag: "num", value: 100 }
  })).toThrowError(DynamicTypeError);

  expect(scope).toEqual(new Map());

  expect(() => interpretExpr(scope, {
    tag: "conditional",
    condition: {
      tag: "or",
      leftSubexpr: {
        tag: "and",
        leftSubexpr: { tag: "bool", value: true },
        rightSubexpr: { tag: "bool", value: false }
      },
      rightSubexpr: {
        tag: "or",
        leftSubexpr: { tag: "num", value: 1 },
        rightSubexpr: { tag: "bool", value: true }
      }
    },
    trueExpr: {
      tag: "plus",
      leftSubexpr: {
        tag: "times",
        leftSubexpr: { tag: "num", value: 3 },
        rightSubexpr: { tag: "num", value: 30 }
      },
      rightSubexpr: {
        tag: "exponent",
        leftSubexpr: { tag: "num", value: 1 },
        rightSubexpr: { tag: "bool", value: true }
      }
    },
    falseExpr: {
      tag: "minus",
      leftSubexpr: {
        tag: "divide",
        leftSubexpr: { tag: "num", value: 3 },
        rightSubexpr: { tag: "num", value: 30 }
      },
      rightSubexpr: {
        tag: "plus",
        leftSubexpr: { tag: "num", value: 1 },
        rightSubexpr: { tag: "num", value: 2 }
      }
    }
  })).toThrowError(DynamicTypeError);

  expect(scope).toEqual(new Map());

  expect(interpretExpr(scope, {
    tag: "conditional",
    condition: {
      tag: "or",
      leftSubexpr: {
        tag: "and",
        leftSubexpr: { tag: "bool", value: true },
        rightSubexpr: { tag: "bool", value: false }
      },
      rightSubexpr: {
        tag: "or",
        leftSubexpr: { tag: "bool", value: false },
        rightSubexpr: { tag: "bool", value: true }
      }
    },
    trueExpr: {
      tag: "plus",
      leftSubexpr: {
        tag: "times",
        leftSubexpr: { tag: "num", value: 3 },
        rightSubexpr: { tag: "num", value: 30 }
      },
      rightSubexpr: {
        tag: "exponent",
        leftSubexpr: { tag: "num", value: 1 },
        rightSubexpr: { tag: "num", value: 2 }
      }
    },
    falseExpr: {
      tag: "minus",
      leftSubexpr: {
        tag: "divide",
        leftSubexpr: { tag: "num", value: 3 },
        rightSubexpr: { tag: "num", value: 30 }
      },
      rightSubexpr: {
        tag: "plus",
        leftSubexpr: { tag: "num", value: 1 },
        rightSubexpr: { tag: "num", value: 2 }
      }
    }
  })).toEqual(91)

  expect(scope).toEqual(new Map());

  declare("x", 1, scope);
  declare("y", true, scope);

  expect(() => interpretExpr(scope, {
    tag: "conditional",
    condition: { tag: "var", name: "x" },
    trueExpr: { tag: "num", value: 2 },
    falseExpr: { tag: "num", value: 3 }
  })).toThrowError(DynamicTypeError);

  expect(scope).toEqual(new Map<string, Value>([["x", 1], ["y", true]]));

  expect(interpretExpr(scope, {
    tag: "conditional",
    condition: { tag: "var", name: "y" },
    trueExpr: { tag: "num", value: 2 },
    falseExpr: { tag: "num", value: 3 }
  })).toEqual(2);

  expect(scope).toEqual(new Map<string, Value>([["x", 1], ["y", true]]));

  scope.delete("x");
  scope.delete("y");
});
