@lexer lexer

@{%
  import {
    unparenthesize,
    buildPlusExpr, buildMinusExpr, buildTimesExpr, buildDivideExpr, buildExponentExpr,
    buildAndExpr, buildOrExpr, buildEqualExpr,
    buildNegateExpr, buildNotExpr,
    buildInputExpr,
    buildCallExpr,
    buildNumLeaf, buildBoolLeaf, buildVarLeaf
  } from "../src/SyntaxAnalysis/Postprocessors"
%}


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


expression4 -> expression5 %plus expression4
  {% buildPlusExpr %}

expression4 -> expression5 %dash expression4
  {% buildMinusExpr %}

expression4 -> expression5
  {% id %}


expression5 -> expression6 %times expression5
  {% buildTimesExpr %}

expression5 -> expression6 %divide expression5
  {% buildDivideExpr %}

expression5 -> expression6
  {% id %}


expression6 -> expression6 %exponent expression7
  {% buildExponentExpr %}

expression6 -> expression7
  {% id %}


expression7 -> %dash expression7
  {% postprocessWith(buildNegateExpr) %}

expression7 -> %not expression7
  {% buildNotExpr %}

expression7 -> atom {% id %}


atom -> %parenL expression1 %parenR
  {% postprocessWith(unparenthesize) %}

atom -> %input %lessThan %type %greaterThan
  {% postprocessWith(buildInputExpr) %}

atom -> %name %parenL argumentList %parenR
  {% postprocessWith(buildCallExpr) %}

atom -> value
  {% id %}

atom -> %name
  {% postprocessWith(buildVarLeaf) %}


value -> %float
  {% postprocessWith(buildNumLeaf) %}

value -> %bool
  {% postprocessWith(buildBoolLeaf) %}
