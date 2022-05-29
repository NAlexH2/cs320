import "jest-extended";

import { Token } from "moo";
import { Grammar } from "nearley";

import {
  AST, PlusNode, MinusNode, TimesNode, ExponentNode,
  NegateNode,
  NumLeaf, NameLeaf,
  Scope, Binding
} from "./AST";

import {
  lex, parse, parseUnambiguous,
  expressionRules, scopeRules
} from "./Main";

test("hexadecimal integer literal lexing test", () => {
  let tokens: Token[];

  tokens = lex("$1");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("$1");

  tokens = lex("$1 $F");
  expect(tokens.length).toEqual(2);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("$1");
  expect(tokens[1].type).toEqual("hex");
  expect(tokens[1].text).toEqual("$F");

  tokens = lex("1+$1");
  expect(tokens.length).toEqual(3);
  expect(tokens[2].type).toEqual("hex");
  expect(tokens[2].text).toEqual("$1");

  tokens = lex("1-$1");
  expect(tokens.length).toEqual(2);
  expect(tokens[1].type).toEqual("hex");
  expect(tokens[1].text).toEqual("-$1");

  tokens = lex("$ABCD");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("$ABCD");

  tokens = lex("$ABCD-");
  expect(tokens.length).toEqual(2);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("$ABCD");

  tokens = lex("$aBcD");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("$aBcD");

  tokens = lex("$0a1B2c3D4");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("$0a1B2c3D4");

  tokens = lex("-$0a1B2c3D4");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("-$0a1B2c3D4");

  tokens = lex("---$0a1B2c3D4");
  expect(tokens.length).toEqual(3);
  expect(tokens[2].type).toEqual("hex");
  expect(tokens[2].text).toEqual("-$0a1B2c3D4");

  tokens = lex("ABCD");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("name");
  expect(tokens[0].text).toEqual("ABCD");

  tokens = lex("aBcD");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("name");
  expect(tokens[0].text).toEqual("aBcD");

  tokens = lex("0xFFFF");
  expect(tokens.length).toEqual(2);
  expect(tokens[0].type).toEqual("float");
  expect(tokens[0].text).toEqual("0");
  expect(tokens[1].type).toEqual("name");
  expect(tokens[1].text).toEqual("xFFFF");

  // this is how to test for an expected exception
  expect(() => lex("$1.2")).toThrow();
});

test("character literal lexing test", () => {
  let tokens: Token[];

  tokens = lex("'a'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'a'");

  tokens = lex("'1'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'1'");

  tokens = lex("'Q'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'Q'");

  tokens = lex("'$'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'$'");

  tokens = lex("'?'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'?'");

  tokens = lex("'/'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'/'");

  tokens = lex("'\"'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'\"'");

  tokens = lex("'\\''");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'\\''");

  tokens = lex("'\\n'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'\\n'");

  tokens = lex("'\\\\'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'\\\\'");

  tokens = lex("a");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("name");
  expect(tokens[0].text).toEqual("a");

  expect(() => lex("'abc'")).toThrow();
  expect(() => lex("\"a\"")).toThrow();
  expect(() => lex("'\\'")).toThrow();
  expect(() => lex("'''")).toThrow();
});

test("%times node parsing test", () => {
  expect(parse(expressionRules, "1 * 2 * 3"))
    .toEqual([parseUnambiguous(expressionRules, "(1 * 2) * 3")]);

  expect(parse(expressionRules, "1 * 2 * 3 * 4"))
    .toEqual([parseUnambiguous(expressionRules, "((1 * 2) * 3) * 4")]);

  expect(parse(expressionRules, "-1 * 2 + --3 * 4"))
    .toEqual([parseUnambiguous(expressionRules, "((-1) * 2) + ((--3) * 4)")]);

  expect(parse(expressionRules, "-1 * 2 + --3 ^ 4 * ---5 ^ 6 - 7"))
    .toEqual([parseUnambiguous(expressionRules, "(((-1) * 2) + (((--3) ^ 4) * ((---5) ^ 6))) - 7")]);
});

test("%exponent node parsing test", () => {
  expect(parse(expressionRules, "1 ^ 2 ^ 3"))
    .toEqual([parseUnambiguous(expressionRules, "1 ^ (2 ^ 3)")]);

  expect(parse(expressionRules, "1 ^ 2 ^ 3 ^ 4"))
    .toEqual([parseUnambiguous(expressionRules, "1 ^ (2 ^ (3 ^ 4))")]);

  expect(parse(expressionRules, "1 ^ 2 + 3 ^ 4"))
    .toEqual([parseUnambiguous(expressionRules, "(1 ^ 2) + (3 ^ 4)")]);

  expect(parse(expressionRules, "-1 ^ 2 + --3 ^ 4"))
    .toEqual([parseUnambiguous(expressionRules, "((-1) ^ 2) + ((--3) ^ 4)")]);

  expect(parse(expressionRules, "-1 ^ 2 * --3 ^ 4"))
    .toEqual([parseUnambiguous(expressionRules, "((-1) ^ 2) * ((--3) ^ 4)")]);

  expect(parse(expressionRules, "1 ^ 2 ^ 3 * 4 * 5 + 6 - 7"))
    .toEqual([parseUnambiguous(expressionRules, "((((1 ^ (2 ^ 3)) * 4) * 5) + 6) - 7")]);
});
