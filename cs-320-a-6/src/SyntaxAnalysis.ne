@preprocessor typescript

@{%
  import { Token } from "moo";
  import { lexer } from "../src/SyntaxAnalysis/Lexer";
  import { buildProg } from "../src/SyntaxAnalysis/Postprocessors";
  import { postprocessWith } from "../src/Library/Parsing";
%}

@lexer lexer

program -> functionDeclaration:+
  {% postprocessWith(buildProg) %}

@include "./SyntaxAnalysis/Function.ne"
@include "./SyntaxAnalysis/Expression.ne"
@include "./SyntaxAnalysis/Statement.ne"
