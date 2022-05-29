import { Expr, Value } from "./Expression";
import { VarValueScope, VarTypeScope, FuncScope } from "./Scope";
import { newEmptyVarScope } from "./Factories";
import { BlockStmt } from "./Statement";
import { SourceType, ReturnType, staticAssertType, StaticTypeError, DynamicTypeError } from "./Type";

export type Param = {
  readonly name: string;
  readonly type: SourceType;
}

export class Func {
  readonly name: string;
  readonly returnType: ReturnType;
  readonly parameters: readonly Param[];
  readonly body: BlockStmt;
  readonly returnExpr: Expr | null;

  constructor(
    name: string,
    returnType: ReturnType,
    parameters: Param[],
    body: BlockStmt,
    returnExpr: Expr | null
  ) {
    const proto = new.target.prototype;
    this.name = name;
    this.returnType = returnType;
    this.parameters = parameters;
    this.body = body;
    this.returnExpr = returnExpr;
    Object.setPrototypeOf(this, proto);
  }

  toString(): string {
    const paramStrings: string[] = [];
    for (const param of this.parameters)
      paramStrings.push(param.type + " " + param.name);

    const bodyStrings: string[] = [];
    for (const stmt of this.body.blockStmts)
      bodyStrings.push(stmt.toString(1));

    return (
      this.returnType + " " + this.name + "(" +
      paramStrings.join(", ") +
      ") {\n" +
      bodyStrings.join("\n") + (bodyStrings.length == 0 ? "" : "\n") +
      (
        this.returnExpr == null
          ? "  return"
          : "  return " + this.returnExpr.toString()
      ) +
      ";\n}"
    );
  }

  typecheckDefinition(funcScope: FuncScope): void {
    const localVarScope: VarTypeScope = newEmptyVarScope();

    for (const param of this.parameters)
      localVarScope.declare(param.name, param.type);

    this.body.typecheck(funcScope, localVarScope);

    if (this.returnExpr != null) {
      const returnExprType = this.returnExpr.inferType(funcScope, localVarScope);
      staticAssertType(this.returnType, returnExprType);
    }
  }

  typecheckCall(
    funcScope: FuncScope,
    varScope: VarTypeScope,
    argExprs: readonly Expr[]
  ): void {
    if (this.parameters.length != argExprs.length)
      throw new StaticTypeError(
        "wrong number of arguments in call to function: " + this.name
      );
    for (const [i, param] of this.parameters.entries())
      staticAssertType(param.type, argExprs[i].inferType(funcScope, varScope));
  }

  interpretCall(
    funcScope: FuncScope,
    varScope: VarValueScope,
    argExprs: readonly Expr[]
  ): Value | null {
    if (this.parameters.length != argExprs.length)
      throw new DynamicTypeError(
        "wrong number of arguments in call to function: " + this.name
      );

    const callScope: VarValueScope = newEmptyVarScope();
    for (const [i, param] of this.parameters.entries())
      callScope.declare(
        param.name,
        argExprs[i].interpret(funcScope, varScope)
      );

    this.body.interpret(funcScope, callScope);

    return (
      this.returnExpr != null
        ? this.returnExpr.interpret(funcScope, callScope)
        : null
    );
  }
};