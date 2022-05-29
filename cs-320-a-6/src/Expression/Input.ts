import { Expr } from "../Expression";
import { VarValueScope, VarTypeScope, FuncScope } from "../Scope";
import { SourceType } from "../Type";
import { Value } from "./Value";
import { input } from "../Library/Runtime";

export class InputExpr implements Expr {
  readonly inputType: SourceType;

  constructor(inputType: SourceType) {
    this.inputType = inputType;
  }

  toString(): string {
    return "input<" + this.inputType + ">";
  }

  inferType(funcScope: FuncScope, varScope: VarTypeScope): SourceType {
    return this.inputType;
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): Value {
    return input(this.inputType);
  }
}