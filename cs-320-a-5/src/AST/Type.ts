// We only have two types in our tiny toy language right now, but to plan for
// future growth, we're going to define things so that we can easily extend the
// language with new types later.

// The distinction between our toy language's "types" and TypeScript's "types"
// can get somewhat confusing, so let's review the terminology from lecture 2:
//   - Our toy language is the *source language*.
//   - TypeScript is the *implementation language*.

// This is the naming scheme we'll follow in this code: a "source type" is a
// type in our toy language, and an "implementation type" is a type in
// TypeScript.

// (In real PL theory, we often use the term *object language* for our source
// language and *metalanguage* for our implementation language, even though
// this can sometimes be confusing since both "object" and "meta" also have
// many other meanings in PL. In this assignment, we'll stick with "source" and
// "target".)

// Our source types will just be the strings "num" and "bool", which are
// conveniently the same as the tag names on the value leaves in our expression
// ASTs. Our implementation types will be TypeScript's built-in number and
// boolean type.


// Below we define a type called ImplType, which we use to keep track of the
// mapping between source types and implementation types.

// The definition of ImplType looks like an object literal type, and it
// technically is: we **could** define an ImplType value like
// { num: 1, bool: true }. This is not how we intend to use ImplType, though.

// Instead, we use ImplType as a *type-level mapping* from type names to actual
// TypeScript types. The mapping is somewhat trivial for now, but in principle
// we could map any name to any type we want.

// With this definition of ImplType, the notation ImplType["num"] refers to the
// TypeScript number type, and ImplType["bool"] refers to the TypeScript
// boolean type. See src/AST/Expression.ts to see how this trick allows us to
// define our Value and ValueLeaf types in a way that will automatically keep
// up-to-date when we add new types to our language.

export type ImplType = {
  "num": number;
  "bool": boolean;
};


// The "keyof" keyword refers to a union type of all possible field names for
// an object literal type like ImplType.
export type SourceType = keyof ImplType;

// In this assignment, this would be an equivalent definition of SourceType:
//   export type SourceType = "num" | "bool";

// The nice thing about using "keyof" is that we don't have to manually keep
// our definition of SourceType in sync with ImplType: if we add new mappings
// to the ImplType definition, SourceType automatically includes the keys of
// the new mappings.
