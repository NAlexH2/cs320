import { Stmt, Value } from "../AST";
import { exprToString } from "../SyntaxAnalysis"; // used in error messages
import { printLine } from "../Library/Runtime";

import { Scope, namesInScope, declare, update, undeclare } from "./Scope";
import { interpretExpr } from "./Expression";

export function interpretStmt(
  scope: Scope,
  stmt: Stmt
): void {
  switch (stmt.tag) {
    case "varDecl": {
      const initialValue: Value = interpretExpr(scope, stmt.initialExpr);
      declare(stmt.name, initialValue, scope);
      break;
    }

    case "varUpdate": {
      const initialValue: Value = interpretExpr(scope, stmt.newExpr);
      update(stmt.name, initialValue, scope);
      break;
    }

    case "print": {
      const printValue: Value = interpretExpr(scope, stmt.printExpr);
      printLine(printValue);
      break;
    }

    case "block": {
      const outerScopeVarNames: Set<string> = namesInScope(scope);

      for (const blockStmt of stmt.blockStmts)
        interpretStmt(scope, blockStmt);

      for (const varName of scope.keys())
        if (!outerScopeVarNames.has(varName))
          undeclare(varName, scope);

      break;
    }

    case "if": {
      const outerScopeVarNames: Set<string> = new Set(scope.keys());

      const conditionValue: Value = interpretExpr(scope, stmt.condition);
      if (conditionValue)
        interpretStmt(scope, stmt.trueBranch);
      else if (stmt.falseBranch != null)
        interpretStmt(scope, stmt.falseBranch);

      for (const varName of scope.keys())
        if (!outerScopeVarNames.has(varName))
          undeclare(varName, scope);

      break;
    }

    case "while": {
      const outerScopeVarNames: Set<string> = new Set(scope.keys());

      let conditionValue: Value = interpretExpr(scope, stmt.condition);
      while (conditionValue) {
        interpretStmt(scope, stmt.body);
        conditionValue = interpretExpr(scope, stmt.condition);
      }

      for (const varName of scope.keys())
        if (!outerScopeVarNames.has(varName))
          undeclare(varName, scope);

      break;
    }

    case "switch": {
      const outerScopeVarNames: Set<string> = new Set(scope.keys());

      const scrutineeValue: Value = interpretExpr(scope, stmt.scrutinee);
      const body = stmt.valueCases.get(scrutineeValue);

      if (body != null)
        interpretStmt(scope, body);
      else if (stmt.defaultCase != null)
        interpretStmt(scope, stmt.defaultCase);

      for (const varName of scope.keys())
        if (!outerScopeVarNames.has(varName))
          undeclare(varName, scope);

      break;
    }
  }
}
