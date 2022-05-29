# CS 320, Spring 2022

## Assignment 5

This assignment is designed to build directly on assignment 4, along with the material in lecture 8 about *typechecking*.

In this assignment, we'll add a *typechecker* to our toy language, and reorganize a bit more of our existing code using TypeScript's own type system. There is also a new user input feature, which helps make typechecking a little more interesting.

THe overall goal of this assignment is to see in practice how typechecking has a similar structure as execution, but also differs in cricital ways. This is meant to help clarify your understanding of how real-world typecheckers work, because in a statically-typed language, it's important to be able to work with your typechecker instead of against it.

Most of the code in this assignment is the same as in assignment 4, so the documentation will only call out the parts that have changed in interesting ways. Make sure to review the assignment 4 documentation if you need a reminder of how that code works.

### Getting help

If you have any questions about the assignment outside of lecture, **please make sure to ask both Katie (the instructor) and Katherine (the TA)** in order to get the fastest response, and so that we can divide the workload effectively. You can find our contact information in the sylalbus.

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier for us to help you!

### Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-320-assignment-5/-/archive/main/cs-320-assignment-5-main.zip>.

If you're using macOS or a GUI file manager on Linux, make sure to turn on the "show hidden files" setting in your file manager when you extract the zip archive. There should be a folder called ".vscode" in the archive, which will be invisible in your file manager by default because its name begins with a dot.

In VSCode, open the "File" menu and click "Open Folder..." if that option is there; otherwise click "Open". Either way, you should open the **folder** that you just extracted: the folder that contains `README.md`, `package.json`, etc. This is important: **open the folder itself**, not any file **in** the folder. This is how VSCode knows where to find the project settings.

Alternatively, if you're working in a command line, navigate to this same folder in your terminal.

### Installing the dependencies, building, running, testing, submitting

This project is set up the same way as assignment 1, and all of the assignments in this course will have this same project structure.

Remember to run the `npm i` command once in the project folder before starting your work. This needs to be done once for each assignment.

Building, running, testing, and debugging the code works the same way as in assignment 1. Make sure to review the assignment 1 README if you need to.

Each assignment in this course will have you reading through comments in the `src/Main.ts` file. **After reading the rest of this README**, open that file to start the assignment.

The `src/Library.ts` file from assignment 1 has become the `src/Library` folder, but it still serves the same purpose. You're not expected to read or understand this code, and you shouldn't modify it, but you're welcome to ask about it if you're curious!

When you're finished with your code, submit it to the assignment 4 dropbox on Canvas with the same submission instructions as in assignment 1. The soft deadline for this assignment is listed on its Canvas dropbox page.

### Code requirements

The general code requirements that you're expected to follow are also the same as in assignment 1. Make sure to review the assignment 1 README if you need to!

### The language

Our toy language is almost the same as in assignment 4, but with a couple additions and removals.

First, the three "unimplemented" parts of the assignment 4 language are **not part of the assignment 5 language**:

- conditional expressions: `e1 ? e2 : e3`
- assertion statements: `assert e`
- for statements: `for (x = e1; e2; s1) s2`

(This is just to avoid giving away the assignment 4 answers.)

Two of our operators have also **changed meaning** slightly:

- Both the `&&` and `||` operators work on numbers as well as booleans now. Their meaning for booleans is the same as before, but for numbers they are *bitwise* operators: for example, `20 && 25 == 16` because `20` is `10100` in binary, `25` is `11001`, and `16` is `10000`.

The typechecker is not aware of the changed meanings of `&&` and `||` yet: that will be your job. The execution code is already implemented for the new behavior.

Our language is also now *statically-typed*, with the same two types as before ("num" and "bool") but now with a static typechecker to predict type errors related to these two types. In the syntax descriptions below, the symbol `t` stands for either type.

Our *variable declarations* are written the same as before, for example `declare x = 1`. Variable types are *inferred* from the given expression, which must be present: `declare x` is (still) not valid by itself. A variable's type may not change after its declaration.

Finally, there are three **new features**:

- input expressions: `input<t>`
- while statements: `while (e) s`
- switch statements: `switch (e) { v1: s1 ... vn: sn }` (where `v` is any *value*)

Each of these features is already implemented in the *syntax analysis* and *execution* code. Input expressions and while statements are also already implemented in the *static analysis* code, but you will be implementing the static analysis code for switch statements.

An *input expression* is written either `input<num>` or `input<bool>`, and at runtime it asks the user to input an expression of the appropriate type. If the user enters invalid input, it asks again until they enter valid input. In typechecking, `input<t>` has type `t`, because we assume that the user will eventually input a valid value of the correct type and we won't stop asking until they do.

Note that an *input expression* is an *expression*, which means we can write code like `input<num> + input<num>` or `if (input<bool>) print 1;`. In general, an input expression can be used anywhere any other expression can be used. It does not have precedence or associativity, since it has no subexpressions.

A *while statement* works at runtime the way you would most likely expect: in each loop iteration, it checks if `e` evaluates to `true` and executes `s` if it does. In typechecking, `e` is required to be a `bool`.

A *switch statement* works **roughly** the way you would expect, but a little differently than in some common languages (including TypeScript). There is no *fall-through* and no `break` statement: each `case` is independent, and the order of the `case`s does not affect the behavior of the `switch` statement.

Each `case` must contain exactly one statement in its body, so if you want multiple statements in one `case`, you have to use a block statement. For example:

```
switch (input<num>) {
  case 1: print 1;
  case 2: {
    print 3;
    print 4;
  }
}
```

A `switch` statement may have an optional `default` clause, which executes if the *scrutinee* (the expression in parentheses after the `switch` keyword) does not match any of the `case` values. The `default` clause **must come last** in a `switch`. For example:

```
switch (input<num>) {
  case 1: print 1;
  case 2: {
    print 3;
    print 4;
  }
  default: print 5;
}
```

If there is no `default` clause and the scrutinee does not match any of the `case` values, the `switch` statement does nothing. (No error is thrown.)

It is valid for a `switch` statement to have zero `case`s and no `default` clause, which does nothing except evaluate the scrutinee. This means that at runtime, `switch (input<num>) { }` will ask for an input number and then do nothing with it.

Each `case` in a `switch` statement has its own *scope*, so variables declared in one `case` are not visible in any other `case` or outside the `switch`, and multiple `case`s in the same `switch` may declare the same variable name. For example, this code is well-typed (although pointless):

```
switch (input<bool>) {
  case true: declare x = 1;
  case false: declare x = true;
}
```

In typechecking, each `case` of a `switch` statement must have the same type as the scrutinee. This is because in our language, a `bool` is never equal to a `num`, so it would always be a mistake to use a `bool` case with a `num` scrutinee or vice versa. For example, this code has a type error in the second `case`:

```
switch (input<bool>) {
  case true: print 1;
  case 1: print 2;
}
```

### The code

The interpreter structure is the same as in assignment 4, but with a new `StaticAnalysis` module and folder.

**Before** reading through the new code, read the documentation in `src/AST/Type.ts` to understand how we're representing the types of our toy language. Next, read through `src/AST/Expression.ts` and `src/AST/Statement.ts` to see a couple updates in our AST representations.

Read through the code in the `src/Execution` folder to note what's new and what's changed since assignment 4. This code is not commented, but it follows the same basic patterns that are documented in the assignment 4 code. Pay special attention to the execution code for the `<`/`&&`/`||` operators and for `switch` statements, since you'll be working on the typechecking code for these.

The code in `src/StaticAnalysis/Scope.ts` is **almost** the same as the code in `src/Execution/Scope.ts`, but notice that this `Scope` type is mapping names to *types* instead of *values*. This is the `Scope` type we use in all of the `StaticAnalysis` code, since we can't know the *values* of the variables in scope without actually executing the program.

Take note of the `assertType` function in `src/StaticAnalysis/TypeAssertions`: this is how our typechecker indicates *static type errors*.

The fundamental purpose of our typechecker is to predict the possibility of a `DynamicTypeError` in the execution code. If the typechecker detects this possibility, it throws a `StaticTypeError` to let us know. Our typechecker is *sound* if it throws a `StaticTypeError` for any code that **might** have a `DynamicTypeError`, and is *complete* if it never throws a `StaticTypeError` for any code that **can't** have a `DynamicTypeError`.

When you're ready, open `src/Main.ts` to start the exercises.

### Grading

The first exercise is worth three points, the second exercise is worth five, and the third exercise is worth twelve. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
