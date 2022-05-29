import { Expr } from "../Expression";

import {
  dynamicAssertNum, dynamicAssertBool, SourceType, staticAssertType
} from "../Type";
import { Value } from "./Value";
import { FuncScope, VarTypeScope, VarValueScope } from "../Scope";

export abstract class PrefixExpr implements Expr {
  readonly subexpr: Expr;

  constructor(subexpr: Expr) {
    this.subexpr = subexpr;
  }

  protected abstract operatorSymbol(): string;

  protected abstract typecheckingRule(
    subexprType: SourceType,
  ): SourceType;

  protected abstract executionRule(
    subexprValue: Value,
  ): Value;

  toString(): string {
    const subexprStr = this.subexpr.toString();
    return "(" + this.operatorSymbol + subexprStr + ")"
  }

  inferType(funcScope: FuncScope, varScope: VarTypeScope): SourceType {
    const subexprType = this.subexpr.inferType(funcScope, varScope);
    return this.typecheckingRule(subexprType);
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): Value {
    const subexprValue = this.subexpr.interpret(funcScope, varScope);
    return this.executionRule(subexprValue);
  }
}

export class NegateExpr extends PrefixExpr {
  protected operatorSymbol(): string {
    return "-";
  }

  protected typecheckingRule(subexprType: SourceType): SourceType {
    staticAssertType("num", subexprType);
    return "num";
  }

  protected executionRule(subexprValue: Value): Value {
    dynamicAssertNum(subexprValue);
    return - subexprValue;
  }
}

export class NotExpr extends PrefixExpr {
  protected operatorSymbol(): string {
    return "!";
  }

  protected typecheckingRule(subexprType: SourceType): SourceType {
    staticAssertType("bool", subexprType);
    return "bool";
  }

  protected executionRule(subexprValue: Value): Value {
    dynamicAssertBool(subexprValue);
    return ! subexprValue;
  }
}