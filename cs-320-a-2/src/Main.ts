// This assignment will be very similar to part 2 of assignment 1: we're working
// with a language of arithmetic instead of Boolean logic this time, but the AST
// structure of the language is almost the same as it was in assignment 1.

import { ASTNodeElement } from "./Library/AST";

// We're adding in one brand new feature this time: our AST type has a new kind
// of leaf that represents a *variable name*. This means our arithmetic
// expressions can now contain variable names, and when we interpret an
// arithmetic expression to calculate its value, we'll have to account for any
// names in the expression.

// We're going to start slow with these concepts, so for now our arithmetic
// language does not have any way to create or modify variables within a
// "program"; instead, we set the constant value of each variable **before** the
// interpreter starts running. This is roughly like passing command-line
// arguments to a program.

// Our AST type looks just like our LogicTree type from assignment 1, except
// with an extra case for NameLeaf.
export type AST = PlusNode | NegateNode | NumLeaf | NameLeaf;

// Like the AndNode type in our Boolean language, the PlusNode type has two
// subtrees to represent the left and right operands to the addition operator.
export type PlusNode = {
  readonly tag: "plus";
  readonly leftSubtree: AST;
  readonly rightSubtree: AST;
};

// Like the NotNode type in our Boolean language, the NegateNode type has one 
//subtree to represent the only operand to the negation operator.
export type NegateNode = {
  readonly tag: "negate";
  readonly subtree: AST;
};

// Like the BoolLeaf type in our Boolean language, the NumLeaf type has no
// subtrees, just a single number value.
export type NumLeaf = {
  readonly tag: "num";
  readonly value: number;
};

// The NameLeaf type is new in this assignment: it represents a *use* of a
// variable in an arithmetic expression.
export type NameLeaf = {
  readonly tag: "name";
  readonly name: string;
};


// As in assignment 1, we use *object literal* syntax to build our trees.
// Remember that you can use the debugger to step through this example if you
// want to inspect these values.
export function sampleTree(): AST {
  const tree1: AST = { tag: "name", name: "x" };
  const tree2: AST = { tag: "num", value: 1 };
  const tree3: AST = {
    tag: "plus",
    leftSubtree: tree1,
    rightSubtree: tree2
  };
  return {
    tag: "negate",
    subtree: tree3
  };
}

// Here's the function that the webpage uses to convert trees back to strings.
export function astToString(tree: AST): string {
  switch (tree.tag) {
    case "plus":
      return (
        "(" + astToString(tree.leftSubtree) +
        " + " + astToString(tree.rightSubtree) +
        ")"
      );

    case "negate":
      return "(- " + astToString(tree.subtree) + ")";

    case "num":
      return tree.value.toString();

    case "name":
      return tree.name;
  }
}


// When we interpret an arithmetic expression that contains variables, how do we
// know what value each variable should have?

// Our interpreter function needs a way to *map* variable names to variable
// values, in this case numbers. In PL terminology, we need a *binding* for each
// variable in our program: a known definition that says what the exact value of
// the variable is.

// A *scope* is fundamentally a collection of variable *bindings*. Scopes can
// get quite complex, but in this assignment we will only have one simple scope
// in our whole program: all of our variables are *global* and *constant*.

// The Map<string, number> type contains a collection of "slots" or "cells",
// each **indexed by** a string and **containing** a number. You don't really
// need to worry about the specifics of how the Map type works - we'll only be
// interacting with it using the lookup function provided below.
export type Scope = Map<string, number>;


// To create a scope, we can use the Map constructor, which takes kind of an odd
// pattern of arguments. You won't need to create any scope values in this
// assignment, but it may be helpful to use this function to inspect them in the
// debugger in order to make sure you understand what a scope value looks like.
export function sampleScope(): Scope {
  // An empty scope can be constructed with the zero-argument Map constructor.
  const scope1 = new Map();

  // A non-empty scope is constructed with the **one-argument** Map constructor,
  // which takes an **array of two-element arrays**. Each inner array represents
  // a single *variable binding* in our arithmetic language. In each inner
  // array, the first element is the name of the variable being defined, and the
  // second element is the value of the variable. This scope defines x = 1 and
  // y = 2; note the outer **and** inner square brackets, which are all
  // necessary.
  const scope2 = new Map([
    ["x", 1], ["y", 2]
  ]);

  // Each variable in a scope has a unique binding: if we try to build a scope
  // with more than one binding for the same variable, only the **last** binding
  // is actually used. In this scope, x = 2, which you can verify on the webpage
  // and in the debugger.
  const scope3 = new Map([
    ["x", 1], ["x", 2], ["y", 3]
  ]);

  return scope3;
}


// Since our expressions can now have variables, they can also have *errors* if
// it turns out that a program contains an undefined variable. For now, we'll
// just throw a TypeScript exception if this happens.

// It's good practice to define a new custom exception type for each different
// kind of exception we plan to throw. The extends keyword is how we do
// subclassing in TypeScript; the Error class is just some built-in magic that
// makes thrown exceptions nicer to debug.
export class ScopeError extends Error { }

// This function is our only interface for using the Scope type, for now. The
// lookup function allows us to access the value of a variable in a scope, and
// throws a ScopeError if the variable does not have a binding in the scope.
export function lookup(name: string, scope: Scope): number {
  // The .get function on the Map<string, number> type takes a string and gives
  // back either a number or a value equal to null. If the variable name has a
  // binding in the scope, we get its number value; otherwise, we get back null.
  const value = scope.get(name);

  // The purpose of this lookup function is to wrap the .get function and throw
  // an exception if it returns null. This is convenient in our interpreter.
  if (value == null)
    throw new ScopeError("name is not in scope: " + name);

  // If the value isn't null, it contains the value of the variable that we
  // looked up by name.
  return value;
}

// Now when we want to interpret an arithmetic expression to find its value, we
// can take in a scope to tell our interpreter what the value of each variable
// should be.
export function interpret(scope: Scope, tree: AST): number {
  // Like in assignment 1, we *traverse* an AST by branching on its tag.
  switch (tree.tag) {
    // If the root of the tree is a PlusNode, we recursively interpret its two
    // subtrees and then add their result. Note that we pass the scope value to
    // the next recursive call, so that it's available at every level of the
    // recursion.
    case "plus":
      return (
        interpret(scope, tree.leftSubtree) +
        interpret(scope, tree.rightSubtree)
      );

    // If the root of the tree is a NegateNode, we recursively interpret its
    // only subtree and then negate its result.
    case "negate":
      return - interpret(scope, tree.subtree);

    // If the root of the tree is a NumLeaf, we just return its number value.
    case "num":
      return tree.value;

    // Finally, our new case: if the root of the tree is a NameLeaf, we use
    // lookup to find its value in our scope.
    case "name":
      return lookup(tree.name, scope);
  }
}


// Here's an example of a transformation over an AST which changes its
// **structure** but doesn't change its **value** when we interpret it.

// As the README mentions, when you input a negative number in one of the
// textboxes on the webpage (like "-1"), it becomes a NegateNode whose subtree
// is a NumLeaf. This is fine in principle, but maybe we want to *simplify* this
// pattern in our trees, so that a negative number is represented as a NumLeaf
// with a negative value field.

// We could make this change in the *parser* of our language, but we'll see that
// concept in a couple weeks; for now, we'll make the change by **transforming**
// an input AST into a modified output copy.

// Note that this function only transforms a single negation operation, so that
// for example "--1" becomes a single NegateNode whose subtree is a negative
// NumLeaf. It may be a good (ungraded) exercise to try to rewrite this function
// so that it also simplifies expressions like "--1" and "---1" to a single
// NumLeaf with no NegateNodes.
export function simplifyNegatedLeaves(tree: AST): AST {
  switch (tree.tag) {
    case "plus":
      return {
        tag: "plus",
        leftSubtree: simplifyNegatedLeaves(tree.leftSubtree),
        rightSubtree: simplifyNegatedLeaves(tree.rightSubtree)
      };

    case "negate":
      // If the subtree of our NegateNode is a single NumLeaf, we return a
      // single NumLeaf with a negated value. Otherwise, we recurse into the
      // subtree of the NegateNode, in case there is any more simplifying work
      // to do in the subtree.
      if (tree.subtree.tag == "num")
        return {
          tag: "num",
          value: - tree.subtree.value
        };
      else
        return {
          tag: "negate",
          subtree: simplifyNegatedLeaves(tree.subtree)
        };

    // The "num" and "name" cases below could both be unified into a single
    // default case, they're just written out here for demonstration.

    case "num":
      return tree;

    case "name":
      return tree;
  }
}


// **********
// EXERCISE 1
// **********

// Implement the countNameOccurrences function so that it returns the number of
// NameLeaf values in the tree that contain the given name.

// For example:

//   name: "x"
//   tree: 1 + 2
//   output: 0

//   name: "x"
//   tree: x + 1
//   output: 1

//   name: "x"
//   tree: -(x + x) + y
//   output: 2

// You must not use the astToString function or convert the input AST to a
// string in any other way. It is theoretically possible to solve this problem
// that way, but that's not the exercise that we're aiming for here.

// Delete the entire "throw" line below and replace it with your code.



export function countNameOccurrences(name: string, tree: AST): number {

  let count: number = 0;

  return countNameOccurRec(name, tree, count);
}

export function countNameOccurRec(name: string, tree: AST, count: number): number{
  if(tree.tag == "name" && tree.name == name)
    return 1;
  else {
    switch (tree.tag) {
      case "plus":
        count += countNameOccurRec(name, tree.leftSubtree, count) +
          countNameOccurRec(name, tree.rightSubtree, count);
          break;

      case "negate":
        if (tree.subtree.tag == "num")
          return 0;
        else
          count += countNameOccurRec(name, tree.subtree, count);
    }
    return count;
  }
}

// **************
// EXERCISE 1 END
// **************


// ****************
// EXERCISE 2 START
// ****************

// Implement the substituteAllNames function so that it replaces each NameLeaf
// with the value from the corresponding binding in the given scope.

// For example:

//   scope: x = 1, y = 2
//   tree: x + 10
//   output: 1 + 10

//   scope: x = 1, y = 2
//   tree: x + y
//   output: 1 + 2

//   scope: x = 1, y = 2
//   tree: -x + -(y + x)
//   output: -1 + -(2 + 1)

// You may assume that all variables in the tree have bindings in the scope, so
// the lookup function will never throw a ScopeError. When we test your code for
// grading, we will only test it in "safe" cases like this.

// Delete the entire "throw" line below and replace it with your code.

export function substituteAllNames(scope: Scope, tree: AST): AST {
  return subNamesRec(scope, tree);
}

export function subNamesRec(scope: Scope, tree: AST): AST {
  if(tree.tag == "name"){
    return {tag: "num", value: lookup(tree.name, scope)};
  }
  if(tree.tag == "num")
    return tree;
  switch(tree.tag)
  {
    case "plus":
      return {
        tag: "plus",
        leftSubtree: subNamesRec(scope, tree.leftSubtree),
        rightSubtree: subNamesRec(scope, tree.rightSubtree)
      };

    case "negate":
      return {
        tag: "negate",
        subtree: subNamesRec(scope, tree.subtree)
      };
  }
}
// **************
// EXERCISE 2 END
// **************


// ****************
// EXERCISE 3 START
// ****************

// Implement the removeDoubleNegations function so that it removes all
// **double** negations from the tree. This is similar to the removeNots
// function from assignment 1, **but** you should not remove single negations.
// Pay close attention to this detail in the examples below!

// As mentioned in the README, you may assume that every NumLeaf in the input
// tree contains a non-negative value; in this exercise, the expression -1
// always represents a NegateNode whose subtree is a NumLeaf containing the
// value 1, not a single NumLeaf containing the value -1.

// For example:

//   tree: -1
//   output: -1

//   tree: --1
//   output: 1

//   tree: --x
//   output: x

//   tree: ---1
//   output: -1

//   tree: ---(1 + 2)
//   output: -(1 + 2)

//   tree: ---(--1 + ---2)
//   output: -(1 + -2)

//   tree: ---(--1 + ---2)
//   output: -(1 + -2)

// Delete the entire "throw" line below and replace it with your code.

export function removeDoubleNegations(tree: AST): AST {
  return removeDblRecurse(tree);
}

export function removeDblRecurse(tree: AST): AST {

  switch(tree.tag)
  {
    case "plus":
      return {
        tag: "plus",
        leftSubtree: removeDblRecurse(tree.leftSubtree),
        rightSubtree: removeDblRecurse(tree.rightSubtree)
      };

    case "negate":
      if(tree.subtree.tag == "negate")
        return removeDblRecurse(tree.subtree.subtree);

      else
        return {
          tag: "negate",
          subtree: removeDblRecurse(tree.subtree)
        };
  }
  return tree; 
}

// **************
// EXERCISE 3 END
// **************
