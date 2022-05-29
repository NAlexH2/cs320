// *************
// PART 1: Lists
// *************

// We're going to be using a lot of recursive tree types in this course, so our
// first task in this assignment is to warm up with a simpler recursive type, a
// singly-linked list of numbers.

// TypeScript does not require the function and type definitions in a file to be
// in any particular order, so List's definition is able to reference ConsCell
// even though it's defined below List. List and ConsCell are **mutually recursive**:
// together they form a recursive singly-linked list data structure.

// The | operator in types means "or": a List is **either** the null value
// **or** a ConsCell value. In TypeScript, we have to be explicit about where
// null values are possible. We will use null to represent an empty list.
export type List = null | ConsCell;

// This style of type definition is very similar to a struct or class in many
// languages, and the way we use it here is almost identical to Python's "named
// tuples". A ConsCell object has a field named "first" that contains a
// (floating-point) number and a field named "rest" that contains another List.
export type ConsCell = {
  readonly first: number;
  readonly rest: List;
}

// (If you're wondering, the term "cons cell" is traditional functional
// programming terminology for this simple little data structure that represents
// a single "node" in a linked list. The name "cons" historically comes from the
// word "construct", but predates the modern OOP term "constructor".)

// Importantly, both of the fields of a ConsCell are marked readonly, which
// means they cannot be modified after a ConsCell object has been constructed.
// This means our List type is *immutable*: the contents of a List cannot be
// changed after its creation. This may seem odd, depending on your background
// in programming, but we have good reasons for doing this.

// Much of the work we do in this course (and in the field of PL) will carefully
// avoid modifying the data structures that our functions take as input, because
// we may reuse those same data structures in different ways later. Making the
// fields of our "node" types readonly helps ensure that we're doing this
// correctly, and opens up additional ways for the compiler and interpreter to
// automatically make our code run faster.

// TypeScript is a very modern *garbage-collected* language, which means we're
// free to allocate a lot of small objects and trust the garbage collector to
// deal with the cleanup, as long as we're not allocating huge amounts of small
// objects per second. Working with immutable data structures does lead us to do
// a lot of allocations, but it works out fine on the scale that we're concerned
// with in this course, and the optimizations can outweigh the performance costs.


// Let's see how to construct a sample List value by hand. The sampleList
// function below is written as a function so that you can add any test code you
// want to it and drop a breakpoint in it to watch your test code run: whenever
// you click the sampleList button on the assignment page, this sampleList
// function will execute.

// To define a function in TypeScript, we can use the "function" keyword along
// with notation similar to traditional C-like languages, except that the return
// type of the function is written **after** the argument list, separated by a
// colon.
export function sampleList(): List {
  // Mutable variable declarations in TypeScript are written with the "let"
  // keyword, and the type is written **after** the variable name, separated by
  // a colon.
  let list1: List = null;

  // To construct a ConsCell, we can use an *object literal*: the fields are
  // initialized between a pair of curly braces. We use the old null value of
  // list1 as the value in "rest" field, which gives us a single-element list.
  list1 = { first: 6, rest: list1 };

  // Immutable variable declarations in TypeScript are written with the "const"
  // keyword, and otherwise have the same notation as mutable declarations. If
  // you're used to Java, these are like "final" variables.
  const list2: List = { first: 5, rest: list1 };

  // We can nest object literal notation to define multiple nodes of a list.
  const list3: List = {
    first: 4,
    rest: {
      first: 3,
      rest: {
        first: 2,
        rest: list2
      }
    }
  };

  // Finally, we can return an object literal without giving it a name. Object
  // literal syntax is *first-class*: we can use it anywhere that we could use a
  // variable containing an object of the same type.
  return { first: 1, rest: list3 };
};


// For convenience, here is the traditional "cons" function that adds one "cons
// cell" to the front of a list. Arguments in a TypeScript function are written
// similarly to variable declarations, but without the "let" or "const" keyword.
export function cons(newFirst: number, list: List): List {
  return {
    first: newFirst,
    rest: list
  };
}

// Note that in the cons function, we **do not modify the input list**: instead,
// we return a **new** list that references the original list. This leaves the
// original list usable for other things outside of the cons function call.


// Here's our first function that does some actual computation with a List: The
// listToString function below is used in generating the string representations
// of lists that you see in the outputs on the assignment page.
export function listToString(list: List): string {
  // We start with a mutable string initialized to the empty string.
  let output: string = "";

  // A for loop can also be written very similar to in a C-like language.
  for (let cur: List = list; cur != null; cur = cur.rest) {
    // We can access the fields of an object with traditional "dot notation".
    // Number values have a .toString method for converting to string.
    // The += operator appends one string to another.
    output += cur.first.toString();

    // If there's a next element, we want a comma between this element and the
    // next element.
    if (cur.rest != null)
      output += ", ";
  }

  // Finally, we return the output string.
  return output;
}


// The technique of recursion will be very important to us in this course: while
// it will never be **strictly** necessary, it will be the **easiest** way to
// solve many of the problems we encounter.

// The traditional "snoc" function ("cons" backwards) recursively traverses a
// list in order to append a new element to the **end** of the list. Study this
// function carefully, and step through it in the debugger while watching the
// call stack.  This is an example of how we usually compute with immutable data
// structures.
export function snoc(newLast: number, list: List): List {
  if (list == null) {
    // If the input list is empty, then putting newLast at the "end" of it just
    // means returning a single-element list containing newLast. A
    // single-element list is a non-null list with a null "rest" field.
    return {
        first: newLast,
        rest: null
    };
  } 
  else 
  {
    // If the input list is nonempty, the output list should have the same first
    // element as the input list, and the rest of the output list should be the
    // rest of the input list with newLast appended at the end.
    const newRest: List = snoc(newLast, list.rest);
    return {
        first: list.first,
        rest: newRest
    };
  }
}


// For a point of comparison, let's see one function written both iteratively
// (with loops) and recursively. Below, the doubleEeachIterative and
// doubleEachRecursive functions each compute the same result: the output list
// is the same as the input list, but with each list element multiplied by 2.

export function doubleEachIterative(list: List): List {
  let output: List = null;

  // With a loop, we traverse the list left-to-right.
  for (let cur: List = list; cur != null; cur = cur.rest) {
    // To construct an output list in the same order, we need to append each
    // element to the **end** of the output list with snoc: we construct the
    // list right-to-left, in the **opposite** order that we traverse the input
    // list.
    output = snoc(cur.first * 2, output);
  }

  return output;
}

export function doubleEachRecursive(list: List): List {
  if (list == null) {
    return list;
  } else {
    // With recursion, we traverse left-to-right **and** construct the list
    // left-to-right with cons. This turns out to be very convenient when our
    // recursive data structures get more complicated than singly-linked lists.
    const doubledRest = doubleEachRecursive(list.rest);
    return cons(list.first * 2, doubledRest);
  }
}


// ****************
// EXERCISE 1 START
// ****************

// Implement the reverse function so that it returns the reverse of the input
// list.

// For example:

//   input: null (empty list)
//   output: null

//   input: { first: 1, rest: null }
//   output: { first: 1, rest: null }

//   input: { first: 1, rest: { first: 2, rest: { first: 3, rest: null } } }
//   output: { first: 3, rest: { first: 2, rest: { first: 1, rest: null } } }

// Remember, you're **not modifying the input list**, you're returning a **new**
// list. You may use either iteration (loops) or recursion.

// Delete the entire "throw" line below and replace it with your code.

export function reverse(list: List): List {
  let output: List = null;

  for(let cur: List = list, i: number = 0; cur != null; cur = cur.rest, ++i)
    output = { first: cur.first, rest: output}
    //Personal notes - ex: 1,2,3,4 - essentially inserting at the head of the list
    //while rest is the "next". Since output starts at null, assuming it sets both
    //first and rest to null. Output has (after one loop) output.first of the
    //cur.first, but also it's original output.rest == null.



  return output;
}

// **************
// EXERCISE 1 END
// **************


// ****************
// EXERCISE 2 START
// ****************

// Implement the removeZeroes function so that it returns the input list with
// every copy of the number 0 removed.

// For example:

//   input: null (empty list)
//   output: null

//   input: { first: 1, rest: null }
//   output: { first: 1, rest: null }

//   input: { first: 0, rest: null }
//   output: null

//   input: { first: 0, rest: { first: 2, rest: { first: 0, rest: null } } }
//   output: { first: 2, rest: null }

//   input: { first: 1, rest: { first: 2, rest: { first: 0, rest: null } } }
//   output: { first: 1, { rest: { first: 2, rest: null } }

// Again, you're **not modifying the input list**, you're returning a **new**
// list. You may use either iteration (loops) or recursion, but this is a good
// one to practice recursion on.

// Delete the entire "throw" line below and replace it with your code.

export function removeZeroes(list: List): List {
  
  let output: List = null;
  return rmZR(list); 
}

export function rmZR(list: List): List {
  
  if(list == null)
    return list;
  
  if(list.first != 0)
  {
    const zeroRest = rmZR(list.rest);
    return cons(list.first, zeroRest);
  }
  else
    return rmZR(list.rest);
  
}

// **************
// EXERCISE 2 END
// **************



// *************
// PART 2: Trees
// *************

// Now, let's see our first example of the kind of *trees* that we'll work with
// in this course. The LogicTree type below is a type of *abstract syntax trees*
// (ASTs) for a tiny language of Boolean logic.

// A LogicTree is either an AndNode or a NotNode or a BoolLeaf.
export type LogicTree = AndNode | NotNode | BoolLeaf;

// An AndNode represents a use of the Boolean "AND" operator, which is written
// as "&&" in the notation of our LogicTree language on the assignment page.
export type AndNode = {
  // Each LogicTree node type has a unique "tag" indicating **which** type of
  // node it is. This allows us to write switch/case statements over LogicTree
  // values based on their tags, as we'll see below.

  // Note that "and" is the *type* of this field. This means that in an AndNode
  // value, the "tag" field must always be the exact literal string "and"; it
  // can't be any other string. This is important to TypeScript's type system.
  readonly tag: "and";

  // An AndNode has two LogicTree subtrees, to represent the left and right
  // operand in the "AND" operation. Each subtree can be an AndNode or a NotNode
  // or a BoolLeaf.
  readonly leftSubtree: LogicTree;
  readonly rightSubtree: LogicTree;
}

// A NotNode represents a use of the Boolean "NOT" operator, which is written as
// "!" in the notation of our LogicTree language on the assignment page.
export type NotNode = {
  readonly tag: "not";

  // A NotNode only has a single LogicTree subtree, because the "NOT" operation
  // only applies to a single operand.
  readonly subtree: LogicTree;
}

// A BoolNode represents a "true" or "false" Boolean constant, which are written
// as "true" and "false" in the notation of our LogicTree language on the
// assignment page.
export type BoolLeaf = {
  readonly tag: "bool";

  // A BoolLeaf has no subtrees, which is what makes it a *leaf*. Instead, it
  // stores a single Boolean value.
  readonly value: boolean;
}


// Let's see how to construct a sample Tree value by hand. The sampleTree
// function below, like the sampleList function, is written as a function so
// that you can add any test code you // want to it and drop a breakpoint in it
// to watch your test code run: whenever you click the sampleTree button on the
// assignment page, this sampleList function will execute.
export function sampleTree(): LogicTree {
  // To construct a BoolLeaf, we just write an object literal with the tag
  // "bool" and a Boolean value.
  const tree1: LogicTree = { tag: "bool", value: true };

  // To construct a NotNode, we write an object literal with the tag "not" and a
  // LogicTree subtree. Note how TypeScript is clever enough to throw a type
  // error at compile time if we use the wrong fields for the tag we choose: for
  // example, with the "not" tag, you'll get an error if you try to define a
  // "value" field instead of a "subtree" field.
  const tree2: LogicTree = {
    tag: "not",
    subtree: tree1
  };

  // To construct an AndNode, we have to give both a left and right subtree.
  const tree3: LogicTree = {
    tag: "and",
    leftSubtree: tree1,
    rightSubtree: tree2
  };

  return tree3;
}


// Here's a function to count the total number of nodes in a LogicTree,
// including AndNodes, NotNodes, and BoolLeafs. This is the iterative version,
// and there's also a recursive version below; note how the recursive version
// doesn't require an extra stack data structure, and is much more
// straightforward as a result.
export function countNodesIterative(tree: LogicTree): number {
  // We'll do a depth-first traversal of this tree, so we'll use an array as a
  // stack to represent the nodes that we have left to visit. At the start of
  // the algorithm, there is only one node to visit: the root of the input tree.
  // The type LogicTree[] is an array of LogicTrees, and [tree] is a
  // single-element array containing tree.
  let stack: LogicTree[] = [tree];

  // This will be our running counter of how many nodes we've seen. We haven't
  // quite "seen" the root node yet: that will be handled below.
  let nodeCount = 0;

  // To kick off the main loop, we pop from the stack to get the root node in
  // our top variable. Our stack is *mutable*, even though the trees on it are
  // *immutable*: the pop method **removes** the last element from the stack and
  // returns it.
  let top = stack.pop();

  // If the stack is empty, the value of stack.pop() is equal to null, so this
  // loop continues until there are no more nodes on the stack left to process.
  while (top != null) {
    // If we're here that means top is non-null and we've just "seen" a node by
    // popping it off the stack, so we record that in the counter variable.
    nodeCount++;

    // To work with LogicTree inputs, we can use switch/case statements over the tag
    // field, and TypeScript is again clever enough to know which fields are
    // accessible and inaccessible in each case.
    switch (top.tag) {
      // If we're looking at an "and" node, that gives us two new nodes that we
      // need to visit: the roots of the left and right subtrees. The push
      // method adds a new last element onto the end of our stack.
      case "and":
        stack.push(top.rightSubtree);
        stack.push(top.leftSubtree);
        break;

      // If we're looking at a "not" node, that only gives us one new node that
      // we need to visit: the root of the only subtree.
      case "not":
        stack.push(top.subtree);
        break;

      // If we're looking at a "bool" node, there are no new nodes that we need
      // to visit: there are no subtrees. This case doesn't need to be written
      // down, it's here for illustration.
      case "bool":
        break;
    }

    // Prepare for the next iteration of the loop. If we just processed the last
    // node in the tree, this returns a value equal to null and the loop exits.
    top = stack.pop();
  }

  // Finally, we return the total node count.
  return nodeCount;
}


// Here's a recursive version of the countNodesIterative function, to
// demonstrate how recursion makes this kind of function much more
// straightforward. If you don't understand how this works, walk through it in
// the debugger!
export function countNodesRecursive(tree: LogicTree): number {
  // We'll start with a count of 1 for the root node.
  let nodeCount: number = 1;

  // Again, we find out which type of LogicTree node we have by checking its
  // tag.
  switch (tree.tag) {
    // If the root of the tree is an "and" node, we count the number of nodes in
    // its left and right subtree and add both sums to our node count.
    case "and":
      nodeCount +=
        countNodesRecursive(tree.leftSubtree) +
        countNodesRecursive(tree.rightSubtree);
      break;

    // If the root of the tree is a "not" node, we count the number of nodes in
    // its only subtree and add that sum to our node count.
    case "not":
      nodeCount += countNodesRecursive(tree.subtree);
      break;

    // If the root of the tree is a "bool" leaf, the whole tree is just a single
    // leaf, and we already counted 1 for the root node, so there are no more
    // nodes to count. Again, this case doesn't actually need to be written,
    // it's just here for illustration.
    case "bool":
      break;
  }

  // Finally, we return the total count of nodes in the input tree.
  return nodeCount;
}


// Another example to illustrate an even more common pattern: traversing an
// input tree to transform its structure. The output of this function is almost
// the same as the input tree, but with the operands to every "and" operator
// flipped, so that for example "true && !false" becomes "false && !true". This
// example doesn't come with an iterative version, because it would be a big
// pain to write!
export function flipAnds(tree: LogicTree): LogicTree {
  switch (tree.tag) {
    // If the root is an "and" node, we return a **new** "and" node with the
    // subtree order swapped. Note that we recurse into both of the subtrees, in
    // case we have nested "and" operators in the tree.
    case "and":
      return {
        tag: "and",
        leftSubtree: flipAnds(tree.rightSubtree),
        rightSubtree: flipAnds(tree.leftSubtree)
      };

    // If the root is a "not" node, we have to traverse into the subtree, so we
    // return a **new** "not" node and recurse to produce the new subtree.
    case "not":
      return {
        tag: "not",
        subtree: flipAnds(tree.subtree)
      };

    // If the root is a "bool" leaf, we have no "and"s to flip and no subtrees
    // to traverse into, so we just return the input tree unmodified. Note that
    // this case **is** necessary to write: we have to return something!
    case "bool":
      return tree;
  }
}


// For one more example and a bit of foreshadowing, the evaluate function
// computes the result of a given LogicTree, since a LogicTree represents an
// expression in Boolean logic. This is our first tiny "interpreter", which is
// only very technically deserving of the name, but it will grow from here!
export function evaluate(tree: LogicTree): boolean {
  switch (tree.tag) {
    // If the root is an "and" node, we evaluate both subtrees and take the
    // "AND" of their results.
    case "and":
      return (
        evaluate(tree.leftSubtree) &&
        evaluate(tree.rightSubtree)
      );

    // If the root is a "not" node, we evaluate its only subtree and take the
    // "NOT" of its result.
    case "not":
      return ! evaluate(tree.subtree);

    // If the root is a "bool" node, there are no subtrees to evaluate: we just
    // return its value.
    case "bool":
      return tree.value;
  }
}


// ****************
// EXERCISE 3 START
// ****************

// Implement the countLeaves function so that it returns the number of
// **leaves** in the input tree. Only BoolLeaf values are leaves, AndNode and
// NotNode values are not leaves.

// For example:

//   input: true
//   output: 1

//   input: true && false
//   output: 2

//   input: true && !false
//   output: 2

//   input: !(!true && !false) && true
//   output: 3

// Again, you're **not modifying the input tree**, you're returning a **new**
// tree. You may use iteration if you really want to, but it's going to be a
// headache; you should take this as an exercise to practice recursive thinking.

// Delete the entire "throw" line below and replace it with your code.

export function countLeaves(tree: LogicTree): number {

  return boolfindercounter(tree);

}

export function boolfindercounter(tree: LogicTree): number {
  let boolcount = 0;

  switch(tree.tag){

    case "and":
      boolcount += boolfindercounter(tree.leftSubtree) +
                   boolfindercounter(tree.rightSubtree);
                   break;
    
    case "not":
      boolcount += boolfindercounter(tree.subtree);
      break;

    case "bool":
      return boolcount + 1;
  }
  return boolcount;
}

// **************
// EXERCISE 3 END
// **************


// ****************
// EXERCISE 4 START
// ****************

// Implement the removeNots function so that it returns the input tree with each
// "not" node removed.

// For example:

//   input: true
//   output: true

//   input: !true
//   output: true

//   input: !!true
//   output: true

//   input: !(!true && !false) && !!true
//   output: (true && false) && true

// Again, you're **not modifying the input tree**, you're returning a **new**
// tree. You may use iteration if you really want to, but it's going to be a
// headache; you should take this as an exercise to practice recursive thinking.

// Delete the entire "throw" line below and replace it with your code.

export function removeNots(tree: LogicTree): LogicTree {
  
  return not_nots(tree);
}

export function not_nots(tree: LogicTree): LogicTree {

  switch(tree.tag){
    case "and":
      return {
        tag: "and",
        leftSubtree: not_nots(tree.leftSubtree),
        rightSubtree: not_nots(tree.rightSubtree)
      };
    
    case "not":{
      return not_nots(tree.subtree)
    }
    
    case "bool":
      return {
        tag: "bool",
        value: tree.value
      };
  }

  return tree;
  
}

// **************
// EXERCISE 4 END
// **************