// **Read the README first!**

import { Stmt } from "./AST";
import { parseStmt } from "./SyntaxAnalysis";
import { Scope, runProgram } from "./Execution";
import { clearOutput } from "./Library/Runtime";

// This is our highest-level interpreter function, which does the work of
// chaining together the syntax analysis phase and the execution phase.
export function runInterpreter(source: string): void {
  clearOutput();
  const prog: Stmt = parseStmt(source);
  runProgram(prog);
}


// ******************
// * EXERCISE 1 START
// ******************

// In src/Execution/Statement.ts, replace the "unimplemented" error in the "assert" case
// with code to interpret an *assertion statement*.

// Review the README for the overall behavior of the assertion statement that
// you should implement.

// For example:

//   { assert true; print 1; } should print 1 without throwing any error
//   { assert false; print 1; } should throw an AssertionError without printing
//   { assert 1; print 1; } should throw a DynamicTypeError without printing
//   { print 1; assert false; } should print 1 and then throw an AssertionError
//   { print 1; assert 1; } should print 1 and then throw a DynamicTypeError

// You must throw the correct type of error in each case to get full points,
// but your specific error message will not be graded.

// ****************
// * EXERCISE 1 END
// ****************


// ******************
// * EXERCISE 2 START
// ******************

// In src/Execution/Expression.ts, replace the "unimplemented" error in the 
// "conditional" case with code to interpret a *conditional expression*.

// Review the README for the overall behavior of the conditional operator that
// you should implement.

// If the first expression is not a boolean, your code should throw a
// DynamicTypeError: for example, "1 ? 2 : 3" is invalid.

// The second and third expressions may be different types: "true ? 2 : false"
// is valid.

// You must throw the correct type of error in each case to get full points,
// but your specific error message will not be graded.

// ****************
// * EXERCISE 2 END
// ****************


// ******************
// * EXERCISE 3 START
// ******************

// In src/Execution/Statement.ts, replace the "unimplemented" error in the "for" case
// with code to interpret a *for loop*.

// Review the README for the overall behavior of the conditional operator that
// you should implement. Make sure you understand the scoping requirements!

// If the condition expression is not a boolean, your code should throw a
// DynamicTypeError: for example, "for (x = 1; 2; x = x + 1) print x;" is
// invalid.

// You must throw the correct type of error in each case to get full points,
// but your specific error message will not be graded.

// ****************
// * EXERCISE 3 END
// ****************
