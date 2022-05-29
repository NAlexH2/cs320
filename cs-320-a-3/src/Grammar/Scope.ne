@preprocessor typescript

@{%
  import { Scope, Binding } from "../../src/AST";

  import { Token } from "moo";
  import { lexer } from "../../src/Grammar/Lexer";

  import { postprocessWith } from "../../src/Library/Parsing";

  import {
    buildEmptyScope, buildNonEmptyScope,
    buildBinding, buildCommaBinding
  } from "../../src/Grammar/Postprocessors"
%}

@lexer lexer


scope -> null
  {% postprocessWith(buildEmptyScope) %}

scope -> binding commaBinding:*
  {% postprocessWith(buildNonEmptyScope) %}


binding -> %name %equal number
  {% postprocessWith(buildBinding) %}

commaBinding -> %comma binding
  {% postprocessWith(buildCommaBinding) %}


@include "./Number.ne"