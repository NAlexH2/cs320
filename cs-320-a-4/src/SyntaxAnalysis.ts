import { Expr, Stmt } from "./AST";

import { Lexer, Token } from "moo";
import { Grammar, Parser } from "nearley";
import { lexer } from "./SyntaxAnalysis/Lexer";

import { default as exprRules } from "../gen/SyntaxAnalysis/Expression";
import { default as stmtRules } from "../gen/SyntaxAnalysis/Statement";

const exprGrammar: Grammar = Grammar.fromCompiled(exprRules);
const stmtGrammar: Grammar = Grammar.fromCompiled(stmtRules);

export function lex(source: string): Token[] {
  lexer.reset(source);
  return Array.from(lexer);
}

export class NoParseError extends Error { }

export function parseExpr(source: string): Expr {
  const parses = new Parser(exprGrammar).feed(source).finish();
  if (parses.length < 1)
    throw new NoParseError("invalid expression: " + source);
  return parses[0];
}

export function parseStmt(source: string): Stmt {
  const parses = new Parser(stmtGrammar).feed(source).finish();
  if (parses.length < 1)
    throw new NoParseError("invalid statement: " + source);
  return parses[0];
}

export function exprToString(expr: Expr): string {
  switch (expr.tag) {
    case "plus":
      return (
        "(" + exprToString(expr.leftSubexpr) +
        " + " + exprToString(expr.rightSubexpr) +
        ")"
      );

    case "minus":
      return (
        "(" + exprToString(expr.leftSubexpr) +
        " - " + exprToString(expr.rightSubexpr) +
        ")"
      );

    case "times":
      return (
        "(" + exprToString(expr.leftSubexpr) +
        " * " + exprToString(expr.rightSubexpr) +
        ")"
      );

    case "divide":
      return (
        "(" + exprToString(expr.leftSubexpr) +
        " / " + exprToString(expr.rightSubexpr) +
        ")"
      );

    case "exponent":
      return (
        "(" + exprToString(expr.leftSubexpr) +
        " ^ " + exprToString(expr.rightSubexpr) +
        ")"
      );

    case "and":
      return (
        "(" + exprToString(expr.leftSubexpr) +
        " && " + exprToString(expr.rightSubexpr) +
        ")"
      );

    case "or":
      return (
        "(" + exprToString(expr.leftSubexpr) +
        " || " + exprToString(expr.rightSubexpr) +
        ")"
      );

    case "lessThan":
      return (
        "(" + exprToString(expr.leftSubexpr) +
        " < " + exprToString(expr.rightSubexpr) +
        ")"
      );

    case "equal":
      return (
        "(" + exprToString(expr.leftSubexpr) +
        " == " + exprToString(expr.rightSubexpr) +
        ")"
      );

    case "negate":
      return "(- " + exprToString(expr.subexpr) + ")";

    case "not":
      return "(! " + exprToString(expr.subexpr) + ")";

    case "conditional":
      return (
        "(" + exprToString(expr.condition) +
        " ? " + exprToString(expr.trueExpr) +
        " : " + exprToString(expr.falseExpr) +
        ")"
      );

    case "num":
      return expr.value.toString();

    case "bool":
      return expr.value.toString();

    case "var":
      return expr.name;
  }
}

export function stmtToString(
  stmt: Stmt,
  indentLevel: number = 0
): string {
  const indent: string = "  ".repeat(indentLevel);
  switch (stmt.tag) {
    case "varDecl":
      return indent + (
        "declare " + stmt.name + " = " +
        exprToString(stmt.initialExpr) +
        ";"
      );

    case "varUpdate":
      return indent + (
        stmt.name + " = " +
        exprToString(stmt.newExpr) +
        ";"
      );

    case "print":
      return indent + (
        "print " + exprToString(stmt.printExpr) +
        ";"
      );

    case "assert":
      return indent + (
        "assert " + exprToString(stmt.condition) +
        ";"
      );

    case "block": {
      const blockStmtStrings: string[] = [];
      for (const blockStmt of stmt.blockStmts)
        blockStmtStrings.push(stmtToString(blockStmt, indentLevel + 1));
      return (
        indent + "{\n" +
        blockStmtStrings.join("\n") +
        "\n" + indent + "}"
      );
    }

    case "if": {
      let ifStr = indent + (
        "if (" + exprToString(stmt.condition) + ")\n" +
        stmtToString(stmt.trueBranch, indentLevel + 1)
      );
      if (stmt.falseBranch != null)
        ifStr += (
          "\n" + indent + "else\n" +
          stmtToString(stmt.falseBranch, indentLevel + 1)
        );
      return ifStr;
    }

    case "for": {
      return indent + (
        "for (" + stmt.name + " = " + exprToString(stmt.initialExpr) +
        "; " + exprToString(stmt.condition) +
        "; " + stmtToString(stmt.update).slice(0, -1) +
        ")\n" + stmtToString(stmt.body, indentLevel + 1)
      );
    }
  }
}
