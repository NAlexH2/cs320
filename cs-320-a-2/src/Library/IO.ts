// You're not expected to read or understand this code, and please do not modify
// it. This is just some helper code to set up the interaction on the webpage.

import {
  AST, PlusNode, NegateNode, NumLeaf, NameLeaf, Scope,
  lookup, interpret, astToString, simplifyNegatedLeaves,
  countNameOccurrences, substituteAllNames, removeDoubleNegations
} from "../Main";

export const identity = <A> (x: A) => x;

export type Parsers<Ts> = {
  [i in keyof Ts]: (input: string) => Ts[i];
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

export const readTree = (source: string): AST => {
  const tokens = tokenize(source);
  if (tokens == null) throw new Error("invalid arithmetic expression")
  const parse = parseTree(tokens);
  if (parse == null) throw new Error("invalid arithmetic expression")
  const [tree, tail] = parse;
  if (tail.length != 0) throw new Error("invalid arithmetic expression")
  return tree;
}

export const readScope = (source: string): Scope => {
  const tokens = tokenize(source);
  if (tokens == null) throw new Error("invalid scope")
  const parse = parseScope(tokens);
  if (parse == null) throw new Error("invalid scope")
  const [tree, tail] = parse;
  if (tail.length != 0) throw new Error("invalid scope")
  return tree;
}

const lexicon = [
  "-", "\\+", "-?(?:(?:\\d+(?:\\.\\d*)?)|\\.\\d+)", "[A-Za-z]\\w*",
  "\\(", "\\)", ",", "="
];

export const tokenize = (source: string): string[] | null => {
  const lexemes: string[] = [];
  source.trimEnd();
  while (source != "") {
    source = source.trimStart();
    let matched = false;
    for (const lexeme of lexicon) {
      const match = source.match(RegExp("^(" + lexeme + ")"));
      if (match && match[0]) {
        source = source.substring(match[0].length)
        lexemes.push(match[0]);
        matched = true;
        break;
      }
    }
    if (!matched)
      return null;
  }
  return lexemes;
}

type Parser<T> = (tokens: string[]) => [T, string[]] | null;

export const parseScope: Parser<Scope> = tokens => {
  if (tokens.length == 0)
    return [new Map, tokens];
  else {
    const nameParse = parseName(tokens);
    if (nameParse == null) return null;
    const [nameLeaf, [equal, valStr, ...tail1]] = nameParse;
    if (equal != "=") return null;
    const val = readNum(valStr);
    if (tail1[0] == ",") {
      const restParse = parseScope(tail1.slice(1));
      if (restParse == null) return null;
      const [rest, tail2] = restParse;
      if (rest.has(nameLeaf.name))
        return [rest, tail2];
      else
        return [new Map([[nameLeaf.name, val], ...rest]), tail2];
    } else
      return [new Map([[nameLeaf.name, val]]), tail1];
  }
}

const parseName: Parser<NameLeaf> = tokens => {
  const [head, ...tail] = tokens;
  if (head && /[A-Za-z]\w*/.test(head))
    return [{ tag: "name", name: head }, tail];
  else
    return null;
}

const parseTree: Parser<AST> = tokens =>
  parsePlus(tokens) ?? parseNegate(tokens) ?? parseAtom(tokens);

const parseAtom: Parser<AST> = tokens =>
  parseNum(tokens) ?? parseName(tokens) ?? parseParens(tokens);

const parseParens: Parser<AST> = tokens => {
  const [head, ...tail] = tokens;
  if (head != "(") return null;
  const parse = parseTree(tail);
  if (parse == null) return null;
  const [tree, [head2, ...tail2]] = parse;
  if (head2 !== ")") return null;
  return [tree, tail2];
}

const parseNum: Parser<NumLeaf> = tokens => {
  const [head, ...tail] = tokens;
  if (head == null) return null;
  const val = Number.parseFloat(head);
  if (!Number.isFinite(val)) return null;
  return [{ tag: "num", value: val }, tail];
}

const parseNegate: Parser<NegateNode> = tokens => {
  const [head, ...tail] = tokens;
  if (head != "-") return null;
  const parse = parseNegate(tail) ?? parseAtom(tail);
  if (parse == null) return null;
  const [tree, tail2] = parse;
  return [{ tag: "negate", subtree: tree }, tail2];
}

const parsePlus: Parser<PlusNode> = tokens => {
  const parse1 = parseNegate(tokens) ?? parseAtom(tokens);
  if (parse1 == null) return null;
  const [tree1, [head, ...tail1]] = parse1;
  if (head != "+") return null;
  const parse2 = parsePlus(tail1) ?? parseNegate(tail1) ?? parseAtom(tail1);
  if (parse2 == null) return null;
  const [tree2, tail2] = parse2;
  return [{ tag: "plus", leftSubtree: tree1, rightSubtree: tree2 }, tail2];
}

export const prettyPrintObject = (obj: object): HTMLElement => {
  const numElement = document.createElement("span");
  numElement.innerText = obj.toString();
  return numElement;
}

export const prettyPrintScope = (scope: Scope): HTMLElement => {
  const table = document.createElement("table");
  table.className = "scope";

  const headerRow = table.appendChild(document.createElement("tr"));
  const nameHeader = headerRow.appendChild(document.createElement("th"));
  nameHeader.innerText = "Name";
  const valHeader = headerRow.appendChild(document.createElement("th"));
  valHeader.innerText = "Value";

  for (const [name, val] of scope.entries()) {
    const row = table.appendChild(document.createElement("tr"));
    const nameHeader = row.appendChild(document.createElement("td"));
    nameHeader.innerText = name;
    const valHeader = row.appendChild(document.createElement("td"));
    valHeader.innerText = val.toString();
  }

  return table;
}

export const unparseTree = (tree: AST): string => {
  switch (tree.tag) {
    case "plus":
      return (
        (
          tree.leftSubtree.tag == "plus"
            ? "(" + unparseTree(tree.leftSubtree) + ")"
            : unparseTree(tree.leftSubtree)
        ) +
        " + " +
        unparseTree(tree.rightSubtree)
      );
    case "negate":
      return (
        "-" +
        (
          tree.subtree.tag == "plus"
            ? "(" + unparseTree(tree.subtree) + ")"
            : unparseTree(tree.subtree)
        )
      );
    case "num":
      return tree.value.toString()
    case "name":
      return tree.name;
  }
}

export const prettyPrintTree = (tree: AST): HTMLElement => {
  const containerElement = document.createElement("div");

  const unparseElement = document.createElement("p");
  unparseElement.innerText = unparseTree(tree);
  containerElement.appendChild(unparseElement);

  const treeElement = document.createElement("ast-tree");
  treeElement.appendChild(prettyPrintNode(tree));
  containerElement.appendChild(treeElement);

  return containerElement;
};

export const prettyPrintNode = (tree: AST): HTMLElement => {
  const rootElement = document.createElement("ast-node");
  switch (tree.tag) {
    case "plus":
      rootElement.setAttribute("data-name", "plus");
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
