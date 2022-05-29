import { Expr } from "../Expression";
import { VarValueScope, VarTypeScope, FuncScope } from "../Scope";
import { indentation, Stmt } from "../Statement";
import { dynamicAssertBool, staticAssertType } from "../Type";

export class WhileStmt implements Stmt {
  readonly condition: Expr;
  readonly body: Stmt;

  constructor(condition: Expr, trueBranch: Stmt) {
    this.condition = condition;
    this.body = trueBranch;
  }

  toString(indentLevel: number = 0): string {
    const indent = indentation(indentLevel);
    return indent + (
      "while (" + this.condition.toString() + ")\n" +
      this.body.toString(indentLevel + 1)
    );
  }

  typecheck(funcScope: FuncScope, varScope: VarTypeScope): void {
    const conditionType = this.condition.inferType(funcScope, varScope);
    staticAssertType("bool", conditionType);

    varScope.executeInNestedScope(() => {
      this.body.typecheck(funcScope, varScope);
    });
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): void {
    varScope.executeInNestedScope(() => {
      let conditionValue = this.condition.interpret(funcScope, varScope);
      while (conditionValue) {
        this.body.interpret(funcScope, varScope);
        conditionValue = this.condition.interpret(funcScope, varScope);
      }
    });
  }
}