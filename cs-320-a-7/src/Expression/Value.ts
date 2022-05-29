import { SourceType } from "../Type";
import { Expr } from "../Expression";
import { FuncScope, VarTypeScope, VarValueScope } from "../Scope";

export type Value = number | boolean;

export abstract class ValueLeaf<ValueType extends Value> implements Expr {
  readonly value: ValueType;

  constructor(value: ValueType) {
    this.value = value;
  }

  abstract inferType(funcScope: FuncScope, varScope: VarTypeScope): SourceType;

  toString(): string {
    return this.value.toString();
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): ValueType {
    return this.value;
  }
}

export class NumLeaf extends ValueLeaf<number> {
  inferType(funcScope: FuncScope, varScope: VarTypeScope): SourceType {
    return "num";
  }
}

export class BoolLeaf extends ValueLeaf<boolean> {
  inferType(funcScope: FuncScope, varScope: VarTypeScope): SourceType {
    return "bool";
  }
}