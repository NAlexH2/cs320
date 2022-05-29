// This module defines the types that are used for tracking the scopes in our
// interpreter. Each type of scope is defined as an interface with multiple
// different implementation types.

// This illustrates one of the strengths of object-oriented programming: if our
// code is designed according to object-oriented principles, we can configure
// the behavior of each piece of code just by changing which constructor we use
// to create an object.

// In this codebase, our scope types are designed as interfaces, and most of the
// code in the codebase only depends on these interfaces. This means we can
// change the behavior of scopes in our toy language just by changing which
// constructors we call to create scope objects, in the few instances where they
// are created.

// In Factories.ts, there are two functions for creating an empty scope, one for
// each of the two types of scopes we need. In all of the rest of the codebase,
// whenever any code needs to create a new scope, it calls one of the two
// functions from Factories.ts.

// This is a minimal example of the "factory pattern" in object-oriented
// programming, which is often used especially to improve the testability of an
// object-oriented codebase. In test code, we can easily swap out a different
// implementation of a scope object that allows for easier observation of
// testable properties.

import { Value } from "./Expression";
import { Func } from "./Function";
import { SourceType, staticAssertType } from "./Type";


// Our language has functions and function calls now, so we need a way to access
// a function's definition by name during typechecking and runtime. The
// FuncScope type maps function names to function definitions.

// Programs can't create new functions at runtime, so the FuncScope interface
// doesn't provide a way to modify the set of function definitions that it
// contains.

// The FuncScope interface is used during both typechecking and runtime, since
// in both cases our interpreter needs a way to map function names to their
// definitions. In a compiler, we would need it during typechecking and code
// generation, but it wouldn't need to exist when the compiled program is run.

export class DispatchError extends Error { }

export interface FuncScope {
  // Look up a function's definition by name, or throw a DispatchError if the
  // function isn't defined.
  dispatch(name: string): Func;

  // Get an array of all functions that are currently in scope.
  functionsInScope(): Func[];
}


// Our VarScope type has the same capabilities as our Scope types in previous
// assignments, but with a somewhat cleaned-up interface to make the rest of the
// codebase a little nicer.

// Remember that our language has *nested scopes*, so that variables go out of
// scope at the end of a block or sub-statement:

// {
//   if (input<bool>)
//     declare x = 1;
//   print x;           <-- scope error!
// }

// Previously we achieved this through a manual pattern of saving the variables
// in scope before a sub-statement, and then removing each variable going out of
// scope at the end of the sub-statement.

// The VarScope interface provides the pushNestedScope/popNestedScope functions
// for this purpose, which are used throughout the codebase to "remember" when
// each variable should go out of scope.

// This is a form of *encapsulation*: the rest of the codebase doesn't have to
// care about the details of **how** nested scopes are managed, because it's
// taken care of internally in each VarScope implementation.

// We've also combined our old StaticScope and DynamicScope types into a single
// *generic* scope type: the name Entry here is a *generic type variable*, which
// stands for any arbitrary type and gets specialized at each use site of the
// VarScope type.

// In practice, the Entry type variable is SourceType during typechecking, and
// Value during execution. The VarTypeScope and VarValueScope synonyms define
// these specializations for convenience.

export class ScopeError extends Error { }

export interface VarScope<Entry> {
  // These three functions work just as in previous assignments.
  lookup(name: string): Entry;
  declare(name: string, entry: Entry): void;
  update(name: string, entry: Entry): void;

  // When popNestedScope is called, all variables that were declared since the
  // most recent pushNestedScope call are undeclared.
  pushNestedScope(): void;
  popNestedScope(): void;
}

export type VarTypeScope = VarScope<SourceType>;
export type VarValueScope = VarScope<Value>;


// The interfaces above just specify the names and types of each method that
// our scope types are required to provide: now we have to actually implement
// the behavior.

// The MapFuncScope type *implements* the FuncScope interface, so it's required
// to provide each method specified in the interface.
export class MapFuncScope implements FuncScope {
  // We store the mapping from names to functions in an *immutable* map, since
  // functions can't be modified after definition in our language.
  private readonly functions: ReadonlyMap<string, Func>;

  // In TypeScript a constructor is defined with the special "constructor"
  // keyword, unlike in most other OOP languages. When this constructor is
  // called, it's called by the name of the class, like in most other OOP
  // languages.
  constructor(functions: ReadonlyMap<string, Func>) {
    this.functions = functions;
  }

  // This should look familiar from previous Scope type implementations: to look
  // up a function by name, we look up the name in our map and throw an error if
  // it's not in the map.
  dispatch(name: string): Func {
    const func = this.functions.get(name);
    if (func == null)
      throw new DispatchError("function is not defined: " + name);
    return func;
  }

  // The Array.from function creates an array out of any "sequence".
  functionsInScope(): Func[] {
    return Array.from(this.functions.values());
  }
}


// ********************
// * EXERCISE 1 START *
// ********************

// Define a new subclass of MapFuncScope which logs a message to the browser
// developer console every time the "dispatch" method is called.

// Your class must be named DebugMapFuncScope in order for the tests to work.
// You also must use the "export" keyword to define it.

// Specifically, you should use the console.info function to log messages:
//   console.info("try this in your browser console to see how it works")

// Each time you call console.log, you must pass **only** the name of the
// function as the log message, like console.info(name).

// This should only take a little bit of code, but you'll have to think a bit
// about how TypeScript classes work.

// Here are some relevant bits:
//   - The "extends" keyword is used for subclasses. (Review week 8 lectures!)
//   - The "override" keyword is used before a method name when defining an
//     overridden method.
//   - The "super" keyword is used to access a superclass's method definition,
//     like "super.functionsInScope()".

export class DebugMapFuncScope extends MapFuncScope{

  private readonly functions2: ReadonlyMap<string, Func>;
  constructor(functions: ReadonlyMap<string, Func>) {
    super(functions)
    this.functions2 = functions
  }
  
  override dispatch(name: string): Func {
  const func = this.functions2.get(name);
  if (func == null)
    throw new DispatchError("function is not defined: " + name);
  else
    console.info(func.name)
    return func
  }

}

// ******************
// * EXERCISE 1 END *
// ******************


// The implementations of our VarScope interface have to be a little more
// complex, since variables can change and come into existence during
// typechecking and runtime.

// The MapVarScope type implements the VarScope interface in the same way as the
// Scope types of our previous assignments, but with some additional logic to
// keep track of nested scopes.
export class MapVarScope<Entry> implements VarScope<Entry> {
  // This Map contains **all** of the variables that are currently in scope,
  // including ones that might go out of scope later if we exit a nested scope.
  private readonly variables: Map<string, Entry> = new Map();

  // This array contains the sets of names that were defined in each nested
  // scope, at some particular point in time during typechecking or execution.
  private readonly nestedScopes: Set<string>[] = [new Set()];

  // For example, consider this nested block statement:
  // {
  //   declare x = 1;
  //   declare y = 2;
  //   { declare z = 3; }
  // }

  // When typechecking or executing the inner block, the nestedScopes value
  // looks like this:
  //   [Set("z"), Set("x", "y")]

  // Watch this process happen in the debugger to get a better idea of what's
  // being represented here!

  // The set at index 0 always contains the names in the "current" (innermost)
  // scope.

  // When the typechecking or execution code enters a nested scope, this
  // function gets called to "remember" which names are currently in scope.
  pushNestedScope(): void {
    // The unshift method "pushes" a new value onto the **front** of an array.
    this.nestedScopes.unshift(new Set());
  }

  // When the typechecking or execution code exits a nested scope, this function
  // gets called to "undeclare" the names that should no longer be in scope.
  popNestedScope(): void {
    for (const nameGoingOutOfScope of this.nestedScopes[0])
      this.variables.delete(nameGoingOutOfScope);
    this.nestedScopes.shift();
  }

  // The lookup/declare/update functions are defined just as before, except that
  // they're now methods on a Scope object instead of top-level functions.

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


// ********************
// * EXERCISE 2 START *
// ********************

// Like the inteprreters in our previous assignments, the behavior of nested
// scopes under the MapVarScope type forbids *shadowing*: a scope cannot declare
// a variable with the same name as a variable in its outer scope.

// For example, this nested block statement throws a scope error during
// typechecking (and at runtime if we ignore the type error):
//   {
//     declare x = 1;
//     { declare x = 2; }
//   }

// Many real-world languages allow this kind of code, and implement it by
// allocating a **new** variable named "x" within the inner block, which is
// deallocated when the inner block exits.

// But this code updating a variable in an outer block should be fine:
//   {
//     declare x = 1;
//     { x = 2; }
//   }

// This means that we can't create an entirely new scope from scratch for each
// nested block: the inner block needs access to the outer block's variables,
// but the inner block should also be able to declare its own new variables,
// whose names might conflict with variables in the outer block.

// One way to solve this problem is with a linked list of scopes, which is
// outlined in the ListVarScopeSpec type.

// We'll use this nested block statement as an example again:
// {
//   declare x = 1;
//   declare y = 2;
//   { declare z = 3; }
// }

export class ListVarScopeSpec<Entry> {
  // This Map contains the names in the **current** or **innermost** scope, at
  // some point in time during typechecking or runtime. When typechecking the
  // inner block in the example statement above, currentScope **only** contains
  // the entry for "z".
  protected currentScope: Map<string, Entry>;

  // This is a reference or "pointer" to the next outer scope, which is the next
  // node in a linked list of scopes. If outerScopes is null, the current scope
  // is not nested inside any other scopes. When typechecking the inner block in
  // the example statement above, outerScopes.currentScope contains the entries
  // for "x" and "y", and outerScopes.outerScopes is null.
  protected outerScopes: ListVarScopeSpec<Entry> | null;

  // Both of these arguments have default values, which means the constructor
  // can be called with zero arguments to create an empty scope.
  constructor(
    top: Map<string, Entry> = new Map(),
    rest: ListVarScopeSpec<Entry> | null = null
  ) {
    this.currentScope = top;
    this.outerScopes = rest;
  }
}


// Define a new subclass of ListVarScopeSpec which also implements VarScope.

// Here are the specifications of each method you need to implement:

//   lookup(name):
//     If name is in the current scope, return its entry (with the .get method);
//     if it's not in the current scope, try each outer scope in order. If it's
//     not defined in any scope, throw a ScopeError.

//   declare(name, entry):
//     If name is in the current scope, throw a ScopeError; if it's not in the
//     current scope, add it to the current scope (with .set) even if it's
//     already defined in an outer scope.

//   update(name, entry):
//     If name is in the current scope, update its entry (with .set); if it's
//     not in the current scope, try each outer scope in order. If it's not
//     defined in any scope, throw a ScopeError.


// Uncomment the code below to get started. You will not need to modify any of
// this provided code, but you'll need to add your own method implementations.

// 
export class ListVarScope<Entry> extends ListVarScopeSpec<Entry> implements VarScope<Entry>{
    protected override outerScopes: ListVarScope<Entry> | null;

    constructor(
      top: Map<string, Entry> = new Map(),
      rest: ListVarScope<Entry> | null = null
    ) {
      super(top, rest);
      this.currentScope = top;
      this.outerScopes = rest;
    }

    pushNestedScope(): void {
      this.outerScopes = new ListVarScope(this.currentScope, this.outerScopes);
      this.currentScope = new Map();
    }

    popNestedScope(): void {
      if (this.outerScopes == null)
        throw new Error("tried to pop from empty stack");
      this.currentScope = this.outerScopes.currentScope;
      this.outerScopes = this.outerScopes.outerScopes;
    }

    //   lookup(name):
    //     If name is in the current scope, return its entry (with the .get method);
    //     if it's not in the current scope, try each outer scope in order. If it's
    //     not defined in any scope, throw a ScopeError.
    lookup(name: string): Entry 
    {
        let nEntry = this.currentScope.get(name)
        if (nEntry == null || nEntry == undefined) 
        {
          let tempout = this.outerScopes
          while(nEntry == null && tempout != null) 
          {
            nEntry = tempout.currentScope.get(name)
            tempout = tempout.outerScopes
          }
        }

        if (nEntry == undefined || nEntry == null)
          throw new ScopeError("Variable not yet declared in this scope: " + name);
        return nEntry 
    }

    //   declare(name, entry):
    //     If name is in the current scope, throw a ScopeError; if it's not in the
    //     current scope, add it to the current scope (with .set) even if it's
    //     already defined in an outer scope.
    declare(name: string, entry: Entry): void {
      if (this.currentScope.has(name) == true)
        throw new ScopeError;
      
      this.currentScope.set(name, entry)
      
    }

    //   update(name, entry):
    //     If name is in the current scope, update its entry (with .set); if it's
    //     not in the current scope, try each outer scope in order. If it's not
    //     defined in any scope, throw a ScopeError.
    update(name: string, entry: Entry): void {
      if (this.currentScope == null) {
        throw new ScopeError
      }
        if (this.currentScope.get(name) == null) {
          this.popNestedScope()
          this.lookup(name)
        }
        
        this.currentScope.set(name, entry)

    }
}
