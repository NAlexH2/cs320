import "jest-extended";

import { Scope, StaticTypeError, inferExprType } from "../StaticAnalysis";

test("lessThan test", () => {
  const scope: Scope = new Map();

  expect(inferExprType(scope, {
    tag: "lessThan",
    leftSubexpr: { tag: "num", value: 1 },
    rightSubexpr: { tag: "num", value: 2 },
  })).toEqual("bool");

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "lessThan",
    leftSubexpr: { tag: "bool", value: true },
    rightSubexpr: { tag: "num", value: 2 },
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "lessThan",
    leftSubexpr: { tag: "num", value: 1 },
    rightSubexpr: { tag: "bool", value: false },
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "lessThan",
    leftSubexpr: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 1 },
    },
    rightSubexpr: { tag: "bool", value: false },
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "lessThan",
    leftSubexpr: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 1 },
    },
    rightSubexpr: {
      tag: "and",
      leftSubexpr: { tag: "bool", value: false },
      rightSubexpr: { tag: "bool", value: true },
    },
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  expect(inferExprType(scope, {
    tag: "lessThan",
    leftSubexpr: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 2 },
    },
    rightSubexpr: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 3 },
      rightSubexpr: { tag: "num", value: 4 },
    },
  })).toEqual("bool");

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "lessThan",
    leftSubexpr: {
      tag: "lessThan",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 2 },
    },
    rightSubexpr: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 3 },
      rightSubexpr: { tag: "num", value: 4 },
    },
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());
});

test("and/or expression test", () => {
  const scope: Scope = new Map();

  expect(inferExprType(scope, {
    tag: "and",
    leftSubexpr: { tag: "bool", value: true },
    rightSubexpr: { tag: "bool", value: false }
  })).toEqual("bool");

  expect(scope).toEqual(new Map());

  expect(inferExprType(scope, {
    tag: "or",
    leftSubexpr: { tag: "bool", value: true },
    rightSubexpr: { tag: "bool", value: false }
  })).toEqual("bool");

  expect(scope).toEqual(new Map());

  expect(inferExprType(scope, {
    tag: "and",
    leftSubexpr: { tag: "num", value: 1 },
    rightSubexpr: { tag: "num", value: 2 }
  })).toEqual("num");

  expect(scope).toEqual(new Map());

  expect(inferExprType(scope, {
    tag: "or",
    leftSubexpr: { tag: "num", value: 1 },
    rightSubexpr: { tag: "num", value: 2 }
  })).toEqual("num");

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "and",
    leftSubexpr: { tag: "num", value: 1 },
    rightSubexpr: { tag: "bool", value: false }
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "or",
    leftSubexpr: { tag: "num", value: 1 },
    rightSubexpr: { tag: "bool", value: false }
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "and",
    leftSubexpr: { tag: "bool", value: false },
    rightSubexpr: { tag: "num", value: 1 }
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "or",
    leftSubexpr: { tag: "bool", value: false },
    rightSubexpr: { tag: "num", value: 1 }
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "or",
    leftSubexpr: { tag: "bool", value: false },
    rightSubexpr: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 2 },
    }
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "or",
    leftSubexpr: {
      tag: "or",
      leftSubexpr: { tag: "bool", value: false },
      rightSubexpr: {
        tag: "plus",
        leftSubexpr: { tag: "num", value: 1 },
        rightSubexpr: { tag: "num", value: 2 }
      }
    },
    rightSubexpr: {
      tag: "and",
      leftSubexpr: { tag: "bool", value: false },
      rightSubexpr: { tag: "bool", value: false }
    }
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  expect(() => inferExprType(scope, {
    tag: "and",
    leftSubexpr: {
      tag: "or",
      leftSubexpr: { tag: "bool", value: false },
      rightSubexpr: {
        tag: "plus",
        leftSubexpr: { tag: "num", value: 1 },
        rightSubexpr: { tag: "num", value: 2 }
      }
    },
    rightSubexpr: {
      tag: "and",
      leftSubexpr: { tag: "bool", value: false },
      rightSubexpr: { tag: "bool", value: false }
    }
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  expect(inferExprType(scope, {
    tag: "and",
    leftSubexpr: {
      tag: "or",
      leftSubexpr: { tag: "bool", value: false },
      rightSubexpr: {
        tag: "lessThan",
        leftSubexpr: { tag: "num", value: 1 },
        rightSubexpr: { tag: "num", value: 2 }
      }
    },
    rightSubexpr: {
      tag: "and",
      leftSubexpr: { tag: "bool", value: false },
      rightSubexpr: { tag: "bool", value: false }
    }
  })).toEqual("bool");

  expect(scope).toEqual(new Map());

  expect(inferExprType(scope, {
    tag: "and",
    leftSubexpr: {
      tag: "or",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: {
        tag: "minus",
        leftSubexpr: { tag: "num", value: 2 },
        rightSubexpr: { tag: "num", value: 3 }
      }
    },
    rightSubexpr: {
      tag: "times",
      leftSubexpr: { tag: "num", value: 4 },
      rightSubexpr: { tag: "num", value: 5 }
    }
  })).toEqual("num");

  expect(scope).toEqual(new Map());
});
