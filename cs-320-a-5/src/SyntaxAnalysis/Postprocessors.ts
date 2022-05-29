import { Token } from "moo";

import {
  SourceType, Expr, Stmt,
  InfixExpr, PrefixExpr, ValueLeafOf, ValueLeaf,
  PlusExpr, MinusExpr, TimesExpr, DivideExpr, ExponentExpr,
  AndExpr, OrExpr, LessThanExpr, EqualExpr,
  NegateExpr, NotExpr,
  InputExpr,
  VarLeaf,
  VarDeclStmt, VarUpdateStmt, PrintStmt,
  BlockStmt, IfStmt, WhileStmt, SwitchStmt
} from "../AST";

import { postprocessWithTag } from "../Library/Parsing";

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

export function buildInputExpr(
  input: Token,
  angleLeft: Token,
  type: SourceType,
  angleRight: Token
): InputExpr {
  return {
    tag: "input",
    type: type
  }
}

export function buildNumLeaf(
  numToken: Token
): ValueLeafOf<"num"> {
  return {
    tag: "num",
    value: Number.parseFloat(numToken.text)
  };
}

export function buildBoolLeaf(
  boolToken: Token
): ValueLeafOf<"bool"> {
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

export function buildWhileStmt(
  while_: Token,
  parenL: Token,
  condition: Expr,
  parenR: Token,
  body: Stmt
): WhileStmt {
  return {
    tag: "while",
    condition: condition,
    body: body
  }
}

export function buildSwitchStmt(
  switch_: Token,
  parenL: Token,
  scrutinee: Expr,
  parenR: Token,
  curlyL: Token,
  valueCases: [Token, ValueLeaf, Token, Stmt][],
  defaultCase: [Token, Token, Stmt] | null,
  curlyR: Token
): SwitchStmt {
  return {
    tag: "switch",
    scrutinee: scrutinee,
    valueCases: new Map(valueCases.map(([case_, valueLeaf, colon, body]) => [valueLeaf.value, body])),
    defaultCase: defaultCase == null ? null : defaultCase[2]
  };
}
