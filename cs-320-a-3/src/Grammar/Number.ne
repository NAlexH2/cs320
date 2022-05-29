@{%
  import {
    convertFloat, convertHex, convertChar
  } from "../../src/Grammar/Postprocessors"
%}

@lexer lexer


number -> %hex
  {% postprocessWith(convertHex) %}

number -> %float
  {% postprocessWith(convertFloat) %}

number -> %char
  {% postprocessWith(convertChar) %}