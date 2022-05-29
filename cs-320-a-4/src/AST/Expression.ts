import { Tag, Name } from "./Tag";

// The naming has changed a little, since we now have both *expressions* and
// *statements* instead of just "nodes" in an AST, but this is effectively the
// same kind of AST type definition we've been seeing in previous assignments.
// Expr is short for "expression".
export type Expr =
  PlusExpr | MinusExpr | TimesExpr | DivideExpr | ExponentExpr |
  AndExpr | OrExpr | LessThanExpr | EqualExpr |
  NegateExpr | NotExpr |
  ConditionalExpr |
  NumLeaf | BoolLeaf | VarLeaf;

// The result of evaluating an Expr is either a number or a boolean. In
// TypeScript, we can check which one it is with the "typeof" operator, which
// comes up in the execution phase.
export type Value = number | boolean;


// Since we have so many infix operators, we don't really want to have to type
// out this pattern for each individual node type. We use this InfixExpr type
// along with the Tag type and the & operator to construct our AST node type
// definitions for infix operator expressions.
export type InfixExpr = {
  readonly leftSubexpr: Expr;
  readonly rightSubexpr: Expr;
};

// Similarly, we have a couple prefix operators, so we have an opportunity to
// reduce code duplication in their definitions.
export type PrefixExpr = {
  readonly subexpr: Expr;
};

// Finally, for our leaves that contain values, we have a generic type to
// capture the common "value" field and account for the fact that its type is
// different in different AST node types.
export type ValueLeaf<ValueType> = {
  readonly value: ValueType;
}


// Our AST node type definitions for infix, prefix, and value expressions now
// become very concise. Make sure you can see how these definitions have the
// same meaning as the corresponding definitions in assignments 2 and 3, they
// just use a lot less space.
export type PlusExpr = Tag<"plus"> & InfixExpr;
export type MinusExpr = Tag<"minus"> & InfixExpr;
export type TimesExpr = Tag<"times"> & InfixExpr;
export type DivideExpr = Tag<"divide"> & InfixExpr;
export type ExponentExpr = Tag<"exponent"> & InfixExpr;
export type AndExpr = Tag<"and"> & InfixExpr;
export type OrExpr = Tag<"or"> & InfixExpr;
export type LessThanExpr = Tag<"lessThan"> & InfixExpr;
export type EqualExpr = Tag<"equal"> & InfixExpr;
export type NegateExpr = Tag<"negate"> & PrefixExpr;
export type NotExpr = Tag<"not"> & PrefixExpr;
export type NumLeaf = Tag<"num"> & ValueLeaf<number>;
export type BoolLeaf = Tag<"bool"> & ValueLeaf<boolean>;
export type VarLeaf = Tag<"var"> & Name;

// The conditional expression is syntactically special: it is our only
// *ternary* operator. It is sometimes referred to as "the ternary operator",
// but the word *ternary* literally just means that it has three operands, and
// there could be other ternary operators. If we had more than one ternary
// operator in our language, we would benefit from defining a TernaryExpr type,
// but since we just have this one, we don't bother with it.
export type ConditionalExpr = Tag<"conditional"> & {
  condition: Expr;
  trueExpr: Expr;
  falseExpr: Expr;
}
