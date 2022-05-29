export type AST =
  PlusNode | MinusNode | TimesNode | ExponentNode |
  NegateNode |
  NumLeaf | NameLeaf;

export type PlusNode = {
  readonly tag: "plus";
  readonly leftSubtree: AST;
  readonly rightSubtree: AST;
};

export type MinusNode = {
  readonly tag: "minus";
  readonly leftSubtree: AST;
  readonly rightSubtree: AST;
};

export type TimesNode = {
  readonly tag: "times";
  readonly leftSubtree: AST;
  readonly rightSubtree: AST;
};

export type ExponentNode = {
  readonly tag: "exponent";
  readonly leftSubtree: AST;
  readonly rightSubtree: AST;
};

export type NegateNode = {
  readonly tag: "negate";
  readonly subtree: AST;
};

export type NumLeaf = {
  readonly tag: "num";
  readonly value: number;
};

export type NameLeaf = {
  readonly tag: "name";
  readonly name: string;
};


export type Scope = Map<string, number>;
export type Binding = [string, number];

export class ScopeError extends Error { }

export function lookup(name: string, scope: Scope): number {
  const value = scope.get(name);
  if (value == null)
    throw new ScopeError("name is not in scope: " + name);
  return value;
}