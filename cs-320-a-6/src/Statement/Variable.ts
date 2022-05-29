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

export class VarDeclStmt implements Stmt {
  readonly varName: string;
  readonly initialExpr: Expr;

  constructor(varName: string, initialExpr: Expr) {
    this.varName = varName;
    this.initialExpr = initialExpr;
  }

  typecheck(funcScope: FuncScope, varScope: VarTypeScope): void {
    const initialType = this.initialExpr.inferType(funcScope, varScope);
    varScope.declare(this.varName, initialType);
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): void {
    const initialValue = this.initialExpr.interpret(funcScope, varScope);
    varScope.declare(this.varName, initialValue);
  }
}

export class VarUpdateStmt implements Stmt {
  readonly varName: string;
  readonly newExpr: Expr;

  constructor(varName: string, newExpr: Expr) {
    this.varName = varName;
    this.newExpr = newExpr;
  }

  typecheck(funcScope: FuncScope, varScope: VarTypeScope): void {
    const newType = this.newExpr.inferType(funcScope, varScope);
    varScope.update(this.varName, newType);
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): void {
    const newValue = this.newExpr.interpret(funcScope, varScope);
    varScope.update(this.varName, newValue);
  }
}