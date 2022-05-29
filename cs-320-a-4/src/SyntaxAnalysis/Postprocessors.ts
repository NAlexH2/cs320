import { Token } from "moo";

import {
  Expr, Stmt,
  InfixExpr, PrefixExpr,
  PlusExpr, MinusExpr, TimesExpr, DivideExpr, ExponentExpr,
  AndExpr, OrExpr, LessThanExpr, EqualExpr,
  NegateExpr, NotExpr,
  ConditionalExpr,
  NumLeaf, BoolLeaf, VarLeaf,
  BlockStmt, IfStmt, ForStmt,
  VarDeclStmt, VarUpdateStmt, PrintStmt, AssertStmt
} from "../AST";

import { postprocessWithTag } from "../Library/Parsing";

export function buildConditionalExpr(
  conditionExpr: Expr,
  question: Token,
  trueExpr: Expr,
  colon: Token,
  falseExpr: Expr
): ConditionalExpr {
  return {
    tag: "conditional",
    condition: conditionExpr,
    trueExpr: trueExpr,
    falseExpr: falseExpr
  };
}

function buildInfixExpr(
  leftExpr: Expr,
  operator: Token,
  rightExpr: Expr
): InfixExpr {
  return {
    leftSubexpr: leftExpr,
    rightSubexpr: rightExpr
  };
}

function buildPrefixExpr(
  operator: Token,
  expr: Expr
): PrefixExpr {
  return { subexpr: expr };
}

type InfixBuilder<TreeType> = (args: [Expr, Token, Expr]) => TreeType;
type PrefixBuilder<TreeType> = (args: [Token, Expr]) => TreeType;

export const buildPlusExpr: InfixBuilder<PlusExpr> =
  postprocessWithTag("plus", buildInfixExpr);

export const buildMinusExpr: InfixBuilder<MinusExpr> =
  postprocessWithTag("minus", buildInfixExpr);

export const buildTimesExpr: InfixBuilder<TimesExpr> =
  postprocessWithTag("times", buildInfixExpr);

export const buildDivideExpr: InfixBuilder<DivideExpr> =
  postprocessWithTag("divide", buildInfixExpr);

export const buildExponentExpr: InfixBuilder<ExponentExpr> =
  postprocessWithTag("exponent", buildInfixExpr);

export const buildAndExpr: InfixBuilder<AndExpr> =
  postprocessWithTag("and", buildInfixExpr);

export const buildOrExpr: InfixBuilder<OrExpr> =
  postprocessWithTag("or", buildInfixExpr);

export const buildLessThanExpr: InfixBuilder<LessThanExpr> =
  postprocessWithTag("lessThan", buildInfixExpr);

export const buildEqualExpr: InfixBuilder<EqualExpr> =
  postprocessWithTag("equal", buildInfixExpr);

export const buildNegateExpr: PrefixBuilder<NegateExpr> =
  postprocessWithTag("negate", buildPrefixExpr);

export const buildNotExpr: PrefixBuilder<NotExpr> =
  postprocessWithTag("not", buildPrefixExpr);

export function buildNumLeaf(
  numToken: Token
) {
  return {
    tag: "num",
    value: Number.parseFloat(numToken.text)
  };
}

export function buildBoolLeaf(
  boolToken: Token
) {
  return {
    tag: "bool",
    value: boolToken.text == "true"
  };
}

export function buildVarLeaf(
  nameToken: Token
): VarLeaf {
  return {
    tag: "var",
    name: nameToken.text
  };
}

export function unparenthesize(
  leftParen: Token,
  tree: Expr,
  rightParen: Token
): Expr {
  return tree;
}

export function buildCommandStmt(
  stmt: Stmt,
  semicolon: Token
): Stmt {
  return stmt;
}

export function buildVarDeclStmt(
  let_: Token,
  varName: Token,
  equal: Token,
  expr: Expr,
): VarDeclStmt {
  return {
    tag: "varDecl",
    name: varName.text,
    initialExpr: expr
  }
}

export function buildVarUpdateStmt(
  varName: Token,
  equal: Token,
  expr: Expr,
): VarUpdateStmt {
  return {
    tag: "varUpdate",
    name: varName.text,
    newExpr: expr
  }
}

export function buildPrintStmt(
  print: Token,
  expr: Expr,
): PrintStmt {
  return {
    tag: "print",
    printExpr: expr
  }
}

export function buildAssertStmt(
  print: Token,
  expr: Expr,
): AssertStmt {
  return {
    tag: "assert",
    condition: expr
  }
}

export function buildBlockStmt(
  curlyL: Token,
  stmts: Stmt[],
  curlyR: Token
): BlockStmt {
  return {
    tag: "block",
    blockStmts: stmts
  }
}

export function buildIfStmt(
  if_: Token,
  parenL: Token,
  condition: Expr,
  parenR: Token,
  trueBranch: Stmt,
  else_: [Token, Stmt] | null
): IfStmt {
  return {
    tag: "if",
    condition: condition,
    trueBranch: trueBranch,
    falseBranch: else_ == null ? null : else_[1]
  }
}

export function buildForStmt(
  for_: Token,
  parenL: Token,
  name: Token,
  assign: Token,
  initialExpr: Expr,
  semicolon1: Token,
  condition: Expr,
  semicolon2: Token,
  update: Stmt,
  parenR: Token,
  body: Stmt
): ForStmt {
  return {
    tag: "for",
    name: name.text,
    initialExpr: initialExpr,
    condition: condition,
    update: update,
    body: body
  }
}
