import { Expr, Value } from "../Expression";
import { VarValueScope, VarTypeScope, FuncScope } from "../Scope";
import { CallStmt } from "../Statement";
import { SourceType, StaticTypeError, DynamicTypeError } from "../Type";

export class CallExpr extends CallStmt implements Expr {
  inferType(funcScope: FuncScope, varScope: VarTypeScope): SourceType {
    const returnType = this.typecheck(funcScope, varScope);
    if (returnType == "void")
      throw new StaticTypeError("void function called as expression: " + this.funcName);
    return returnType;
  }

  override interpret(funcScope: FuncScope, varScope: VarValueScope): Value {
    const value = super.interpret(funcScope, varScope);
    if (value == null)
      throw new DynamicTypeError("void function called as expression: " + this.funcName);
    return value;
  }
}