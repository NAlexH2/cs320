// You're not expected to read or understand this code, and please do not modify
// it. This is just some helper code to set up the interaction on the webpage.

import * as indentTextarea from "indent-textarea";
import { Token } from "moo";
import { Expr, Stmt, Value } from "../AST";
import { exprToString, stmtToString } from "../SyntaxAnalysis";
import { inferValueType } from "../StaticAnalysis";
import { Scope } from "../Execution";
import { runTypechecker } from "../Main";

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
      (input, i) => parsers[i](input.value)
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

export const prettyPrintScope = (scope: Scope): HTMLElement => {
  const table = document.createElement("table");
  table.className = "scope";

  const headerRow = table.appendChild(document.createElement("tr"));
  const nameHeader = headerRow.appendChild(document.createElement("th"));
  nameHeader.innerText = "name";
  const valHeader = headerRow.appendChild(document.createElement("th"));
  valHeader.innerText = "value";

  for (const [name, val] of scope.entries()) {
    const row = table.appendChild(document.createElement("tr"));
    const nameCell = row.appendChild(document.createElement("td"));
    nameCell.innerText = name;
    const valCell = row.appendChild(document.createElement("td"));
    valCell.innerText = val.toString();
  }

  return table;
}

const prettyPrintTree = <T extends Expr | Stmt> (unparse: (tree: T) => string) => (tree: T): HTMLElement => {
  const rootElement = document.createElement("div");
  rootElement.className = "ast-array";

  const containerElement = rootElement.appendChild(document.createElement("div"));
  containerElement.className = "ast-container"

  const unparseElement = document.createElement("pre");
  unparseElement.classList.add("code");
  unparseElement.innerText = unparse(tree);
  containerElement.appendChild(unparseElement);

  const treeElement = document.createElement("ast-tree");
  treeElement.appendChild(prettyPrintNode(tree));
  containerElement.appendChild(treeElement);

  return rootElement;
};

export const prettyPrintExpr = prettyPrintTree<Expr>(exprToString);
export const prettyPrintStmt = prettyPrintTree<Stmt>(stmtToString);

export const prettyPrintNode = (tree: Expr | Stmt): HTMLElement => {
  const rootElement = document.createElement("ast-node");
  switch (tree.tag) {
    case "plus":
      rootElement.setAttribute("data-name", "plus");
      rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
      rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
      break;
    case "minus":
      rootElement.setAttribute("data-name", "minus");
      rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
      rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
      break;
    case "times":
      rootElement.setAttribute("data-name", "times");
      rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
      rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
      break;
    case "divide":
      rootElement.setAttribute("data-name", "divide");
      rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
      rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
      break;
    case "exponent":
      rootElement.setAttribute("data-name", "exponent");
      rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
      rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
      break;
    case "and":
      rootElement.setAttribute("data-name", "and");
      rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
      rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
      break;
    case "or":
      rootElement.setAttribute("data-name", "or");
      rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
      rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
      break;
    case "lessThan":
      rootElement.setAttribute("data-name", "lessThan");
      rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
      rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
      break;
    case "equal":
      rootElement.setAttribute("data-name", "equal");
      rootElement.appendChild(prettyPrintNode(tree.leftSubexpr));
      rootElement.appendChild(prettyPrintNode(tree.rightSubexpr));
      break;
    case "negate":
      rootElement.setAttribute("data-name", "negate");
      rootElement.appendChild(prettyPrintNode(tree.subexpr));
      break;
    case "not":
      rootElement.setAttribute("data-name", "not");
      rootElement.appendChild(prettyPrintNode(tree.subexpr));
      break;
    case "num":
      rootElement.setAttribute("data-name", tree.value.toString());
      break;
    case "bool":
      rootElement.setAttribute("data-name", tree.value.toString());
      break;
    case "input":
      rootElement.setAttribute("data-name", `input&lt;${tree.type}&gt;`);
      break;
    case "var":
      rootElement.setAttribute("data-name", tree.name);
      break;
    case "varDecl":
      rootElement.setAttribute("data-name", `varDecl(${tree.name})`);
      rootElement.appendChild(prettyPrintNode(tree.initialExpr));
      break;
    case "varUpdate":
      rootElement.setAttribute("data-name", `varUpdate(${tree.name})`);
      rootElement.appendChild(prettyPrintNode(tree.newExpr));
      break;
    case "print":
      rootElement.setAttribute("data-name", "print");
      rootElement.appendChild(prettyPrintNode(tree.printExpr));
      break;
    case "block":
      rootElement.setAttribute("data-name", "block");
      for (const blockStmt of tree.blockStmts)
        rootElement.appendChild(prettyPrintNode(blockStmt));
      break;
    case "if":
      rootElement.setAttribute("data-name", "if");
      rootElement.appendChild(prettyPrintNode(tree.condition));
      rootElement.appendChild(prettyPrintNode(tree.trueBranch));
      if (tree.falseBranch != null)
        rootElement.appendChild(prettyPrintNode(tree.falseBranch));
      break;
    case "while":
      rootElement.setAttribute("data-name", "while");
      rootElement.appendChild(prettyPrintNode(tree.condition));
      rootElement.appendChild(prettyPrintNode(tree.body));
      break;
    case "switch":
      rootElement.setAttribute("data-name", "switch");
      rootElement.appendChild(prettyPrintNode(tree.scrutinee));
      for (const [value, body] of tree.valueCases.entries()) {
        const caseNode = rootElement.appendChild(document.createElement("ast-node"));
        caseNode.setAttribute("data-name", "case");
        caseNode.appendChild(prettyPrintNode({ tag: inferValueType(value), value: <any> value }));
        caseNode.appendChild(prettyPrintNode(body));
      }
      break;
  }
  return rootElement;
}
