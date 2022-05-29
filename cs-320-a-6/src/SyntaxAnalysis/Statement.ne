@lexer lexer

@{%
  import {
    buildCommandStmt,
    buildVarDeclStmt, buildVarUpdateStmt, buildPrintStmt,
    buildBlockStmt, buildIfStmt, buildWhileStmt,
    buildCallStmt
  } from "../src/SyntaxAnalysis/Postprocessors"
%}


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

command -> %name %parenL argumentList %parenR
  {% postprocessWith(buildCallStmt) %}

compound -> %curlyL statement:* %curlyR
  {% postprocessWith(buildBlockStmt) %}

compound -> %if_ %parenL expression1 %parenR statement (%else_ statement):?
  {% postprocessWith(buildIfStmt) %}

compound -> %while_ %parenL expression1 %parenR statement
  {% postprocessWith(buildWhileStmt) %}
