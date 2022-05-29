import { Expr, Value } from "../Expression";
import { VarValueScope, VarTypeScope, FuncScope, DispatchError } from "../Scope";
import { Stmt, BlockStmt } from "../Statement";
import { SourceType, ReturnType, staticAssertType, StaticTypeError, DynamicTypeError } from "../Type";

export class CallStmt implements Stmt {
  readonly funcName: string;
  readonly argumentExprs: readonly Expr[];

  constructor(funcName: string, argumentExprs: Expr[]) {
    this.funcName = funcName;
    this.argumentExprs = argumentExprs;
  }

  toString(): string {
    const argStrs: string[] = [];
    for (const argExpr of this.argumentExprs)
      argStrs.push(argExpr.toString());
    return this.funcName + "(" + argStrs.join("") + ")";
  }

  typecheck(funcScope: FuncScope, varScope: VarTypeScope): ReturnType {
    const func = funcScope.dispatch(this.funcName);
    func.typecheckCall(funcScope, varScope, this.argumentExprs);
    return func.returnType;
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): Value | null {
    const func = funcScope.dispatch(this.funcName);
    if (func == null)
      throw new DispatchError(
        "call to undefined function: " + this.funcName
      );

    return func.interpretCall(funcScope, varScope, this.argumentExprs);
  }
}