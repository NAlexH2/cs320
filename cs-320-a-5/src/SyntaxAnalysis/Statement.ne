@preprocessor typescript

@{%
  import {
    buildCommandStmt,
    buildVarDeclStmt, buildVarUpdateStmt, buildPrintStmt,
    buildBlockStmt, buildIfStmt, buildWhileStmt, buildSwitchStmt
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


compound -> %curlyL statement:* %curlyR
  {% postprocessWith(buildBlockStmt) %}

compound -> %if_ %parenL expression1 %parenR statement (%else_ statement):?
  {% postprocessWith(buildIfStmt) %}

compound -> %while_ %parenL expression1 %parenR statement
  {% postprocessWith(buildWhileStmt) %}

compound -> %switch_ %parenL expression1 %parenR %curlyL (%case_ value %colon statement):* (%default_ %colon statement):? %curlyR
  {% postprocessWith(buildSwitchStmt) %}


@include "./Expression.ne"
