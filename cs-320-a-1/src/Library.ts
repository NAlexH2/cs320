// You"re not expected to read or understand this code, and please do not modify
// it. This is just some helper code to set up the interaction on the webpage.

import {
  List, listToString,
  LogicTree, AndNode, NotNode, BoolLeaf, snoc
} from "./Main";

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

export const parseNum = (input: string): number => {
  if (!/^-?(?:(?:\d+(?:\.\d*)?)|\.\d+)$/.test(input))
    throw new Error("invalid number: " + input);
  return Number.parseFloat(input);
}

export const parseList = (input: string): List => {
  // let list = nil();
  input = input.trim();
  return input == ""
    ? null
    : input.split(/\s*,\s*/).reduce<List>((list, token) => snoc(parseNum(token), list), null);
}

export const parseTree = (source: string): LogicTree | null => {
  const tokens = tokenize(source);
  if (tokens == null) throw new Error("invalid Boolean logic expression")
    // Array.from(
    //   source.trim().matchAll(/(true|false)|[\w\(\)\+-]/g),
    //   (match, _) => match[0]!);
  const parse = parseNode(tokens);
  if (parse == null) throw new Error("invalid Boolean logic expression")
  const [tree, tail] = parse;
  if (tail.length != 0) throw new Error("invalid Boolean logic expression")
  return tree;
}

const lexicon = [
  "!", "&&", "true", "false", "(", ")"
];

const tokenize = (source: string): string[] | null => {
  const lexemes: string[] = [];
  source.trimEnd();
  while (source != "") {
    source = source.trimStart();
    let matched = false;
    for (const lexeme of lexicon)
      if (source.startsWith(lexeme)) {
        source = source.substring(lexeme.length);
        lexemes.push(lexeme);
        matched = true;
        break;
      }
    if (!matched)
      return null;
  }
  return lexemes;
}

type Parser<T> = (tokens: string[]) => [T, string[]] | null;

const parseNode: Parser<LogicTree> = tokens =>
  parseAnd(tokens) ?? parseNot(tokens) ?? parseAtom(tokens);

const parseAtom: Parser<LogicTree> = tokens =>
  parseBool(tokens) ?? parseParens(tokens);

const parseParens: Parser<LogicTree> = tokens => {
  const [head, ...tail] = tokens;
  if (head != "(") return null;
  const parse = parseNode(tail);
  if (parse == null) return null;
  const [tree, [head2, ...tail2]] = parse;
  if (head2 !== ")") return null;
  return [tree, tail2];
}

const parseBool: Parser<LogicTree> = tokens => {
  const [head, ...tail] = tokens;
  switch (head) {
    case "true": return [{ tag: "bool", value: true }, tail];
    case "false": return [{ tag: "bool", value: false }, tail];
    default: return null;
  }
}

const parseNot: Parser<LogicTree> = tokens => {
  const [head, ...tail] = tokens;
  if (head != "!") return null;
  const parse = parseNot(tail) ?? parseAtom(tail);
  if (parse == null) return null;
  const [tree, tail2] = parse;
  return [{ tag: "not", subtree: tree }, tail2];
}

const parseAnd: Parser<LogicTree> = tokens => {
  const parse1 = parseNot(tokens) ?? parseAtom(tokens);
  if (parse1 == null) return null;
  const [tree1, [head, ...tail1]] = parse1;
  if (head != "&&") return null;
  const parse2 = parseAnd(tail1) ?? parseNot(tail1) ?? parseAtom(tail1);
  if (parse2 == null) return null;
  const [tree2, tail2] = parse2;
  return [{ tag: "and", leftSubtree: tree1, rightSubtree: tree2 }, tail2];
}

export const prettyPrintObject = (obj: object): HTMLElement => {
  const numElement = document.createElement("span");
  numElement.innerText = obj.toString();
  return numElement;
}

export const prettyPrintList = (list: List): HTMLElement => {
  const listElement = document.createElement("span");
  listElement.innerText = listToString(list);
  return listElement;
}

export const unparseTree = (tree: LogicTree): string => {
  switch (tree.tag) {
    case "and":
      return (
        (
          tree.leftSubtree.tag == "and"
            ? "(" + unparseTree(tree.leftSubtree) + ")"
            : unparseTree(tree.leftSubtree)
        ) +
        " && " +
        unparseTree(tree.rightSubtree)
      );
    case "not":
      return (
        "!" +
        (
          tree.subtree.tag == "and"
            ? "(" + unparseTree(tree.subtree) + ")"
            : unparseTree(tree.subtree)
        )
      );
    case "bool":
      return Boolean(tree.value).toString()
  }
}

export const prettyPrintTree = (tree: LogicTree): HTMLElement => {
  const containerElement = document.createElement("div");

  const unparseElement = document.createElement("p");
  unparseElement.innerText = unparseTree(tree);
  containerElement.appendChild(unparseElement);

  const treeElement = document.createElement("ast-tree");
  treeElement.appendChild(prettyPrintNode(tree));
  containerElement.appendChild(treeElement);

  return containerElement;
};

export const prettyPrintNode = (tree: LogicTree): HTMLElement => {
  const rootElement = document.createElement("ast-node");
  switch (tree.tag) {
    case "and":
      rootElement.setAttribute("data-name", "and");
      rootElement.appendChild(prettyPrintNode(tree.leftSubtree));
      rootElement.appendChild(prettyPrintNode(tree.rightSubtree));
      break;
    case "not":
      rootElement.setAttribute("data-name", "not");
      rootElement.appendChild(prettyPrintNode(tree.subtree));
      break;
    case "bool":
      rootElement.setAttribute("data-name", tree.value.toString());
      break;
  }
  return rootElement;
}

export const createElementSVG =
  <K extends keyof SVGElementTagNameMap> (tag: K) =>
    document.createElementNS("http://www.w3.org/2000/svg", tag);

export class ASTTreeElement extends HTMLElement {
  readonly #shadowRoot: ShadowRoot;

  static readonly #BRANCH_MARGIN_PIXELS = 20;
  static readonly #EDGE_HEIGHT_LINES = 2;

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
      <div>
        <svg id="ast-frame"></svg>
        <slot></slot>
      </div>
    `;

    this.#shadowRoot.appendChild(template.content.cloneNode(true));
  }

  render(): SVGGraphicsElement {
    const frame = this.#shadowRoot.querySelector("#ast-frame") as SVGSVGElement;
    const positionGroup = frame.appendChild(createElementSVG("g"));

    const rootSVG = positionGroup.appendChild(createElementSVG("text"));
    rootSVG.innerHTML = this.getAttribute("data-name") ?? "";

    const rootBox = rootSVG.getBBox();
    const height = rootBox.height * ASTTreeElement.#EDGE_HEIGHT_LINES;

    positionGroup.setAttribute("transform", `translate(0 ${rootBox.height.toString()})`);

    rootSVG.setAttribute("stroke", "black");
    rootSVG.setAttribute("stroke-width", "0.25");

    const subtrees =
      Array.from(
        this.querySelectorAll(":scope > ast-node") as NodeListOf<ASTNodeElement>,
        subtree => {
          const outerGroup = positionGroup.appendChild(createElementSVG("g"));
          outerGroup.appendChild(subtree.render());
          return outerGroup;
        });

    const maxSubtreeHeight =
      subtrees.length == 0 ?
        0 :
        Math.max(... subtrees.map(subtree => subtree.getBBox().height));

    frame.setAttribute("height", (1.1 * (rootBox.height + height + maxSubtreeHeight)).toString());

    let width = 0;
    for (const subtree of subtrees) {
      subtree.setAttribute("transform", `translate(${width.toString()} ${height.toString()})`);
      width += ASTTreeElement.#BRANCH_MARGIN_PIXELS + subtree.getBBox().width;
    }

    width = ASTTreeElement.#BRANCH_MARGIN_PIXELS + Math.max(width, rootBox.width);

    const origin = {
      x: (width - ASTTreeElement.#BRANCH_MARGIN_PIXELS) / 2,
      y: rootBox.height
    };

    frame.setAttribute("width", width.toString());

    const rootX =
      subtrees.length > 0 ?
        origin.x - (rootBox.width / 2) :
        ASTTreeElement.#BRANCH_MARGIN_PIXELS / 2;

    rootSVG.setAttribute("x", rootX.toString());

    let subtreeX = 0;
    for (const subtree of subtrees) {
      const subtreeWidth = subtree.getBBox().width;
      subtreeX += (ASTTreeElement.#BRANCH_MARGIN_PIXELS + subtreeWidth) / 2;
      const line = frame.appendChild(createElementSVG("line"));
      line.setAttribute("x1", origin.x.toString());
      line.setAttribute("y1", origin.y.toString());
      line.setAttribute("x2", subtreeX.toString());
      line.setAttribute("y2", (height + rootBox.height).toString());
      line.style.stroke = "black";
      subtreeX += (ASTTreeElement.#BRANCH_MARGIN_PIXELS + subtreeWidth) / 2;
    }

    return frame;
  }

  connectedCallback() {
    // stupid hack
    window.setTimeout(() => this.render(), 0);
  }
}

export class ASTNodeElement extends ASTTreeElement {
  constructor () { super(); }
  override connectedCallback() { }
}

customElements.define("ast-tree", ASTTreeElement);
customElements.define("ast-node", ASTNodeElement);