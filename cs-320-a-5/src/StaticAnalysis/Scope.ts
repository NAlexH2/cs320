import { SourceType } from "../AST";

export type Scope = Map<string, SourceType>;
export type Binding = [string, SourceType];

export class StaticScopeError extends Error { }

export function namesInScope(scope: Scope): Set<string> {
  return new Set(scope.keys());
}

export function lookup(name: string, scope: Scope): SourceType {
  const value = scope.get(name);
  if (value == null)
    throw new StaticScopeError("name is not in scope: " + name);
  return value;
}

export function declare(name: string, type: SourceType, scope: Scope): void {
  if (scope.has(name))
    throw new StaticScopeError("declaring duplicate variable name: " + name);
  scope.set(name, type);
}

export function undeclare(name: string, scope: Scope): void {
  if (!scope.has(name))
    throw new StaticScopeError("deleting undeclared variable name: " + name);
  scope.delete(name);
}
