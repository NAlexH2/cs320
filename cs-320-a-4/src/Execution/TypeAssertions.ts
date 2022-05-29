// This module implements a form of *dynamic typechecking* for our language, in
// a way that allows TypeScript to help us out by checking that we're using the
// type assertions correctly.

// In a modern setting, the feature of dynamic typechecking is most notably
// found in Python, though there are other examples like JavaScript and Ruby.
// The term "weak typing" is sometimes used as a synonym, but it's really not a
// very well-defined term: "dynamic typechecking" is more precise.

// Dynamic typechecking is in contrast to *static typechecking*, which is more
// common, and which we'll implement in the next assignment. Keep in mind that
// when our toy language does typechecking in this assignment, it's all
// happening **at runtime**.

// Dynamic typechecking is all about validating properties of *values* at
// runtime. In this setting, a *type* is just a set of values that can exist at
// runtime, like "all integers" or "all booleans".
import { Value } from "../AST";


// A language with dynamic typechecking has a kind of *runtime error* called a
// *dynamic type error*, and when operations in the language execute, a dynamic
// type error is thrown if any of the values involved has an unexpected type.

// For example, the program { print 1; print 2 + true; } will print the value 1
// and **then** fail with a DynamicTypeError, because the error only comes up
// after the first print statement.

export class DynamicTypeError extends Error { }


// In TypeScript, if "x" has type Value, then following code has a *static*
// (compile-time) type error:

//   const numValue: number = x + 1; // error!

// This is usually a good thing: TypeScript is protecting us from accidentally
// using a value as a number, because it might actually be a boolean, and it
// would usually be a mistake to confuse the two types.

// Okay, but what if we just want to throw an exception if the type is wrong,
// and then move on with writing the "happy path"?

// For example, this code should be fine: this is how we check in TypeScript
// whether a value is a number or some other type.

//   if (typeof value != "number")
//     throw new DynamicTypeError("oops!");
//   const numValue: number = x + 1;

// TypeScript is actually clever enough to follow this reasoning, and the code
// above does not produce a *static* type error when we compile our TypeScript
// code.

// This is super convenient in our execution code, where the "throw a dynamic
// type error or move on" pattern is our mode of operation.


// These *assertion* functions each have one purpose: they check that a certain
// expected condition is true, and they throw an error if it isn't true. This
// is the basis for dynamic typechecking.

// Note the odd-looking return types in these functions. When we write
// "asserts value is number" as a return type, it has a special meaning to
// TypeScript: in any code that comes **after** a call to assertNum, TypeScript
// knows that the argument we passed in is a number value.

// For example, we can rewrite the example code above like this:

//   assertNum(x);
//   const numValue: number = x + 1;

export function assertNum(value: Value): asserts value is number {
  if (typeof value != "number")
    throw new DynamicTypeError("expected number, got " + value.toString());
}

export function assertBool(value: Value): asserts value is boolean {
  if (typeof value != "boolean")
    throw new DynamicTypeError("expected boolean, got " + value.toString());
}

// This function is a little more sophisticated: it asserts that two values
// have the *same* type, but it doesn't care whether they're both booleans or
// both numbers. This is used in the implementation of our equality comparison
// operator, which works over two booleans or two numbers but not one boolean
// and one number.
export function assertSameType(
  value1: Value,
  value2: Value
): asserts value2 is typeof value1 {
  if (typeof value1 != typeof value2)
    throw new DynamicTypeError(
      "expected same types, got " + value1.toString() +
      " and " + value2.toString()
    );
}
