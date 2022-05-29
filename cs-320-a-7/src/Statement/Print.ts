import { Expr } from "../Expression";
import { VarValueScope, VarTypeScope, FuncScope } from "../Scope";
import { Stmt } from "../Statement";
import { printLine } from "../Library/Runtime";

export class PrintStmt implements Stmt {
  readonly printExpr: Expr;

  constructor(printExpr: Expr) {
    this.printExpr = printExpr;
  }

  toString() {
    return "print " + this.printExpr.toString() + ";";
  }

  typecheck(funcScope: FuncScope, varScope: VarTypeScope): void {
    this.printExpr.inferType(funcScope, varScope);
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): void {
    const printValue = this.printExpr.interpret(funcScope, varScope);
    printLine(printValue);
  }
}