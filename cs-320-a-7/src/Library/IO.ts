// You're not expected to read or understand this code, and please do not modify
// it. This is just some helper code to set up the interaction on the webpage.

import * as indentTextarea from "indent-textarea";
import { Token } from "moo";
import { runTypechecker } from "../Main";
import { SourceType, ReturnType } from "../Type";

import {
  Expr,
  PlusExpr, MinusExpr, TimesExpr, DivideExpr, ExponentExpr,
  AndExpr, OrExpr, EqualExpr,
  NegateExpr, NotExpr,
  VarLeaf, BoolLeaf, NumLeaf, InputExpr, CallExpr
} from "../Expression";

import {
  Stmt,
  VarDeclStmt, VarUpdateStmt, PrintStmt,
  BlockStmt, IfStmt, WhileStmt, CallStmt
} from "../Statement";

import { Prog } from "../Program";
import { Func } from "../Function";


export const identity = <A> (x: A) => x;

export const empty = (): HTMLElement => {
  const emptySpan = document.createElement("span");
  emptySpan.classList.add("empty");
  return emptySpan;
}

export type Parsers<Ts> = {
  [i in keyof Ts]: (input: string) => Ts[i];
}

window.onload = () => {
  const toggle = <HTMLInputElement> document.getElementById("toggle-colorscheme");
  if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    toggle.checked = true;
  toggleColorScheme(toggle.checked);

  indentTextarea.watch("textarea.codebox");
}

export const toggleColorScheme = (darkMode: boolean): void => {
  const darkmodeLink = <HTMLLinkElement> document.getElementById("darkmode");
  darkmodeLink.disabled = !darkMode;
}

export const handleForm =
  <Ts extends any[], T> (
    form: HTMLFormElement,
    parsers: Parsers<Ts>,
    prettyPrinter: (output: T) => HTMLElement,
    handle: (...inputs: Ts) => T
  ): void => {
  const output = form.querySelector(".output")!;
  try {
    const inputValues = <Ts> Array.from(
      <NodeListOf<HTMLInputElement>> form.querySelectorAll("input[type=text], textarea"),
      (input, i) => parsers[i]!(input.value)
    );
    output.innerHTML = prettyPrinter(handle(...inputValues)).outerHTML;
  } catch (e) {
    if (e instanceof Error)
      output.innerHTML = "Uncaught exception: " + e.message;
  }
}

export const typecheck = (source: string): string => {
  runTypechecker(source);
  return "Success!";
}

export const curry =
  <S, Ts extends any[], T> (
    f: (first: S, ...rest: Ts) => T
  ) => (
    first: S
  ) => (
    ...rest: Ts
  ): T =>
    f(first, ...rest);

export const chainVoid =
  <Ts extends any[], T> (
    f: (...args: [...Ts, T]) => void
  ) => (
    ...args: [...Ts, T]
  ): T => {
    f(...args);
    return args[args.length - 1];
  }

export const readNum = (input: string): number => {
  if (!/^-?(?:(?:\d+(?:\.\d*)?)|\.\d+)$/.test(input))
    throw new Error("invalid number: " + input);
  return Number.parseFloat(input);
}

export const readString = (input: string): string => {
  if (!/^"[^"]*"$/.test(input))
    throw new Error("invalid string: " + input);
  return input.slice(1, -1);
}

export const prettyPrintObject = (obj: object): HTMLElement => {
  const objElement = document.createElement("span");
  objElement.innerText = obj.toString();
  return objElement;
}

export const prettyPrintString = (str: string): HTMLElement => {
  const strElement = document.createElement("span");
  strElement.innerText = str;
  return strElement;
}

export const prettyPrintToken = (token: Token): HTMLElement => {
  const tokenTable = document.createElement("table");
  tokenTable.className = "token-table";

  const headerRow = tokenTable.appendChild(document.createElement("tr"));
  const typeHeader = headerRow.appendChild(document.createElement("th"));
  typeHeader.innerText = "type";
  const textHeader = headerRow.appendChild(document.createElement("th"));
  textHeader.innerText = "text";

  const tokenRow = tokenTable.appendChild(document.createElement("tr"));
  const typeCell = tokenRow.appendChild(document.createElement("td"));
  typeCell.innerText = token.type!;
  const nameCell = tokenRow.appendChild(document.createElement("td"));
  nameCell.innerText = token.text;

  return tokenTable;
}

export const prettyPrintTokenArray = (tokens: Token[]): HTMLElement => {
  const rootElement = document.createElement("div");
  rootElement.className = "token-array";
  for (const token of tokens)
    rootElement.appendChild(prettyPrintToken(token));
  return rootElement
}

export const prettyPrintProg = (prog: Prog): HTMLElement => {
  const rootElement = document.createElement("div");
  rootElement.className = "ast-array";

  for (const func of prog.functions.functionsInScope()) {
    const containerElement = rootElement.appendChild(document.createElement("div"));
    containerElement.className = "ast-container"

    const unparseElement = document.createElement("pre");
    unparseElement.classList.add("code");
    unparseElement.innerText = func.toString();
    containerElement.appendChild(unparseElement);

    const treeElement = document.createElement("ast-tree");
    treeElement.appendChild(prettyPrintNode(func));
    containerElement.appendChild(treeElement);
  }

  return rootElement;
};

const prettyPrintTree = <T extends Expr | Stmt | Func> (tree: T): HTMLElement => {
  const rootElement = document.createElement("div");
  rootElement.className = "ast-array";

  const containerElement = rootElement.appendChild(document.createElement("div"));
  containerElement.className = "ast-container"

  const unparseElement = document.createElement("pre");
  unparseElement.classList.add("code");
  unparseElement.innerText = tree.toString();
  containerElement.appendChild(unparseElement);

  const treeElement = document.createElement("ast-tree");
  treeElement.appendChild(prettyPrintNode(tree));
  containerElement.appendChild(treeElement);

  return rootElement;
};

export const prettyPrintFunc: (tree: Func) => HTMLElement = prettyPrintTree;
export const prettyPrintExpr: (tree: Expr) => HTMLElement = prettyPrintTree;
export const prettyPrintStmt: (tree: Stmt) => HTMLElement = prettyPrintTree;

const hasConstructorName =
  <T> (thing: any, name: string): thing is T =>
    thing.constructor.name == name;

export const prettyPrintNode = (tree: Expr | Stmt | Func): HTMLElement => {
  const rootElement = document.createElement("ast-node");
  if (hasConstructorName<PlusExpr>(tree, "PlusExpr")) {
    rootElement.setAttribute("data-name", "plus");
    rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
    rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
  } else if (hasConstructorName<MinusExpr>(tree, "MinusExpr")) {
    rootElement.setAttribute("data-name", "minus");
    rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
    rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
  } else if (hasConstructorName<TimesExpr>(tree, "TimesExpr")) {
    rootElement.setAttribute("data-name", "times");
    rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
    rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
  } else if (hasConstructorName<DivideExpr>(tree, "DivideExpr")) {
    rootElement.setAttribute("data-name", "divide");
    rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
    rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
  } else if (hasConstructorName<ExponentExpr>(tree, "ExponentExpr")) {
    rootElement.setAttribute("data-name", "exponent");
    rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
    rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
  } else if (hasConstructorName<AndExpr>(tree, "AndExpr")) {
    rootElement.setAttribute("data-name", "and");
    rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
    rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
  } else if (hasConstructorName<OrExpr>(tree, "OrExpr")) {
    rootElement.setAttribute("data-name", "or");
    rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
    rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
  } else if (hasConstructorName<EqualExpr>(tree, "EqualExpr")) {
    rootElement.setAttribute("data-name", "equal");
    rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
    rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
  } else if (hasConstructorName<NegateExpr>(tree, "NegateExpr")) {
    rootElement.setAttribute("data-name", "negate");
    rootElement.appendChild(prettyPrintNode(tree.subexpr));
  } else if (hasConstructorName<NotExpr>(tree, "NotExpr")) {
    rootElement.setAttribute("data-name", "not");
    rootElement.appendChild(prettyPrintNode(tree.subexpr));
  } else if (hasConstructorName<NumLeaf>(tree, "NumLeaf")) {
    rootElement.setAttribute("data-name", tree.value.toString());
  } else if (hasConstructorName<BoolLeaf>(tree, "BoolLeaf")) {
    rootElement.setAttribute("data-name", tree.value.toString());
  } else if (hasConstructorName<InputExpr>(tree, "InputExpr")) {
    rootElement.setAttribute("data-name", `input&lt;${tree.inputType}&gt;`);
  } else if (hasConstructorName<VarLeaf>(tree, "VarLeaf")) {
    rootElement.setAttribute("data-name", tree.name);
  } else if (hasConstructorName<VarDeclStmt>(tree, "VarDeclStmt")) {
    rootElement.setAttribute("data-name", `varDecl(${tree.varName})`);
    rootElement.appendChild(prettyPrintNode(tree.initialExpr));
  } else if (hasConstructorName<VarUpdateStmt>(tree, "VarUpdateStmt")) {
    rootElement.setAttribute("data-name", `varUpdate(${tree.varName})`);
    rootElement.appendChild(prettyPrintNode(tree.newExpr));
  } else if (hasConstructorName<PrintStmt>(tree, "PrintStmt")) {
    rootElement.setAttribute("data-name", "print");
    rootElement.appendChild(prettyPrintNode(tree.printExpr));
  } else if (hasConstructorName<BlockStmt>(tree, "BlockStmt")) {
    rootElement.setAttribute("data-name", "block");
    for (const blockStmt of tree.blockStmts)
      rootElement.appendChild(prettyPrintNode(blockStmt));
  } else if (hasConstructorName<IfStmt>(tree, "IfStmt")) {
    rootElement.setAttribute("data-name", "if");
    rootElement.appendChild(prettyPrintNode(tree.condition));
    rootElement.appendChild(prettyPrintNode(tree.trueBranch));
    if (tree.falseBranch != null)
      rootElement.appendChild(prettyPrintNode(tree.falseBranch));
  } else if (hasConstructorName<WhileStmt>(tree, "WhileStmt")) {
    rootElement.setAttribute("data-name", "while");
    rootElement.appendChild(prettyPrintNode(tree.condition));
    rootElement.appendChild(prettyPrintNode(tree.body));
  } else if (hasConstructorName<CallExpr>(tree, "CallExpr") || tree instanceof CallStmt) {
    rootElement.setAttribute("data-name", `call(${tree.funcName})`);
    for (const argExpr of tree.argumentExprs)
      rootElement.appendChild(prettyPrintNode(argExpr));
  } else if (hasConstructorName<Func>(tree, "Func")) {
    rootElement.setAttribute("data-name", `funcDecl(${tree.returnType} ${tree.name})(${tree.parameters.map(({ name, type }) => `${type} ${name}`)})`);
    rootElement.appendChild(prettyPrintNode(tree.body));
    const returnElement = rootElement.appendChild(document.createElement("ast-node"));
    returnElement.setAttribute("data-name", "return");
    if (tree.returnExpr != null)
      returnElement.appendChild(prettyPrintNode(tree.returnExpr));
  }
  return rootElement;
}
