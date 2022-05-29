import { Lexer, Rules } from "moo";
import { compileLexer } from "../Library/Parsing";

const lexingRules: Rules = {
  _: { match: /\s+/, lineBreaks: true },
  declare: /declare\b/,
  if_: /if\b/,
  else_: /else\b/,
  while_: /while\b/,
  switch_: /switch\b/,
  case_: /case\b/,
  default_: /default\b/,
  input: /input\b/,
  print: /print\b/,
  type: /(?:num|bool)\b/,
  bool: /(?:true|false)\b/,
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
  colon: /:/,
  parenL: /\(/,
  parenR: /\)/,
};

export const lexer: Lexer = compileLexer(lexingRules);
