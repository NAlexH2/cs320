// To analyze expressions, we will implement a *type inference* algorithm which
// will not only tell us whether an expression is well-typed, but in the
// success case will also tell us what the expression's actual type is.

// Most real-world languages in 2022 support some degree of type inference, but
// most only support *partial* type inference, where the compiler or
// interpreter may only be able to infer types in specific restricted cases.

// Our toy language is still simple enough that we can easily pull off *total*
// type inference, where we can figure out the type of any arbitrary expression
// as long as we have a Scope mapping from variable names to types.

import { SourceType, Expr, InfixExpr, PrefixExpr, Value } from "../AST";
import { assertNum, assertSameType } from "../Execution/TypeAssertions";
import { Scope, lookup } from "./Scope";
import { assertType } from "./TypeAssertions";

// Since we have a bunch of infix operators, it's convenient to define a single
// function that can handle typechecking each of them. Note how this function
// **returns** a SourceType: it both checks that expr is well-typed **and**
// returns the source type of expr if it is well-typed.
function inferInfixExprType(
  operandType: SourceType, // type of both operands
  resultType: SourceType,  // type of operator result
  scope: Scope,            // types of variables in scope
  expr: InfixExpr          // infix operator expression
): SourceType {
  // First, we recursively infer the types of the left and right
  // subexpressions. If either of these subexpressions is ill-typed, the
  // corresponding recursive call will throw a StaticTypeError.
  const leftType = inferExprType(scope, expr.leftSubexpr);
  const rightType = inferExprType(scope, expr.rightSubexpr);

  // If both subexpressions are well-typed, we still need to make sure they
  // both have the *correct* type. The assertType function will throw a
  // StaticTypeError if either subexpression has the wrong type.
  assertType(operandType, leftType);
  assertType(operandType, rightType);

  // Finally, if both subexpressions have the correct type, the result of the
  // operator expression is its result type.
  return resultType;
}

function inferPrefixExprType(
  operandType: SourceType,
  resultType: SourceType,
  scope: Scope,
  expr: PrefixExpr
): SourceType {
  const type = inferExprType(scope, expr.subexpr);
  assertType(operandType, type);
  return resultType;
}

// This function will be handy to use in typechecking the switch statement.
export function inferValueType(value: Value): SourceType {
  // The typeof operator only works on a limited number of built-in TypeScript
  // types, and always returns a predictable string like "number" or "boolean".
  switch (typeof value) {
    case "number": return "num";
    case "boolean": return "bool";
  }
}

export function inferExprType(scope: Scope, expr: Expr): SourceType {
  switch (expr.tag) {
    // All of our numeric infix operators are typechecked the exact same way:
    // we just have to make sure that both operands are numbers, and then we
    // know that the result is a number.
    case "plus":
    case "minus":
    case "times":
    case "divide":
    case "exponent":
      return inferInfixExprType("num", "num", scope, expr);

    // Typechecking proceeds similarly for our unary operators, although they
    // have two different types, since our language doesn't allow negating a
    // boolean or taking the boolean NOT of a number.

    case "negate":
      return inferPrefixExprType("num", "num", scope, expr);

    case "not":
      return inferPrefixExprType("bool", "bool", scope, expr);

    // For the equality operator, we have to do just a little bit more work: it
    // always produces a boolean result, but it can take any two operands of
    // the same type, whether they're numbers or booleans. But language doesn't
    // allow comparing a number to a boolean for equality, so we still need to
    // do some checking.
    case "equal": {
      const leftType = inferExprType(scope, expr.leftSubexpr);
      const rightType = inferExprType(scope, expr.rightSubexpr);
      // We use assertType here to check that both subtrees have the *same*
      // type, regardless of what that type is.
      assertType(leftType, rightType);
      return "bool";
    }

    // Note that this is where the most important property of static analysis
    // shows up: we **do not execute** any code in this phase. We can observe
    // this in our toy language with programs that do user input: when we run
    // the typechecker over them, the user input dialog does not come up. This
    // is possible because we know what the type of the input will be, even
    // without actually doing the input action.
    case "input":
      return expr.type;

    // For a variable, we just look up the variable's name in scope; if it's
    // not in scope, we'll get a StaticScopeError.
    case "var":
      return lookup(expr.name, scope);

    // We carefully set up the definition of SourceType and Value so that the
    // tag of a ValueLeaf is the same string as its SourceType, which works out
    // really nicely here.
    case "num":
    case "bool":
      return expr.tag;

    case "lessThan":
      inferInfixExprType("num", "num", scope, expr);
      return "bool"


    // This code works, but you'll be modifying it in exercise 2 to be more
    // complete.
    case "and":
    case "or":
      const type1 = inferExprType(scope, expr.leftSubexpr)
      const type2 = inferExprType(scope, expr.rightSubexpr)
      assertType(type1, type2)
      if (type1 == "bool")
        return inferInfixExprType("bool", "bool", scope, expr);
      
      return inferInfixExprType("num", "num", scope, expr);
  }
}
