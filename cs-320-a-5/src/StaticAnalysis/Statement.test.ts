import "jest-extended";

import {
  Scope, StaticScopeError, StaticTypeError, typecheckStmt
} from "../StaticAnalysis";

test("switch/case statement test", () => {
  const scope: Scope = new Map();

  typecheckStmt(scope, {
    tag: "switch",
    scrutinee: { tag: "num", value: 1 },
    valueCases: new Map(),
    defaultCase: null
  });

  expect(scope).toEqual(new Map());

  typecheckStmt(scope, {
    tag: "switch",
    scrutinee: { tag: "bool", value: true },
    valueCases: new Map(),
    defaultCase: null
  });

  expect(scope).toEqual(new Map());

  typecheckStmt(scope, {
    tag: "switch",
    scrutinee: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 2 },
    },
    valueCases: new Map(),
    defaultCase: null
  });

  expect(scope).toEqual(new Map());

  expect(() => typecheckStmt(scope, {
    tag: "switch",
    scrutinee: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "bool", value: true },
    },
    valueCases: new Map(),
    defaultCase: null
  })).toThrow(StaticTypeError);

  expect(scope).toEqual(new Map());

  typecheckStmt(scope, {
    tag: "switch",
    scrutinee: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 2 },
    },
    valueCases: new Map([
      [1, {
        tag: "print",
        printExpr: { tag: "bool", value: false }
      }]
    ]),
    defaultCase: null
  });

  expect(scope).toEqual(new Map());

  typecheckStmt(scope, {
    tag: "switch",
    scrutinee: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 2 },
    },
    valueCases: new Map([
      [1, {
        tag: "varDecl",
        name: "x",
        initialExpr: { tag: "bool", value: false }
      }]
    ]),
    defaultCase: null
  });

  expect(scope).toEqual(new Map());

  expect(() => typecheckStmt(scope, {
    tag: "switch",
    scrutinee: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 2 },
    },
    valueCases: new Map([
      [1, {
        tag: "varDecl",
        name: "x",
        initialExpr: { tag: "bool", value: false }
      }],
      [2, {
        tag: "varUpdate",
        name: "x",
        newExpr: { tag: "bool", value: true }
      }]
    ]),
    defaultCase: null
  })).toThrow(StaticScopeError);

  expect(scope).toEqual(new Map());

  expect(() => typecheckStmt(scope, {
    tag: "block",
    blockStmts: [
      {
        tag: "varDecl",
        name: "x",
        initialExpr: { tag: "bool", value: false }
      },
      {
        tag: "switch",
        scrutinee: {
          tag: "plus",
          leftSubexpr: { tag: "num", value: 1 },
          rightSubexpr: { tag: "num", value: 2 },
        },
        valueCases: new Map([
          [1, {
            tag: "varDecl",
            name: "x",
            initialExpr: { tag: "bool", value: false }
          }]
        ]),
        defaultCase: null
      }
    ]
  })).toThrow(StaticScopeError);

  expect(scope).toEqual(new Map([["x", "bool"]]));
  scope.delete("x");

  typecheckStmt(scope, {
    tag: "switch",
    scrutinee: {
      tag: "and",
      leftSubexpr: { tag: "bool", value: false },
      rightSubexpr: { tag: "bool", value: true },
    },
    valueCases: new Map([
      [true, {
        tag: "varDecl",
        name: "x",
        initialExpr: { tag: "bool", value: false }
      }],
      [false, {
        tag: "varDecl",
        name: "x",
        initialExpr: { tag: "num", value: 1 }
      }]
    ]),
    defaultCase: {
      tag: "varDecl",
      name: "x",
      initialExpr: { tag: "bool", value: true }
    }
  });

  expect(scope).toEqual(new Map());
});
