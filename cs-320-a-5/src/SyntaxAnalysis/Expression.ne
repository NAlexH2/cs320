@preprocessor typescript

@{%
  import { Token } from "moo";
  import { lexer } from "../../src/SyntaxAnalysis/Lexer";

  import { postprocessWith } from "../../src/Library/Parsing";

  import {
    unparenthesize,
    buildPlusExpr, buildMinusExpr, buildTimesExpr, buildDivideExpr, buildExponentExpr,
    buildAndExpr, buildOrExpr, buildLessThanExpr, buildEqualExpr,
    buildNegateExpr, buildNotExpr,
    buildInputExpr,
    buildNumLeaf, buildBoolLeaf, buildVarLeaf
  } from "../../src/SyntaxAnalysis/Postprocessors"
%}

@lexer lexer


expression1 -> expression2 %or expression1
  {% buildOrExpr %}

expression1 -> expression2
  {% id %}


expression2 -> expression3 %and expression2
  {% buildAndExpr %}

expression2 -> expression3
  {% id %}


expression3 -> expression4 %equal expression3
  {% buildEqualExpr %}

expression3 -> expression4
  {% id %}


expression4 -> expression5 %lessThan expression4
  {% buildLessThanExpr %}

expression4 -> expression5
  {% id %}


expression5 -> expression6 %plus expression5
  {% buildPlusExpr %}

expression5 -> expression6 %dash expression5
  {% buildMinusExpr %}

expression5 -> expression6
  {% id %}


expression6 -> expression7 %times expression6
  {% buildTimesExpr %}

expression6 -> expression7 %divide expression6
  {% buildDivideExpr %}

expression6 -> expression7
  {% id %}


expression7 -> expression7 %exponent expression8
  {% buildExponentExpr %}

expression7 -> expression8
  {% id %}


expression8 -> %dash expression8
  {% buildNegateExpr %}

expression8 -> %not expression8
  {% buildNotExpr %}

expression8 -> atom {% id %}


atom -> %parenL expression1 %parenR
  {% postprocessWith(unparenthesize) %}

atom -> %input %lessThan %type %greaterThan
  {% postprocessWith(buildInputExpr) %}

atom -> value
  {% id %}

atom -> %name
  {% postprocessWith(buildVarLeaf) %}


value -> %float
  {% postprocessWith(buildNumLeaf) %}

value -> %bool
  {% postprocessWith(buildBoolLeaf) %}
