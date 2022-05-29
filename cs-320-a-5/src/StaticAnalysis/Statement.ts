// Statements don't produce *values*, so we don't have any need of type
// inference for them beyond what we already have for expressions.

// Instead, when we typecheck a statement, we just look for errors, and in the
// success case we exit with no errors.

// This is reflected by the void return type of typecheckStmt: success means
// returning nothing instead of throwing an error!

import { SourceType, Stmt, Value } from "../AST";

import { Scope, lookup, namesInScope, declare, undeclare } from "./Scope";
import { StaticTypeError, assertType } from "./TypeAssertions";
import { inferExprType, inferValueType } from "./Expression";
import { ImplType } from "../AST/Type";

export function typecheckStmt(scope: Scope, stmt: Stmt): void {
  switch (stmt.tag) {
    // The varDecl case looks almost identical to the same case in the
    // execution code: we just store the type of the expression instead of its
    // value.
    case "varDecl": {
      const initialExprType = inferExprType(scope, stmt.initialExpr);
      declare(stmt.name, initialExprType, scope);
      break;
    }

    // The varUpdate case is a little different than in the execution code:
    // instead of modifying the scope, we **check** the scope to find the type
    // of the variable, and then use that to check the expression being used to
    // update the variable.
    case "varUpdate": {
      const varType = lookup(stmt.name, scope);
      const newExprType = inferExprType(scope, stmt.newExpr);
      assertType(varType, newExprType);
      break;
    }

    // The print statement can take any type of expression, but it must be a
    // well-typed expression! Without this call to inferExprType, our
    // typechecker would fail to throw an error on a statement like
    // "print 1 + true;".
    case "print":
      inferExprType(scope, stmt.printExpr);
      break;

    // The block statement case looks almost identical to the same case in the
    // execution code: we just typecheck each statement in the block instead
    // of executing it.
    case "block": {
      const outerScopeVarNames: Set<string> = namesInScope(scope);

      for (const blockStmt of stmt.blockStmts)
        typecheckStmt(scope, blockStmt);

      for (const varName of scope.keys())
        if (!outerScopeVarNames.has(varName))
          undeclare(varName, scope);

      break;
    }

    // The if statement case looks similar to the execution code, but there is
    // a very notable difference: it always checks *both* branches, because
    // without executing the code we don't know whether the condition will be
    // true or false. Note how this code also makes sure that variables defined
    // in the true branch are not in scope in the false branch.
    case "if": {
      const conditionType = inferExprType(scope, stmt.condition);
      assertType("bool", conditionType);

      const outerScopeVarNames: Set<string> = namesInScope(scope);

      typecheckStmt(scope, stmt.trueBranch);

      for (const varName of scope.keys())
        if (!outerScopeVarNames.has(varName))
          undeclare(varName, scope);

      if (stmt.falseBranch != null) {
        const outerScopeVarNames: Set<string> = namesInScope(scope);

        typecheckStmt(scope, stmt.falseBranch);

        for (const varName of scope.keys())
          if (!outerScopeVarNames.has(varName))
            undeclare(varName, scope);
      }

      break;
    }

    // The while statement case is another demonstration of the power of
    // typechecking: we typecheck the body of the loop, but **exactly once**.
    // There's no need to predict more than one iteration of the loop, because
    // we know nothing will be a different *type* on any further iteration.
    // This means that we can even typecheck infinite loops in finite time.
    case "while": {
      const outerScopeVarNames: Set<string> = namesInScope(scope);

      const conditionType = inferExprType(scope, stmt.condition);
      assertType("bool", conditionType);
      typecheckStmt(scope, stmt.body);

      for (const varName of scope.keys())
        if (!outerScopeVarNames.has(varName))
          undeclare(varName, scope);

      break;
    }

    case "switch":{
      const outerScopeVarNames: Set<string> = namesInScope(scope);
      const scrut = inferExprType(scope, stmt.scrutinee)
      for(let [value, body] of stmt.valueCases.entries())
      {
        const innerScopeVarNames: Set<string> = namesInScope(scope)
        let vt = inferValueType(value)
        if (vt != scrut)
          StaticTypeError
        
          typecheckStmt(scope, body)
          for(const finder of scope.keys())
            if(!innerScopeVarNames.has(finder))
              undeclare(finder, scope)
      }
      for (const finder of scope.keys())
        if(!outerScopeVarNames.has(finder))
          undeclare(finder, scope)

      break;
    }
  }
}
