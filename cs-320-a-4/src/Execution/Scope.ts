// Our Scope type is the same as in assignments 2 and 3. The lookup function is
// the same as before as well, but is now joined by more utility functions that
// get used in the statement execution code.

// Come back to these definitions when you see these functions used, to review
// the precise meaning of each one. You should not have to interact with the
// Map type directly: these are all the Scope functions we need for now.

import { Value } from "../AST";

export type Scope = Map<string, Value>;
export type Binding = [string, Value];

export class ScopeError extends Error { }

// This returns a set containing every variable name with an entry in the given
// scope, representing the set of names that are currently *in scope*.
export function namesInScope(scope: Scope): Set<string> {
  return new Set(scope.keys());
}

export function lookup(name: string, scope: Scope): Value {
  const value = scope.get(name);
  if (value == null)
    throw new ScopeError("name is not in scope: " + name);
  return value;
}

export function declare(name: string, value: Value, scope: Scope): void {
  if (scope.has(name))
    throw new ScopeError("declaring duplicate variable name: " + name);
  scope.set(name, value);
}

export function update(name: string, value: Value, scope: Scope): void {
  if (!scope.has(name))
    throw new ScopeError("updating undeclared variable name: " + name);
  scope.set(name, value);
}

export function undeclare(name: string, scope: Scope): void {
  if (!scope.has(name))
    throw new ScopeError("deleting undeclared variable name: " + name);
  scope.delete(name);
}
