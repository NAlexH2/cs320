// **Read the README first!**

import { parse } from "./SyntaxAnalysis";
import { clearOutput } from "./Library/Runtime";

export function runTypechecker(source: string): void {
  parse(source).typecheck();
}

export function runInterpreter(source: string): void {
  clearOutput();
  parse(source).interpret();
}