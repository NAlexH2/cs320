import "jest-extended";

import { Value } from "../AST";
import { AssertionError, interpretStmt } from "./Statement";
import { Scope, ScopeError, declare } from "./Scope";
import { DynamicTypeError } from "./TypeAssertions";

test("assertion statement test", () => {
  const scope: Scope = new Map();

  interpretStmt(scope, {
    tag: "assert",
    condition: { tag: "bool", value: true }
  })

  expect(scope).toEqual(new Map());

  expect(() => interpretStmt(scope, {
    tag: "assert",
    condition: { tag: "bool", value: false }
  })).toThrow(AssertionError);

  expect(scope).toEqual(new Map());

  expect(() => interpretStmt(scope, {
    tag: "assert",
    condition: { tag: "num", value: 1 }
  })).toThrow(DynamicTypeError);

  expect(scope).toEqual(new Map());

  expect(() => interpretStmt(scope, {
    tag: "assert",
    condition: {
      tag: "and",
      leftSubexpr: { tag: "bool", value: true },
      rightSubexpr: { tag: "bool", value: false }
    }
  })).toThrow(AssertionError);

  expect(scope).toEqual(new Map());

  expect(() => interpretStmt(scope, {
    tag: "assert",
    condition: {
      tag: "and",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "bool", value: false }
    }
  })).toThrow(DynamicTypeError);

  expect(scope).toEqual(new Map());

  declare("x", 1, scope);
  declare("y", true, scope);

  expect(() => interpretStmt(scope, {
    tag: "assert",
    condition: {
      tag: "and",
      leftSubexpr: { tag: "var", name: "x" },
      rightSubexpr: { tag: "bool", value: false }
    }
  })).toThrow(DynamicTypeError);

  expect(scope).toEqual(new Map<string, Value>([["x", 1], ["y", true]]));

  expect(() => interpretStmt(scope, {
    tag: "assert",
    condition: {
      tag: "and",
      leftSubexpr: { tag: "var", name: "y" },
      rightSubexpr: { tag: "bool", value: false }
    }
  })).toThrow(AssertionError);

  expect(scope).toEqual(new Map<string, Value>([["x", 1], ["y", true]]));

  interpretStmt(scope, {
    tag: "assert",
    condition: {
      tag: "and",
      leftSubexpr: { tag: "var", name: "y" },
      rightSubexpr: { tag: "bool", value: true }
    }
  })

  expect(scope).toEqual(new Map<string, Value>([["x", 1], ["y", true]]));
});

test("for statement test", () => {
  const scope: Scope = new Map();

  interpretStmt(scope, {
    tag: "for",
    name: "x",
    initialExpr: { tag: "num", value: 1 },
    condition: {
      tag: "lessThan",
      leftSubexpr: { tag: "var", name: "x" },
      rightSubexpr: { tag: "num", value: 10 }
    },
    update: {
      tag: "varUpdate",
      name: "x",
      newExpr: {
        tag: "plus",
        leftSubexpr: { tag: "var", name: "x" },
        rightSubexpr: { tag: "num", value: 1 }
      }
    },
    body: {
      tag: "block",
      blockStmts: []
    }
  })

  expect(scope).toEqual(new Map());

  interpretStmt(scope, {
    tag: "block",
    blockStmts: [
      {
        tag: "varDecl",
        name: "a",
        initialExpr: { tag: "num", value: 10 }
      },
      {
        tag: "for",
        name: "x",
        initialExpr: { tag: "num", value: 1 },
        condition: {
          tag: "lessThan",
          leftSubexpr: { tag: "var", name: "x" },
          rightSubexpr: { tag: "num", value: 10 }
        },
        update: {
          tag: "varUpdate",
          name: "x",
          newExpr: {
            tag: "plus",
            leftSubexpr: { tag: "var", name: "x" },
            rightSubexpr: { tag: "num", value: 1 }
          }
        },
        body: {
          tag: "block",
          blockStmts: [
            {
              tag: "varUpdate",
              name: "a",
              newExpr: {
                tag: "minus",
                leftSubexpr: { tag: "var", name: "a" },
                rightSubexpr: { tag: "num", value: 1 }
              }
            }
          ]
        }
      }
    ]
  })

  expect(scope).toEqual(new Map());

  scope.set("a", 10);

  interpretStmt(scope, {
    tag: "for",
    name: "x",
    initialExpr: { tag: "num", value: 1 },
    condition: {
      tag: "lessThan",
      leftSubexpr: { tag: "var", name: "x" },
      rightSubexpr: { tag: "num", value: 10 }
    },
    update: {
      tag: "varUpdate",
      name: "x",
      newExpr: {
        tag: "plus",
        leftSubexpr: { tag: "var", name: "x" },
        rightSubexpr: { tag: "num", value: 1 }
      }
    },
    body: {
      tag: "block",
      blockStmts: [
        {
          tag: "varUpdate",
          name: "a",
          newExpr: {
            tag: "minus",
            leftSubexpr: { tag: "var", name: "a" },
            rightSubexpr: { tag: "num", value: 1 }
          }
        }
      ]
    }
  });

  expect(scope).toEqual(new Map<string, Value>([["a", 1]]));

  scope.delete("a");

  expect(() => interpretStmt(scope, {
    tag: "block",
    blockStmts: [
      {
        tag: "varDecl",
        name: "x",
        initialExpr: { tag: "num", value: 100 }
      },
      {
        tag: "for",
        name: "x",
        initialExpr: { tag: "num", value: 1 },
        condition: {
          tag: "lessThan",
          leftSubexpr: { tag: "var", name: "x" },
          rightSubexpr: { tag: "num", value: 10 }
        },
        update: {
          tag: "varUpdate",
          name: "x",
          newExpr: {
            tag: "plus",
            leftSubexpr: { tag: "var", name: "x" },
            rightSubexpr: { tag: "num", value: 1 }
          }
        },
        body: {
          tag: "block",
          blockStmts: [
            {
              tag: "varUpdate",
              name: "a",
              newExpr: {
                tag: "minus",
                leftSubexpr: { tag: "var", name: "a" },
                rightSubexpr: { tag: "num", value: 1 }
              }
            }
          ]
        }
      }
    ]
  })).toThrowError(ScopeError);

  expect(scope).toEqual(new Map<string, Value>([["x", 100]]));

  scope.delete("x");

  expect(() => interpretStmt(scope, {
    tag: "block",
    blockStmts: [
      {
        tag: "varDecl",
        name: "a",
        initialExpr: { tag: "num", value: 0 }
      },
      {
        tag: "for",
        name: "x",
        initialExpr: { tag: "num", value: 1 },
        condition: {
          tag: "lessThan",
          leftSubexpr: { tag: "var", name: "x" },
          rightSubexpr: { tag: "num", value: 10 }
        },
        update: {
          tag: "varUpdate",
          name: "x",
          newExpr: {
            tag: "plus",
            leftSubexpr: { tag: "var", name: "x" },
            rightSubexpr: { tag: "num", value: 1 }
          }
        },
        body: {
          tag: "for",
          name: "x",
          initialExpr: { tag: "num", value: 1 },
          condition: {
            tag: "lessThan",
            leftSubexpr: { tag: "var", name: "x" },
            rightSubexpr: { tag: "num", value: 10 }
          },
          update: {
            tag: "varUpdate",
            name: "x",
            newExpr: {
              tag: "plus",
              leftSubexpr: { tag: "var", name: "x" },
              rightSubexpr: { tag: "num", value: 1 }
            }
          },
          body: {
            tag: "block",
            blockStmts: []
          }
        }
      }
    ]
  })).toThrowError(ScopeError);

  expect(scope).toEqual(new Map<string, Value>([["a", 0], ["x", 1]]));

  scope.delete("a");
  scope.delete("x");

  scope.set("a", 0);

  interpretStmt(scope, {
    tag: "for",
    name: "x",
    initialExpr: { tag: "num", value: 1 },
    condition: {
      tag: "lessThan",
      leftSubexpr: { tag: "var", name: "x" },
      rightSubexpr: { tag: "num", value: 4 }
    },
    update: {
      tag: "varUpdate",
      name: "x",
      newExpr: {
        tag: "plus",
        leftSubexpr: { tag: "var", name: "x" },
        rightSubexpr: { tag: "num", value: 1 }
      }
    },
    body: {
      tag: "for",
      name: "y",
      initialExpr: { tag: "num", value: 1 },
      condition: {
        tag: "lessThan",
        leftSubexpr: { tag: "var", name: "y" },
        rightSubexpr: { tag: "num", value: 5 }
      },
      update: {
        tag: "varUpdate",
        name: "y",
        newExpr: {
          tag: "plus",
          leftSubexpr: { tag: "var", name: "y" },
          rightSubexpr: { tag: "num", value: 1 }
        }
      },
      body: {
        tag: "block",
        blockStmts: [
          {
            tag: "varDecl",
            name: "n",
            initialExpr: {
              tag: "times",
              leftSubexpr: { tag: "var", name: "x" },
              rightSubexpr: { tag: "var", name: "y" }
            }
          },
          {
            tag: "varUpdate",
            name: "a",
            newExpr: {
              tag: "plus",
              leftSubexpr: { tag: "var", name: "a" },
              rightSubexpr: { tag: "var", name: "n" }
            }
          }
        ]
      }
    }
  });

  expect(scope).toEqual(new Map<string, Value>([["a", 60]]));

  scope.delete("a");
});
