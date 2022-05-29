import { VarValueScope, VarTypeScope, FuncScope } from "../Scope";
import { indentation, Stmt } from "../Statement";

export class BlockStmt implements Stmt {
  readonly blockStmts: readonly Stmt[];

  constructor(blockStmts: Stmt[]) {
    this.blockStmts = blockStmts;
  }

  toString(indentLevel: number = 0): string {
    const indent = indentation(indentLevel);

    const blockStmtStrings: string[] = [];

    for (const blockStmt of this.blockStmts)
      blockStmtStrings.push(blockStmt.toString(indentLevel + 1));

    return (
      indent + "{\n" +
      blockStmtStrings.join("\n") +
      "\n" + indent + "}"
    );
  }

  typecheck(funcScope: FuncScope, varScope: VarTypeScope): void {
    varScope.pushNestedScope();
    for (const blockStmt of this.blockStmts)
      blockStmt.typecheck(funcScope, varScope);
    varScope.popNestedScope();
  }

  interpret(funcScope: FuncScope, varScope: VarValueScope): void {
    varScope.pushNestedScope();
    for (const blockStmt of this.blockStmts)
      blockStmt.interpret(funcScope, varScope);
    varScope.popNestedScope();
  }
}