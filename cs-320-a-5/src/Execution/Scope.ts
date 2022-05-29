import { Value } from "../AST";

export type Scope = Map<string, Value>;
export type Binding = [string, Value];

export class ScopeError extends Error { }

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
