// You're not expected to read or understand this code, and please do not modify
// it. This is just some helper code to set up the interaction on the webpage.

import { Token } from "moo";
import { AST, Scope } from "../AST";
import { treeToString } from "../Main";

export const identity = <A> (x: A) => x;

export type Parsers<Ts> = {
  [i in keyof Ts]: (input: string) => Ts[i];
}

window.onload = () => {
  const toggle = <HTMLInputElement> document.getElementById("toggle-colorscheme");
  if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    toggle.checked = true;
  toggleColorScheme(toggle.checked);
}

export const toggleColorScheme = (darkMode: boolean): void => {
  const darkmode = <HTMLLinkElement> document.getElementById("darkmode");
  darkmode.disabled = !darkMode;
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
      <NodeListOf<HTMLInputElement>> form.querySelectorAll("input[type=text]"),
      (input, i) => parsers[i](input.value)
    );
    output.innerHTML = prettyPrinter(handle(...inputValues)).outerHTML;
  } catch (e) {
    if (e instanceof Error)
      output.innerHTML = "Uncaught exception: " + e.message;
  }
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
  const numElement = document.createElement("span");
  numElement.innerText = obj.toString();
  return numElement;
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

export const prettyPrintTree = (tree: AST): HTMLElement => {
  const rootElement = document.createElement("div");
  rootElement.className = "ast-array";

  const containerElement = rootElement.appendChild(document.createElement("div"));
  containerElement.className = "ast-container"

  const unparseElement = document.createElement("p");
  unparseElement.innerText = treeToString(tree);
  containerElement.appendChild(unparseElement);

  const treeElement = document.createElement("ast-tree");
  treeElement.appendChild(prettyPrintNode(tree));
  containerElement.appendChild(treeElement);

  return rootElement;
};

export const prettyPrintNode = (tree: AST): HTMLElement => {
  const rootElement = document.createElement("ast-node");
  switch (tree.tag) {
    case "plus":
      rootElement.setAttribute("data-name", "plus");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "minus":
      rootElement.setAttribute("data-name", "minus");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "times":
      rootElement.setAttribute("data-name", "times");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "exponent":
      rootElement.setAttribute("data-name", "exponent");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "negate":
      rootElement.setAttribute("data-name", "negate");
      rootElement.appendChild(prettyPrintNode(tree.subtree));
      break;
    case "num":
      rootElement.setAttribute("data-name", tree.value.toString());
      break;
    case "name":
      rootElement.setAttribute("data-name", tree.name);
      break;
  }
  return rootElement;
}

export const prettyPrintTreeArray = (trees: AST[]): HTMLElement => {
  const rootElement = document.createElement("div");
  rootElement.className = "ast-array";
  for (const tree of trees)
    rootElement.appendChild(prettyPrintTree(tree));
  return rootElement;
}