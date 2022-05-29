import { FuncScope, VarValueScope, VarTypeScope } from "./Scope";

export interface Stmt {
  typecheck(funcScope: FuncScope, varScope: VarTypeScope): void;
  interpret(funcScope: FuncScope, varScope: VarValueScope): void;
  toString(indentLevel?: number): string;
}

export function indentation(indentLevel: number) {
  return "\t".repeat(indentLevel);
}

export { BlockStmt } from "./Statement/Block";
export { IfStmt } from "./Statement/Conditional";
export { CallStmt } from "./Statement/Function"
export { WhileStmt } from "./Statement/Loop";
export { PrintStmt } from "./Statement/Print";
export { VarDeclStmt, VarUpdateStmt } from "./Statement/Variable";