// This file contains all of the postprocessing functions that get called in
// the .ne files. You can drop breakpoints in these functions to see how the
// postprocessing functions are called during parsing.

import { Token } from "moo";

import {
  AST,
  PlusNode, MinusNode, TimesNode, ExponentNode,
  NegateNode,
  NumLeaf, NameLeaf,
  Binding, Scope
} from "../AST";

// This function is called from the first expression1 rule in
// src/Grammar/Expression.ne. When Nearley calls a postprocessing function for
// a production rule, it passes **exactly one argument for each terminal or
// nonterminal in the rule**.
export function buildPlusNode(
  leftSubtree: AST,
  plusSign: Token,
  rightSubtree: AST
): PlusNode {
  // The expression1 rule has three "terminals or nonterminals": the expression1
  // nonterminal, followed by the %plus terminal, followed by the expression2
  // nonterminal. In this function, the leftSubtree argument is the AST
  // corresponding to that expression1 nonterminal, the plusSign argument is the
  // token corresponding to the %plus terminal, and the rightSubtree argument is
  // the AST corresponding to the expression2 nonterminal.
  return {
    tag: "plus",
    leftSubtree: leftSubtree,
    rightSubtree: rightSubtree
  };
}

export function buildMinusNode(
  leftSubtree: AST,
  minusSign: Token,
  rightSubtree: AST
): MinusNode {
  return {
    tag: "minus",
    leftSubtree: leftSubtree,
    rightSubtree: rightSubtree
  };
}

export function buildTimesNode(
  leftSubtree: AST,
  timesSign: Token,
  rightSubtree: AST
): TimesNode {
  return {
    tag: "times",
    leftSubtree: leftSubtree,
    rightSubtree: rightSubtree
  };
}

export function buildExponentNode(
  leftSubtree: AST,
  exponentSign: Token,
  rightSubtree: AST
): ExponentNode {
  return {
    tag: "exponent",
    leftSubtree: leftSubtree,
    rightSubtree: rightSubtree
  };
}

export function buildNegateNode(
  dashSign: Token,
  subtree: AST
): NegateNode {
  return {
    tag: "negate",
    subtree: subtree
  };
}

export function buildNumLeaf(
  numValue: number
): NumLeaf {
  return {
    tag: "num",
    value: numValue
  };
}

export function buildNameLeaf(
  nameToken: Token
): NameLeaf {
  return {
    tag: "name",
    name: nameToken.text
  };
}

export function convertHex(
  hexToken: Token
): number {
  if (hexToken.text.charAt(0) == '-')
    return - Number.parseInt(hexToken.text.slice(2), 16);
  else
    return Number.parseInt(hexToken.text.slice(1), 16);
}

export function convertFloat(
  floatToken: Token
): number {
  return Number.parseFloat(floatToken.text);
}

export function convertChar(
  charToken: Token
): number {
  if (charToken.text.charAt(1) == '\\') {
    switch (charToken.text.charAt(2)) {
      case '\'': return "'".charCodeAt(0);
      case '\\': return "\\".charCodeAt(0);
      case 'n': return "\n".charCodeAt(0);
      case 't': return "\t".charCodeAt(0);
    }
  }

  return charToken.text.charCodeAt(1);
}

export function unparenthesize(
  leftParen: Token,
  tree: AST,
  rightParen: Token
): AST {
  return tree;
}

export function buildEmptyScope(): Scope {
  return new Map();
}

export function buildNonEmptyScope(
  first: Binding,
  rest: Binding[]
): Scope {
  return new Map([first, ...rest]);
}

export function buildBinding(
  name: Token,
  equalSign: Token,
  numValue: number
): Binding {
  return [name.text, numValue];
}

export function buildCommaBinding(
  comma: Token,
  binding: Binding
): Binding {
  return binding;
}
