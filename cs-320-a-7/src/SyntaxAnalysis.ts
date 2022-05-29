import { Func } from "./Function";
import { Prog } from "./Program";
import { Expr } from "./Expression";
import { Stmt } from "./Statement";
// import { Func, Prog, Expr, Stmt, CallNode } from "./AST";

import { Lexer, Token } from "moo";
import { Grammar, Parser } from "nearley";
import { lexer } from "./SyntaxAnalysis/Lexer";

import { default as progRules } from "../gen/SyntaxAnalysis";

const progGrammar: Grammar = Grammar.fromCompiled(progRules);

export function lex(source: string): Token[] {
  lexer.reset(source);
  return Array.from(lexer);
}

export class NoParseError extends Error { }

export function parse(source: string): Prog {
  const parses = new Parser(progGrammar).feed(source).finish();
  if (parses.length < 1)
    throw new NoParseError("invalid expression: " + source);
  return parses[0];
}