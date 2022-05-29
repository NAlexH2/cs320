import { Lexer, Rules } from "moo";
import { compileLexer } from "../Library/Parsing";

const lexingRules: Rules = {
  _: { match: /\s+/, lineBreaks: true },
  declare: /declare\b/,
  if_: /if\b/,
  else_: /else\b/,
  for_: /for\b/,
  print: /print\b/,
  assert: /assert\b/,
  bool: /(?:(?:true)|(?:false))\b/,
  name: /[A-Za-z]\w*\b/,
  float: /(?:(?<!\d\s*)-)?\d+(?:\.\d*)?\b/,
  plus: /\+/,
  dash: /-/,
  times: /\*/,
  divide: /\//,
  exponent: /\^/,
  and: /&&/,
  or: /\|\|/,
  lessThan: /</,
  greaterThan: />/,
  not: /!/,
  equal: /==/,
  assign: /=/,
  curlyL: /{/,
  curlyR: /}/,
  semicolon: /;/,
  question: /\?/,
  colon: /:/,
  parenL: /\(/,
  parenR: /\)/,
};

export const lexer: Lexer = compileLexer(lexingRules);
