// To keep our files relatively short and organized, the modules for our AST
// types are now split up by their purpose in our language. This module
// re-exports all of the AST node types, to make it more convenient to import
// them in the code for other phases of the interpreter.

// We have a lot of AST node types to define now, so we want to reduce the
// amount of repetitive code in our definitions: in particular, **all** of our
// node types have a tag, and many of our node types follow the common patterns
// of *infix* operators or *prefix* operators.

// To represent these common patterns, we make good use of TypeScript's &
// operator for types. In contrast to the | operator, which represents a value
// that is "this type **or** that type", the & operator represents a value that
// is "this type **and** that type".

// Specifically, when used with object literal types, the & operator simply
// merges two object type definitions together. Consider these two object
// literal types:

//   type Foo = { w: number, x: string };
//   type Bar = { y: string, z: boolean };

// With these definitions of Foo and Bar, these two definitions of the FooBar
// type below have exactly the same meaning.

//   type FooBar = Foo & Bar;
//   type FooBar = { w: number, x: string, y: string, z: boolean };


// The Tag type is a tiny convenience that saves us a couple keystrokes when
// defining types with a "tag" field.
export { Tag } from "./AST/Tag";

// The Expr type is very similar to our LogicTree and AST types from previous
// assignments, just with more supported features.
export {
  Expr, InfixExpr, PrefixExpr, ValueLeaf, Value,
  PlusExpr, MinusExpr, TimesExpr, DivideExpr, ExponentExpr,
  AndExpr, OrExpr, LessThanExpr, EqualExpr,
  NegateExpr, NotExpr,
  ConditionalExpr,
  NumLeaf, BoolLeaf, VarLeaf
} from "./AST/Expression";

// The Stmt type is similar to our Expr type as well, but it's separate for a
// good reason, as we'll see in the execution phase.
export {
  Stmt,
  VarDeclStmt, VarUpdateStmt, PrintStmt, AssertStmt,
  BlockStmt, IfStmt, ForStmt
} from "./AST/Statement";
