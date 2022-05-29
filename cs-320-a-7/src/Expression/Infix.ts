import { Expr } from "../Expression";

import {
  SourceType,
  staticAssertType,
  dynamicAssertBool, dynamicAssertNum, dynamicAssertSameType
} from "../Type";
import { Value } from "./Value";
import { FuncScope, VarTypeScope, VarValueScope } from "../Scope";

export abstract class InfixExpr implements Expr {
  readonly leftSubexpr: Expr;
  readonly rightSubexpr: Expr;

  constructor(
    leftSubexpr: Expr,
    rightSubexpr: Expr
  ) {
    this.leftSubexpr = leftSubexpr;
    this.rightSubexpr = rightSubexpr;
  }

  protected abstract operatorString(): string;

  protected abstract typecheckingRule(
    leftSubexprType: SourceType,
    rightSubexprType: SourceType
  ): SourceType;

  protected abstract executionRule(
    leftSubexprValue: Value,
    rightSubexprValue: Value
  ): Value;

  toString(): string {
    const leftStr = this.leftSubexpr.toString();
    const rightStr = this.rightSubexpr.toString();
    return "(" + leftStr + this.operatorString() + rightStr + ")";
  }

  inferType(funcScope: FuncScope, varScope: VarTypeScope): SourceType {
    const leftType = this.leftSubexpr.inferType(funcScope, varScope);
    const rightType = this.rightSubexpr.inferType(funcScope, varScope);
    return this.typecheckingRule(leftType, rightType);
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): Value {
    const leftValue = this.leftSubexpr.interpret(funcScope, varScope);
    const rightValue = this.rightSubexpr.interpret(funcScope, varScope);
    return this.executionRule(leftValue, rightValue);
  }
}

abstract class NumInfixExpr extends InfixExpr {
  protected typecheckingRule(
    leftSubexprType: SourceType,
    rightSubexprType: SourceType
  ): SourceType {
    staticAssertType("num", leftSubexprType);
    staticAssertType("num", rightSubexprType);
    return "num";
  }

  protected abstract numExecutionRule(
    leftSubexprValue: number,
    rightSubexprValue: number
  ): number;

  protected executionRule(
    leftSubexprValue: Value,
    rightSubexprValue: Value
  ): Value {
    dynamicAssertNum(leftSubexprValue);
    dynamicAssertNum(rightSubexprValue);
    return this.numExecutionRule(leftSubexprValue, rightSubexprValue);
  }
}

abstract class BoolInfixExpr extends InfixExpr {
  protected typecheckingRule(
    leftSubexprType: SourceType,
    rightSubexprType: SourceType
  ): SourceType {
    staticAssertType("bool", leftSubexprType);
    staticAssertType("bool", rightSubexprType);
    return "bool";
  }

  protected abstract boolExecutionRule(
    leftSubexprValue: boolean,
    rightSubexprValue: boolean
  ): boolean;

  protected executionRule(
    leftSubexprValue: Value,
    rightSubexprValue: Value
  ): Value {
    dynamicAssertBool(leftSubexprValue);
    dynamicAssertBool(rightSubexprValue);
    return this.boolExecutionRule(leftSubexprValue, rightSubexprValue);
  }
}

export class PlusExpr extends NumInfixExpr {
  protected operatorString(): string {
    return "+";
  }

  protected numExecutionRule(
    leftSubexprValue: number,
    rightSubexprValue: number
  ): number {
    dynamicAssertNum(leftSubexprValue);
    dynamicAssertNum(rightSubexprValue);
    return leftSubexprValue + rightSubexprValue;
  }
}

export class MinusExpr extends NumInfixExpr {
  protected operatorString(): string {
    return "-";
  }

  protected numExecutionRule(
    leftSubexprValue: number,
    rightSubexprValue: number
  ): number {
    dynamicAssertNum(leftSubexprValue);
    dynamicAssertNum(rightSubexprValue);
    return leftSubexprValue - rightSubexprValue;
  }
}

export class TimesExpr extends NumInfixExpr {
  protected operatorString(): string {
    return "*";
  }

  protected numExecutionRule(
    leftSubexprValue: number,
    rightSubexprValue: number
  ): number {
    return leftSubexprValue * rightSubexprValue;
  }
}

export class DivideExpr extends NumInfixExpr {
  protected operatorString(): string {
    return "/";
  }

  protected numExecutionRule(
    leftSubexprValue: number,
    rightSubexprValue: number
  ): number {
    return leftSubexprValue / rightSubexprValue;
  }
}

export class ExponentExpr extends NumInfixExpr {
  protected operatorString(): string {
    return "^";
  }

  protected numExecutionRule(
    leftSubexprValue: number,
    rightSubexprValue: number
  ): number {
    return leftSubexprValue ** rightSubexprValue;
  }
}

export class AndExpr extends BoolInfixExpr {
  protected operatorString(): string {
    return "&&";
  }

  protected boolExecutionRule(
    leftSubexprValue: boolean,
    rightSubexprValue: boolean
  ): boolean {
    return leftSubexprValue && rightSubexprValue;
  }
}

export class OrExpr extends BoolInfixExpr {
  protected operatorString(): string {
    return "||";
  }

  protected boolExecutionRule(
    leftSubexprValue: boolean,
    rightSubexprValue: boolean
  ): boolean {
    return leftSubexprValue || rightSubexprValue;
  }
}

export class EqualExpr extends InfixExpr {
  protected operatorString(): string {
    return "==";
  }

  protected typecheckingRule(
    leftSubexprType: SourceType,
    rightSubexprType: SourceType
  ): SourceType {
    staticAssertType(leftSubexprType, rightSubexprType);
    return "bool";
  }

  protected executionRule(
    leftSubexprValue: Value,
    rightSubexprValue: Value
  ): Value {
    dynamicAssertSameType(leftSubexprValue, rightSubexprValue);
    return leftSubexprValue == rightSubexprValue;
  }
}