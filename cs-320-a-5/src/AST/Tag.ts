// The angle brackets in this definition define a *generic type*, which is very
// similar to a *templated type* in C++. TagName is a *generic type variable*,
// which is replaced with an actual type when the Tag type is used.
export type Tag<TagName> = {
  readonly tag: TagName;
};

// For example, the following two definitions of the StringLeaf type have
// exactly the same meaning:

//   type StringLeaf = { readonly tag: "str", readonly value: string }
//   type StringLeaf = Tag<"str"> & { readonly value: string }

// Again, this is just a tiny convenience; it's not a big deal, it just saves a
// couple keystrokes each time we want a "tag" field, which will come up a lot.


// More straightforwardly, several of our node types will have a "name" field
// to refer to a variable, so it's convenient to save a few keystrokes on that
// as well. This is not inherently related to the Tag type, but it is used in
// both expressions and statements, so it lives here instead of
// src/AST/Expression.ts or src/AST/Statement.ts.
export type Name = {
  readonly name: string;
};
