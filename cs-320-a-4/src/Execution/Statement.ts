// This code is all new, so read through it carefully!

import { Stmt, Value } from "../AST";
import { exprToString } from "../SyntaxAnalysis"; // used in error messages

// To implement our print statement, we pull in a function from our *runtime*,
// which provides primitive operations for interacting with the host platform
// our code is running on. In this case, it gives us a way to write values out
// to a section of the webpage.
import { printLine } from "../Library/Runtime";

// Some of our statements modify the current scope.
import { Scope, namesInScope, declare, update, undeclare } from "./Scope";

// Some of our statements contain expressions.
import { interpretExpr } from "./Expression";
import { assertBool, assertNum } from "./TypeAssertions";

// This is the error type for our "assert" statements, represented by the
// AssertStmt node type.
export class AssertionError extends Error { }


// This function is similar to interpretExpr, but note one very important
// difference: it has a void return type instead of Value. This is the defining
// difference between an *expression* and a *statement*, and the reason why we
// separate them into two AST types.
export function interpretStmt(
  scope: Scope,
  stmt: Stmt
): void {
  switch (stmt.tag) {
    case "varDecl": {
      // To declare a variable, we have to interpret the provided expression in
      // order to obtain the initial value of the variable.
      const initialValue: Value = interpretExpr(scope, stmt.initialExpr);
      declare(stmt.name, initialValue, scope);
      break;
    }

    case "varUpdate": {
      // Similarly, to update a variable, we have to interpret the provided
      // expression in order to obtain the new value of the variable.
      const initialValue: Value = interpretExpr(scope, stmt.newExpr);
      update(stmt.name, initialValue, scope);
      break;
    }

    case "print": {
      const printValue: Value = interpretExpr(scope, stmt.printExpr);
      printLine(printValue);
      break;
    }

    case "assert": {
      const boolValue: Value = interpretExpr(scope, stmt.condition);
      assertBool(boolValue);
      if (boolValue == false)
        throw new AssertionError()
      break;
    }

    case "block": {
      // **This is a very important pattern to pay attention to!**

      // In this line, we save a copy of the variable names that are currently
      // *in scope*. This includes any variable previously declared outside of
      // this block.
      const outerScopeVarNames: Set<string> = namesInScope(scope);

      // Now we execute each statement of the array, which might add new
      // variable names into scope.
      for (const blockStmt of stmt.blockStmts)
        interpretStmt(scope, blockStmt);

      // Finally, to "clean up", we **remove** every variable that was out of
      // scope when the block began.
      for (const varName of scope.keys())
        if (!outerScopeVarNames.has(varName))
          undeclare(varName, scope);

      break;
    }

    case "if": {
      // The same pattern of "cleaning up" applies to an if statement: any
      // variables declared within the true branch or false branch are out of
      // scope after the end of the branch.
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

    case "for": {
      //Track the value we start with
      const initialV: Value = interpretExpr(scope, stmt.initialExpr)

      //declare somewhere in our data name and it's value
      declare(stmt.name, initialV, scope)

      //since we've declared name somewhere, we can access the condition
      const condV: Value = interpretExpr(scope, stmt.condition)
      
      //Verify our bool is a bool
      assertBool(condV)

      //interpretExpr actually increments our loop each time we call it
      //some how... This I'm still not clear on but it's what I was told.
      while(interpretExpr(scope, stmt.condition))
      {
        //See the `if` comments as to why we do this const and the for loop
        const outerScopeVarNames: Set<string> = new Set(scope.keys())

        //Do the work
        interpretStmt(scope, stmt.body)

        //see previous `if`
        for (const varName of scope.keys())
          if (!outerScopeVarNames.has(varName))
            undeclare(varName, scope);

        //update our statements information (the "x" so to speak)
        interpretStmt(scope, stmt.update)
      }

      //make sure we clear the declared done immediately following initialV
      undeclare(stmt.name, scope)
      break;
    }
  }
}
