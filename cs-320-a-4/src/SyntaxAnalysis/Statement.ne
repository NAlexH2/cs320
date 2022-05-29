@preprocessor typescript

@{%
  import {
    buildCommandStmt,
    buildVarDeclStmt, buildVarUpdateStmt, buildPrintStmt, buildAssertStmt,
    buildBlockStmt, buildIfStmt, buildForStmt
  } from "../../src/SyntaxAnalysis/Postprocessors"
%}


@lexer lexer

statement -> command %semicolon
  {% postprocessWith(buildCommandStmt) %}

statement -> compound
  {% id %}


command -> %declare %name %assign expression1
  {% postprocessWith(buildVarDeclStmt) %}

command -> %name %assign expression1
  {% postprocessWith(buildVarUpdateStmt) %}

command -> %print expression1
  {% postprocessWith(buildPrintStmt) %}

command -> %assert expression1
  {% postprocessWith(buildAssertStmt) %}


compound -> %curlyL statement:* %curlyR
  {% postprocessWith(buildBlockStmt) %}

compound -> %if_ %parenL expression1 %parenR statement (%else_ statement):?
  {% postprocessWith(buildIfStmt) %}

compound -> %for_ %parenL %name %assign expression1 %semicolon expression1 %semicolon command %parenR statement
  {% postprocessWith(buildForStmt) %}


@include "./Expression.ne"
