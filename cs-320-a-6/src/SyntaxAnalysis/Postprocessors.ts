import { Token } from "moo";

import { SourceType, ReturnType } from "../Type";

import {
  Expr,
  InfixExpr, PrefixExpr,
  PlusExpr, MinusExpr, TimesExpr, DivideExpr, ExponentExpr,
  AndExpr, OrExpr, EqualExpr,
  NegateExpr, NotExpr,
  VarLeaf, BoolLeaf, NumLeaf, InputExpr, CallExpr,
  Stmt,
  VarDeclStmt, VarUpdateStmt, PrintStmt,
  BlockStmt, IfStmt, WhileStmt, CallStmt,
  Prog, Func, Param
} from "../AST";

import { ScopeError } from "../Scope";

import { postprocessWith } from "../Library/Parsing";
import { ValueLeaf } from "../Expression/Value";
import { FuncScope } from "../Scope";
import { newFunctionScope } from "../Factories";

interface InfixExprConstructor<T extends InfixExpr> {
  new(leftExpr: Expr, rightExpr: Expr): T;
}

const buildInfixExpr = <T extends InfixExpr> (
  subclassConstructor: InfixExprConstructor<T>
) => (
  leftExpr: Expr,
  operator: Token,
  rightExpr: Expr
): T =>
  new subclassConstructor(leftExpr, rightExpr);

interface PrefixExprConstructor<T> {
  new(subexpr: Expr): T;
}

const buildPrefixExpr = <T extends PrefixExpr> (
  subclassConstructor: PrefixExprConstructor<T>
) => (
  operator: Token,
  expr: Expr
): T =>
  new subclassConstructor(expr);

type InfixBuilder<TreeType> = (args: [Expr, Token, Expr]) => TreeType;
type PrefixBuilder<TreeType> = (args: [Token, Expr]) => TreeType;

export const buildPlusExpr: InfixBuilder<PlusExpr> =
  postprocessWith(buildInfixExpr(PlusExpr));

export const buildMinusExpr: InfixBuilder<MinusExpr> =
  postprocessWith(buildInfixExpr(MinusExpr));

export const buildTimesExpr: InfixBuilder<TimesExpr> =
  postprocessWith(buildInfixExpr(TimesExpr));

export const buildDivideExpr: InfixBuilder<DivideExpr> =
  postprocessWith(buildInfixExpr(DivideExpr));

export const buildExponentExpr: InfixBuilder<ExponentExpr> =
  postprocessWith(buildInfixExpr(ExponentExpr));

export const buildAndExpr: InfixBuilder<AndExpr> =
  postprocessWith(buildInfixExpr(AndExpr));

export const buildOrExpr: InfixBuilder<OrExpr> =
  postprocessWith(buildInfixExpr(OrExpr));

export const buildEqualExpr: InfixBuilder<EqualExpr> =
  postprocessWith(buildInfixExpr(EqualExpr));

export const buildNotExpr: PrefixBuilder<NotExpr> =
  postprocessWith(buildPrefixExpr(NotExpr));

export function buildNegateExpr(
  negate: Token,
  expr: Expr
): Expr {
  if (expr instanceof NumLeaf)
    return new NumLeaf(- expr.value)
  else
    return new NegateExpr(expr);
}

export function buildInputExpr(
  input: Token,
  angleLeft: Token,
  type: Token,
  angleRight: Token
): InputExpr {
  return new InputExpr(<SourceType> type.text);
}

export function buildNumLeaf(
  numToken: Token
): ValueLeaf<number> {
  return new NumLeaf(Number.parseFloat(numToken.text));
}

export function buildBoolLeaf(
  boolToken: Token
): ValueLeaf<boolean> {
  return new BoolLeaf(boolToken.text == "true");
}

export function buildVarLeaf(
  nameToken: Token
): VarLeaf {
  return new VarLeaf(nameToken.text);
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
  return new VarDeclStmt(varName.text, expr);
}

export function buildVarUpdateStmt(
  varName: Token,
  equal: Token,
  expr: Expr,
): VarUpdateStmt {
  return new VarUpdateStmt(varName.text, expr);
}

export function buildPrintStmt(
  print: Token,
  expr: Expr,
): PrintStmt {
  return new PrintStmt(expr);
}

export function buildBlockStmt(
  curlyL: Token,
  stmts: Stmt[],
  curlyR: Token
): BlockStmt {
  return new BlockStmt(stmts);
}

export function buildIfStmt(
  if_: Token,
  parenL: Token,
  condition: Expr,
  parenR: Token,
  trueBranch: Stmt,
  else_: [Token, Stmt] | null
): IfStmt {
  return new IfStmt(condition, trueBranch, else_ == null ? null : else_[1]);
}

export function buildWhileStmt(
  while_: Token,
  parenL: Token,
  condition: Expr,
  parenR: Token,
  body: Stmt
): WhileStmt {
  return new WhileStmt(condition, body);
}

export function buildParam(
  type: Token,
  name: Token
): Param {
  return {
    type: <SourceType> type.text,
    name: name.text
  }
}

export function buildCommaList<T>(
  list: [T, [Token, T][] | null] | null
): T[] {
  if (list == null)
    return [];
  else if (list[1] == null)
    return [list[0]];
  else
    return [list[0], ...list[1].map(([comma, item]) => item)];
}

export function buildFuncDecl(
  type: [Token], name: Token,
  parenL: Token, paramList: Param[], parenR: Token, curlyL: Token,
  stmtList: Stmt[], return_: Token, returnExpr: Expr | null,
  semicolon: Token, curlyR: Token
): Func {
  return new Func(
    name.text,
    <ReturnType> type[0].text,
    paramList,
    new BlockStmt(stmtList),
    returnExpr
  );
}

export function buildCallStmt(
  name: Token,
  parenL: Token,
  argList: Expr[],
  parenR: Token
): CallStmt {
  return new CallStmt(name.text, argList);
}

export function buildCallExpr(
  name: Token,
  parenL: Token,
  argList: Expr[],
  parenR: Token
): CallExpr {
  return new CallExpr(name.text, argList);
}

export function buildProg(
  funcDecls: Func[]
): Prog {
  const funcNames: Set<string> = new Set();
  for (const func of funcDecls) {
    if (funcNames.has(func.name))
      throw new ScopeError("duplicate definition for function: " + func.name);
    else
      funcNames.add(func.name);
  }
  const funcScope: FuncScope = newFunctionScope(new Map(funcDecls.map(func => [func.name, func])));
  return new Prog(funcScope);
}
