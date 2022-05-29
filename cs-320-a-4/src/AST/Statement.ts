import { Tag, Name } from "./Tag";
import { Expr } from "./Expression";

// Our type of statement ASTs uses the same kind of pattern that we use to
// define our type of expression ASTs, but statements and expressions are very
// different things! We will see in the execution phase code why it's important
// to have a separate expression type and statement type.
export type Stmt =
  VarDeclStmt | VarUpdateStmt | PrintStmt | AssertStmt |
  BlockStmt | IfStmt | ForStmt;


// We could reuse the PrefixExpr type to represent the Expr field here, but for
// clarity, we give this Expr field a name that indicates its purpose in the
// execution phase: its value is the initial value of the variable being
// declared.
export type VarDeclStmt = Tag<"varDecl"> & Name & {
  initialExpr: Expr;
};

// Similarly, the value of this Expr field is the new value of the variable
// being updated.
export type VarUpdateStmt = Tag<"varUpdate"> & Name & {
  newExpr: Expr;
};

export type PrintStmt = Tag<"print"> & {
  printExpr: Expr;
};

export type AssertStmt = Tag<"assert"> & {
  condition: Expr;
};

// A block statement node has an array of substatements.
export type BlockStmt = Tag<"block"> & {
  readonly blockStmts: Stmt[];
};

// An if statement node may or may not have a false branch.
export type IfStmt = Tag<"if"> & {
  readonly condition: Expr;
  readonly trueBranch: Stmt;
  readonly falseBranch: Stmt | null;
};

export type ForStmt = Tag<"for"> & Name & {
  readonly initialExpr: Expr;
  readonly condition: Expr;
  readonly update: Stmt;
  readonly body: Stmt;
};
