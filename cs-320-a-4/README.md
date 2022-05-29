# CS 320, Spring 2022

## Assignment 4

Now that we've covered the process of *syntax analysis*, it's time to build our toy language into more of a "programming language". To be specific, our language will become an *imperative* language.

In this assignment, we'll expand our language to include multiple *types* of data, and we'll add several different *statement* forms. We'll still be using the same code patterns from previous assignments, but at a somewhat larger scale and with more details to consider.

In order to support our growing language, we will see some ways of new structuring our existing TypeScript code patterns to reduce code duplication a little. This will involve a discussion of a couple new features of TypeScript's *type system*, foreshadowing our discussion of *static analysis* in the next assignment. Later in this course, we will also explore how *object-oriented programming* and *functional programming* can each offer potentially better ways to organize our code.

The overall goal of this assignment is to explore the structure of a slightly more realistic programming language than before, and specifically to explore the topic of *scope* and *control flow* in some depth.

Pay close attention to the similarities and differences between our toy language and various "real-world" programming languages: these exercises have you implementing some interpreter execution code, but the real goal is to clarify and deepen your understanding of how imperative features work in any programming language. One of the best things about an interpreter is that if you know how to read the interpreter code, then the code itself **explains** how the language works.

Since you'll be typing whole programs into the text boxes on the assignment page now, I recommend that you **save your code in an external editor** while you're testing your work on the assignment page. Refreshing your browser may sometimes delete the code that you've typed into the page. If you get sick of copying the code into your browser each time, try writing an automated test!

### Getting help

If you have any questions about the assignment outside of lecture, **please make sure to ask both Katie (the instructor) and Katherine (the TA)** in order to get the fastest response, and so that we can divide the workload effectively. You can find our contact information in the sylalbus.

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier for us to help you!

### Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-320-assignment-4/-/archive/main/cs-320-assignment-4-main.zip>.

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

Our toy language has grown, so it deserves a new introduction from the ground up.

#### Variables

The rules for variable names are the same as before: one uppercase or lowercase letter, followed by any combination of letters, digits, and underscores. Most of the presented examples will use single-letter variable names for convenience, but variable names can be **any length**.

#### Values

Our language now supports two *types* of data *values*: floating-point numbers and booleans.

Floating-point numbers are written like in previous assignments (the way you would most likely expect). Keep in mind that floating-point numbers produce weird results in TypeScript sometimes: for example, `1 / 0` will evaluate to `Infinity`, which is the expected result. There will also be rounding errors with some fractional numbers, and overflow/underflow behavior.

Boolean values are written `true` and `false`, **always lowercase**. These are not valid variable names in the language.

#### Expressions

Just like before, our language has *expressions*. Remember: an *expression* is a piece of code that produces a *value* when we interpret it.

Below is a list of **all of** the types of expressions we have now - if you don't see something on this list, it's not supported. The list is in order of **lowest** to **highest** precedence: the first entry in the list comes last in the order of operations. In each entry, the `e` names represent **any *expression***, not just any *variable* or *value*.

- conditional: `e1 ? e2 : e3` (unimplemented)
- logical OR: `e1 || e2`
- logical AND: `e1 && e2`
- equality comparison: `e1 == e2`
- less-than comparison: `e1 < e2`
- addition: `e1 + e2`, subtraction: `e1 - e2`
- multiplication: `e1 * e2`, division: `e1 / e2`
- exponentiation: `e1 ^ e2`
- negation: `- e1`
- logical NOT: `! e1`

The entry marked "(unimplemented)" will not work completely until you finish the corresponding exercise.

All of the infix operators are *right-associative*, except for exponentiation, which is *left-associative*. This is **different** than in assignment 3, and different from many common languages. (I'm trying not to completely give away the assignment 3 answers.)

All of these operators should be familiar to you, except for possibly the *conditional operator*, also sometimes know as "the ternary operator".

(If you're familiar with Python, `e1 ? e2 : e3` is written `e2 if e1 else e3` in Python. Note the difference in the operand order!)

The *conditional operator* expects its first operand to evaluate to a boolean value, and uses it to choose **one** of the other operands to evaluate. The second operand is the "true" case and the third operand is the "false" case. For example, `1 + 1 == 2 ? 10 : 20` evaluates to `10`, and `1 + 1 == 3 ? 10 : 20` evaluates to `20`.

#### Statements

Our language has several new features that take the form of *statements*. A *statement* is a piece of code that executes to produce some *side effect*: it **does not have a *value***, but instead produces some other kind of observable change in the state of the program.

Below is a list of **all of** the types of statements we have now - if you don't see something on this list, it's not supported. In each entry , the `x` names represent *variable names*, the `e` names represent any *expression*, and the `s` names represent any *statement*.

- variable declaration: `declare x = e;`
- variable update: `x = e;`
- print: `print e;`
- assert: `assert e;` (unimplemented)
- block: `{ s1; s2; ... }` (may have any number of substatements, including zero)
- if: `if (e) s1`, `if (e) s1 else s2`
- for: `for (x = e1; e2; s1) s2` (unimplemented)

The entries marked "(unimplemented)" will not work completely until you finish the corresponding exercises.

Keep in mind that the input ont he assignment webpage expects a **single** statement, so if you want to run more than one statement, you have to wrap them all in a *block* statement. For example, `let x = 1; print x;` is an invalid input, but `{ let x = 1; print x; }` works.

Whitespace is still completely ignored in the lexer, so you can use tabs and newlines to format your code in a standard way.

Some of these statements may **behave slightly differently than you might expect**. Try out sample programs in the interpreter on the assignment webpage to get a feel for how they work. Here we'll cover the main points that might be non-obvious.

Variables must be *declared* before they may be *used* or *updated*. It is a *runtime scope error* to attempt to use or update a variable that has not been declared, or to declare a variable that has already been declared. For example, `{ let x = 1; print y; }`, `{ let x = 1; y = 2 }`, and `{ let x = 1; let x = 2 }` will all produce runtime errors (if `y` is not defined in an outer block).

An *assertion* evaluates its *condition* expression, which is expected to produce a boolean *value*, and throws a runtime error if the value is false or does nothing if the value is true. If the value is not a boolean, a *runtime type error* is thrown.

A *block statement* executes each of its substatements in order. When the block statement ends, **variables that were declared in the block *go out of scope***. For example, `{ let x = 1; print x; }` is valid, but `{ { let x = 1; print x; }; print x; }` will print `1` once and then throw a runtime scope error on the second `print` statement.

An *if statement* has a condition *expression*, which is expected to produce a boolean value, and a *true branch* and an optional *false branch*, which are both *statements*. The value of the condition expression is used to choose which branch to execute; if the value is `false` and there is no false branch, the if statement does nothing. If the value is not a boolean, a runtime type error is thrown.

A *for statement* always *declares* a *loop variable*. The first expression provides the *initial value* of the loop variable, which is set once at the start of the loop; the second expression is the *termination condition*, which is checked once at the start of each loop iteration; the first statement is the *update action*, which executes once at the end of each loop iteration; and the second statement is the *body*, which executes once at the start of each loop iteration if the termination condition evaluates to true.

In a for statement, the loop variable is in scope for the entire loop and goes out of scope when the loop ends. For example, note that `for (x = 1; x < 10; x = x + 1) print x;` is valid, but `{ let x = 0; for (x = 1; x < 10; x = x + 1) print x; }` will throw a runtime scope error.

Any variables declared within a for loop *body* go out of scope at the end of **each iteration** of the loop, so that they can be declared again in the next iteration. For example, note that `for (x = 1; x < 10; x = x + 1) { let y = x; print y; }` is valid instead of throwing a runtime scope error on the second iteration, and `{ for (x = 1; x < 10; x = x + 1) print x; print x; }` is invalid (the second `print` is outside the loop body).

### The code

Our interpreter code has a bit more high-level organization now, so it requires a bit of a guided tour.

First, open the `src/AST.ts` file, which documents the organization of the AST modules. Read through the comments in each individual AST module to understand how our AST structure has grown.

Most of the code in the `src/SyntaxAnalysis` folder should look familiar to you from assignment 3. You're not going to edit any syntax analysis code for this assignment, but you're encouraged to read through it to see how our new syntactic forms are parsed.

The src/Execution folder is where we're focusing most of our attention this time. Open the `src/Execution.ts` file, which documents the organization of the execution phase modules. Read through the comments in each individual execution phase module to understand how our execution code has grown to support our new expressions and statements.

**After reading through the documentation**, open `src/Main.ts` to start the exercises.

### Grading

The first exercise is worth three points, the second exercise is worth seven, and the third exercise is worth ten. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
