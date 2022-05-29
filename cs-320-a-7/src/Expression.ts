import { FuncScope, VarTypeScope, VarValueScope } from "./Scope";
import { SourceType } from "./Type";
import { Value } from "./Expression/Value";

export interface Expr {
  inferType(funcScope: FuncScope, varScope: VarTypeScope): SourceType;
  interpret(funcScope: FuncScope, varScope: VarValueScope): Value;
  toString(): string;
}

export { CallExpr } from "./Expression/Function";

export {
  InfixExpr,
  PlusExpr, MinusExpr, TimesExpr, DivideExpr, ExponentExpr,
  AndExpr, OrExpr, EqualExpr
} from "./Expression/Infix";

export { PrefixExpr, NotExpr, NegateExpr } from "./Expression/Prefix";
export { InputExpr } from "./Expression/Input";
export { Value, BoolLeaf, NumLeaf } from "./Expression/Value"
export { VarLeaf } from "./Expression/Variable"