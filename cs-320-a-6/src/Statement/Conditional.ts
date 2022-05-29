import { Expr } from "../Expression";
import { VarValueScope, VarTypeScope, FuncScope } from "../Scope";
import { indentation, Stmt } from "../Statement";
import { dynamicAssertBool, staticAssertType } from "../Type";

export class IfStmt implements Stmt {
  readonly condition: Expr;
  readonly trueBranch: Stmt;
  readonly falseBranch: Stmt | null;

  constructor(condition: Expr, trueBranch: Stmt, falseBranch: Stmt | null) {
    this.condition = condition;
    this.trueBranch = trueBranch;
    this.falseBranch = falseBranch;
  }

  toString(indentLevel: number = 0): string {
    const indent = indentation(indentLevel);

    let ifStr = indent + (
      "if (" + this.condition.toString() + ")\n" +
      this.trueBranch.toString(indentLevel + 1)
    );

    if (this.falseBranch != null)
      ifStr += (
        "\n" + indent + "else\n" +
        this.falseBranch.toString(indentLevel + 1)
      );

    return ifStr;
  }

  typecheck(funcScope: FuncScope, varScope: VarTypeScope): void {
    const conditionType = this.condition.inferType(funcScope, varScope);
    staticAssertType("bool", conditionType);

    varScope.pushNestedScope();
    this.trueBranch.typecheck(funcScope, varScope);
    varScope.popNestedScope();

    if (this.falseBranch != null) {
      varScope.pushNestedScope();
      this.falseBranch.typecheck(funcScope, varScope);
      varScope.popNestedScope();
    }
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): void {
    varScope.pushNestedScope();

    const conditionValue = this.condition.interpret(funcScope, varScope);
    dynamicAssertBool(conditionValue);

    if (conditionValue)
      this.trueBranch.interpret(funcScope, varScope);
    else if (this.falseBranch != null)
      this.falseBranch.interpret(funcScope, varScope);
  }
}