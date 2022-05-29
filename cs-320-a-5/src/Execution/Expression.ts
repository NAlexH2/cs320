import { Expr, Value } from "../AST";
import { input } from "../Library/Runtime";

import { Scope, lookup } from "./Scope";
import { assertNum, assertBool, assertSameType } from "./TypeAssertions";

export function interpretExpr(
  scope: Scope,
  expr: Expr
): Value {
  switch (expr.tag) {
    case "plus": {
      const leftValue = interpretExpr(scope, expr.leftSubexpr);
      const rightValue = interpretExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue + rightValue;
    }

    case "minus": {
      const leftValue = interpretExpr(scope, expr.leftSubexpr);
      const rightValue = interpretExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue - rightValue;
    }

    case "times": {
      const leftValue = interpretExpr(scope, expr.leftSubexpr);
      const rightValue = interpretExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue * rightValue;
    }

    case "divide": {
      const leftValue = interpretExpr(scope, expr.leftSubexpr);
      const rightValue = interpretExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue / rightValue;
    }

    case "exponent": {
      const leftValue = interpretExpr(scope, expr.leftSubexpr);
      const rightValue = interpretExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue ** rightValue;
    }

    case "and": {
      const leftValue = interpretExpr(scope, expr.leftSubexpr);
      const rightValue = interpretExpr(scope, expr.rightSubexpr);
      switch (typeof leftValue) {
        case "number": assertNum(rightValue); return leftValue & rightValue;
        case "boolean": assertBool(rightValue); return leftValue && rightValue;
      }
    }

    case "or": {
      const leftValue = interpretExpr(scope, expr.leftSubexpr);
      const rightValue = interpretExpr(scope, expr.rightSubexpr);
      switch (typeof leftValue) {
        case "number": assertNum(rightValue); return leftValue | rightValue;
        case "boolean": assertBool(rightValue); return leftValue || rightValue;
      }
    }

    case "lessThan": {
      const leftValue = interpretExpr(scope, expr.leftSubexpr);
      const rightValue = interpretExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue < rightValue;
    }

    case "equal": {
      const leftValue = interpretExpr(scope, expr.leftSubexpr);
      const rightValue = interpretExpr(scope, expr.rightSubexpr);
      assertSameType(leftValue, rightValue);
      return leftValue == rightValue;
    }

    case "negate": {
      const value = interpretExpr(scope, expr.subexpr);
      assertNum(value);
      return - value;
    }

    case "not": {
      const value = interpretExpr(scope, expr.subexpr);
      assertBool(value);
      return ! value;
    }

    case "input":
      return input(expr.type);

    case "var":
      return lookup(expr.name, scope);

    case "num":
    case "bool":
      return expr.value;
  }
}
