import { Lexer, Rules } from "moo";
import { compileLexer } from "../Library/Parsing";

const lexingRules: Rules = {
  _: /[ \t]+/,
  float: /-?\d+(?:\.\d*)?/,
  char: /'(?:[\!-\&\(-[\]-\~]|\\n|\\'|\\\\|\\t)'/,
  name: /[A-Za-z]\w*/,
  plus: /\+/,
  times: /\*/,
  exponent: /\^/,
  hex: /-?\$[A-Fa-f\d]*/,
  dash: /-/,
  parenL: /\(/,
  parenR: /\)/,
  equal: /=/,
  comma: /,/,
};

export const lexer: Lexer = compileLexer(lexingRules);
