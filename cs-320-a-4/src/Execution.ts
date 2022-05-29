// Like with our AST types, our execution phase code is broken up into code for
// expressions and statements. This module re-exports the Scope type for
// convenience, and defines the high-level runProgram function.

// Read through the src/Execution folder in this order:
//   - src/Execution/Scope.ts
//   - src/Execution/TypeAssertions.ts
//   - src/Execution/Expression.ts
//   - src/Execution/Statement.ts

// The .test.ts files in the src/Execution folder contain the automated tests
// for this assignment - you're not required to read through them, but you're
// encouraged to try writing your own additional tests.

import { Stmt } from "./AST";

import { Scope } from "./Execution/Scope";
import { interpretStmt } from "./Execution/Statement";

export { Scope };


// This function is a convenient high-level interface to our execution code: it
// creates a new empty scope to run the program in.
export function runProgram(progBody: Stmt): void {
  const scope: Scope = new Map();
  interpretStmt(scope, progBody);
}
