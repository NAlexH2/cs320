import { Tag, Name } from "./Tag";
import { ImplType, SourceType } from "./Type";

// Our Expr type looks almost exactly the same as in assignment 4, but we have
// a nice unified ValueLeaf type now instead of the NumLeaf and BoolLeaf types
// we had before. In practice, this has very little effect on most of the code
// we write, but it adds a little convenience to some of our code.
export type Expr =
  PlusExpr | MinusExpr | TimesExpr | DivideExpr | ExponentExpr |
  AndExpr | OrExpr | LessThanExpr | EqualExpr |
  NegateExpr | NotExpr | InputExpr |
  ValueLeaf | VarLeaf;


// In this definition, ValueType is a generic type which must be a *subtype* of
// SourceType. Remember that SourceType is equivalent to "num" | "bool", so
// ValueType must be either "num", "bool", or "num" | "bool".
export type ValueOf<ValueType extends SourceType> = ImplType[ValueType];

// This means there are three valid specializations of the ValueOf type:
//   - ValueOf<"num"> = number
//   - ValueOf<"bool"> = boolean
//   - ValueOf<SourceType> = ValueOf<"num" | "bool"> = number | boolean

// The first two specializations, ValueOf<"num"> and ValueOf<"bool">, represent
// what we mean by the phrases "value of type num" and "value of type bool" in
// the terminology of our toy language.

// The third specialization is potentially surprising, but very convenient:
// it's our general "value" type, which might be any type in our toy language.
export type Value = ValueOf<SourceType>;

// Again, this is really just the same as defining Value = number | boolean
// for now. The nice thing about this style of definition is that it allows
// some of our other code to handle values in a more general way, without
// having to implement special cases for each different type of value where
// they're not logically necessary.

// For example, this ValueLeafOf type generalizes our NumLeaf and BoolLeaf
// types from assignment 4:
export type ValueLeafOf<ValueType extends SourceType> = Tag<ValueType> & {
  readonly value: ValueOf<ValueType>;
}

// Again, there are three valid specializations:
//   - ValueLeafOf<"num"> = Tag<"num"> & {
//       readonly value: number;
//     }
//   - ValueLeafOf<"bool"> = Tag<"bool"> & {
//       readonly value: boolean;
//     }
//   - ValueLeafOf<"num" | "bool"> = Tag<"num" | "bool"> & {
//       readonly value: number | boolean;
//     }

// Unfortunately, the third specialization here is not quite what we want for a
// general ValueLeaf type: it allows the value { tag: "num", value: true },
// which we want TypeScript's typechecker to reject as an error.

// What we're missing here in TypeScript is a feature called *existential
// types*, or *wildcard types* in Java. The ValueOf type is still helpful in
// generalizing some other code, but for our general ValueLeaf type, we have to
// write out all of the cases by hand instead of getting them automatically
// generated from the ImplType definition.

export type ValueLeaf = ValueLeafOf<"num"> | ValueLeafOf<"bool">;

// Just to make sure the pattern is clear, this ValueLeaf type definition is
// exactly equivalent to the following definition:
//   export type ValueLeaf =
//     { readonly tag: "num", readonly value: number } | // note the "or" here
//     { readonly tag: "bool", readonly value: boolean }


// An input expression (like input<num>) doesn't contain any subexpressions,
// but does contain a *type* specifying which type of input to read from the
// user. This is what SourceType represents in our code.
export type InputExpr = Tag<"input"> & {
  readonly type: SourceType;
}


// The rest of our AST code looks just like before.
export type InfixExpr = {
  readonly leftSubexpr: Expr;
  readonly rightSubexpr: Expr;
};

export type PrefixExpr = {
  readonly subexpr: Expr;
};


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
export type VarLeaf = Tag<"var"> & Name;
