// **Read the README first!**

import { Stmt } from "./AST";
import { parseStmt } from "./SyntaxAnalysis";
import { typecheckStmt } from "./StaticAnalysis";
import { Scope, runProgram } from "./Execution";
import { clearOutput } from "./Library/Runtime";

export function runTypechecker(source: string): void {
  const prog: Stmt = parseStmt(source);
  typecheckStmt(new Map(), prog);
}

export function runInterpreter(source: string): void {
  clearOutput();
  const prog: Stmt = parseStmt(source);
  runProgram(prog);
}

// ********************
// * EXERCISE 1 START *
// ********************

// In src/StaticAnalysis/Expression.ts, replace the "unimplemented" error in
// the "lessThan" case with code to typecheck the < operator.

// The < operator requires both of its operands to be numbers, and its result
// is a **boolean** (not a number!).

// This is just a warm-up exercise to get you reading the code, it should be
// pretty straightforward.

// ******************
// * EXERCISE 1 END *
// ******************


// ********************
// * EXERCISE 2 START *
// ********************

// In src/StaticAnalysis/Expression.ts, there is code to typecheck the && and
// || operators. In this provided code both operands to these operators are
// required to be booleans, and the result is always a boolean.

// In src/Execution/Expression.ts, you'll see that the execution phase actually
// supports using the && and || operators with numbers as well as booleans, as
// explained in the README.

// This means that the provided typechecking code is *incomplete*, because it
// will throw a StaticTypeError on an expression like "1 && 2", which has no
// chance of throwing a DynamicTypeError at runtime.

// Modify the provided code for the "and" and "or" case in inferExprType to
// support numbers as well as booleans. For both operators, if both operands
// are the same type, the result should also be that type; if the two operands
// are different types, your code should throw a StaticTypeError. See the
// README for an example of using && with number operands.

// As usual, the specific error message you provide will not be graded, your
// code just needs to throw the correct type of error to get full points.

// ******************
// * EXERCISE 2 END *
// ******************


// ********************
// * EXERCISE 3 START *
// ********************

// In src/StaticAnalysis/Statement.ts, there is no code to typecheck switch
// statements.

// This means that the provided typechecking code is *unsound*, because it will
// not throw a StaticTypeError on a statement like this (or many others) which
// will throw a DynamicTypeError:
//   switch (1 + true) {
//     default: print 1 && true;
//   }

// Add a case for the "switch" tag to typecheck the SwitchStmt AST node type.
// Review the README for the definition of how the switch statement should
// behave in typechecking.

// In TypeScript, to loop over the cases in a SwitchStmt, you can use this
// pattern, which you can find an example of in src/SyntaxAnalysis.ts:
//   for (const [value, body] of stmt.valueCases.entries()) {
//     // value: Value
//     // body: Stmt
//   }

// The names "value" and "body" are variable *declarations* in this pattern, so
// you can choose whatever names you want as long as you use the names
// consistently within the loop body.

// The solution to this exercise isn't too complicated, but there are a couple
// subtle details. Pay close attention to where variable names should go in and
// out of scope, and make sure you understand the pattern of "undeclaring" that
// happens in the "block", "if", and "while" cases.

// ******************
// * EXERCISE 3 END *
// ******************
