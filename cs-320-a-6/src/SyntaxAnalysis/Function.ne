@lexer lexer

@{%
  import {
    buildParam, buildCommaList, buildFuncDecl
  } from "../src/SyntaxAnalysis/Postprocessors"
%}

parameter -> %type %name
  {% postprocessWith(buildParam) %}

parameterList -> (parameter (%comma parameter):*):?
  {% postprocessWith(buildCommaList) %}

functionDeclaration ->
    (%type | %void_) %name
    %parenL parameterList %parenR
    %curlyL statement:* %return_ expression1:? %semicolon %curlyR
  {% postprocessWith(buildFuncDecl) %}

argumentList -> (expression1 (%comma expression1):*):?
  {% postprocessWith(buildCommaList) %}
