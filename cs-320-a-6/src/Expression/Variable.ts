import { Expr } from "../Expression";
import { FuncScope, VarTypeScope, VarValueScope } from "../Scope";
import { SourceType } from "../Type";
import { Value } from "./Value";

export class VarLeaf implements Expr {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  inferType(funcScope: FuncScope, varScope: VarTypeScope): SourceType {
    return varScope.lookup(this.name);
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): Value {
    return varScope.lookup(this.name);
  }
}