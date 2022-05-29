import { Value } from "./Expression";
import { Func } from "./Function";
import { dynamicAssertSameType, SourceType } from "./Type";


export class DispatchError extends Error { }

export interface FuncScope {
  dispatch(name: string): Func;
  functionsInScope(): Func[];
}

export class MapFuncScope implements FuncScope {
  private readonly functions: ReadonlyMap<string, Func>;

  constructor(functions: ReadonlyMap<string, Func>) {
    this.functions = functions;
  }

  dispatch(name: string): Func {
    const func = this.functions.get(name);
    if (func == null)
      throw new DispatchError("function is not defined: " + name);
    return func;
  }

  functionsInScope(): Func[] {
    return Array.from(this.functions.values());
  }
}


export class ScopeError extends Error { }

export interface VarScope<Entry> {
  lookup(name: string): Entry;
  declare(name: string, entry: Entry): void;
  update(name: string, entry: Entry): void;
  executeInNestedScope(action: () => void): void;
}

export type VarTypeScope = VarScope<SourceType>;
export type VarValueScope = VarScope<Value>;


export class MapVarScope<Entry> implements VarScope<Entry> {
  private readonly variables: Map<string, Entry> = new Map();
  private readonly nestedScopes: Set<string>[] = [new Set()];

  // ********************
  // * EXERCISE 1 START *
  // ********************

  // In assignment 6, a lot of the Statement code followed a repetitive pattern:

  //   varScope.pushNestedScope();
  //   ... // do some work in the nested scope
  //   varScope.popNestedScope();

  // Remember that the purpose of this pattern is to make sure variables go
  // **out** of scope at the end of a statement: like most languages, our toy
  // language is designed to reject code like the example below.

  //   {
  //      if (input<bool>) {
  //        declare x = 1;
  //      }
  //      print x;
  //   }

  // This is a pattern with some potential for human error: in the logic of our
  // program, every call to pushNestedScope must eventually be followed by a
  // corresponding call to popNestedScope, but nothing in our code is
  // guaranteeing that we get that right.

  // Note that the VarScope interface in this assignment no longer exposes the
  // pushNestedScope and popNestedScope functions. Instead, it exposes the
  // executeInNestedScope function, which covers both pushing and popping
  // scopes.

  // Read through some of the updated Statement code to see how this function is
  // called; in general, the pattern looks like this:

  //   executeInNestedScope(() => {
  //     ... // do some work in the nested scope
  //   })

  // This is using TypeScript's "arrow function" syntax to pass an *anonymous*
  // function as the argument to executeInNestedScope.

  // Implement executeInNestedScope so that it implements this pattern:

  //   1. Push a nested scope.
  //   2. Execute the action that was passed as an argument.
  //   3. Pop the nested scope.

  // This will be very simple code in the end! If you're not sure how to
  // implement step 2, be sure to review the lecture material on first-class
  // functions.

  executeInNestedScope(action: () => void): void {
    this.pushNestedScope()
    action()
    this.popNestedScope()
  }

  // ******************
  // * EXERCISE 1 END *
  // ******************

  pushNestedScope(): void {
    this.nestedScopes.unshift(new Set());
  }

  popNestedScope(): void {
    for (const nameGoingOutOfScope of this.nestedScopes[0])
      this.variables.delete(nameGoingOutOfScope);
    this.nestedScopes.shift();
  }

  lookup(name: string): Entry {
    const entry = this.variables.get(name);
    if (entry == null)
      throw new ScopeError("name is not in scope: " + name);
    return entry;
  }

  declare(name: string, entry: Entry): void {
    if (this.variables.has(name))
      throw new ScopeError("declaring duplicate variable name: " + name);
    this.variables.set(name, entry);
    this.nestedScopes[0].add(name);
  }

  update(name: string, entry: Entry): void {
    if (!this.variables.has(name))
      throw new ScopeError("updating undeclared variable name: " + name);
    this.variables.set(name, entry);
  }
}