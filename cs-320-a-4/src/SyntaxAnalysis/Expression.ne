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
    buildConditionalExpr,
    buildNumLeaf, buildBoolLeaf, buildVarLeaf
  } from "../../src/SyntaxAnalysis/Postprocessors"
%}

@lexer lexer


expression1 -> expression2 %question expression1 %colon expression1
  {% postprocessWith(buildConditionalExpr) %}

expression1 -> expression2
  {% id %}


expression2 -> expression3 %or expression2
  {% buildOrExpr %}

expression2 -> expression3
  {% id %}


expression3 -> expression4 %and expression3
  {% buildAndExpr %}

expression3 -> expression4
  {% id %}


expression4 -> expression5 %equal expression4
  {% buildEqualExpr %}

expression4 -> expression5
  {% id %}


expression5 -> expression6 %lessThan expression5
  {% buildLessThanExpr %}

expression5 -> expression6
  {% id %}


expression6 -> expression7 %plus expression6
  {% buildPlusExpr %}

expression6 -> expression7 %dash expression6
  {% buildMinusExpr %}

expression6 -> expression7
  {% id %}


expression7 -> expression8 %times expression7
  {% buildTimesExpr %}

expression7 -> expression8 %divide expression7
  {% buildDivideExpr %}

expression7 -> expression8
  {% id %}


expression8 -> expression8 %exponent expression9
  {% buildExponentExpr %}

expression8 -> expression9
  {% id %}


expression9 -> %dash expression9
  {% buildNegateExpr %}

expression9 -> %not expression9
  {% buildNotExpr %}

expression9 -> atom {% id %}


atom -> %parenL expression1 %parenR
  {% postprocessWith(unparenthesize) %}

atom -> %float
  {% postprocessWith(buildNumLeaf) %}

atom -> %bool
  {% postprocessWith(buildBoolLeaf) %}

atom -> %name
  {% postprocessWith(buildVarLeaf) %}
