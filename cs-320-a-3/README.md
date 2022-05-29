# CS 320, Spring 2022

## Assignment 3

In this assignment, we'll focus in on the *syntax analysis* phase of our interpreter. We're going to be working on the same language of arithmetic from assignment 2 and extending it with a couple additional features.

This assignment is going to be a little different from most of the other assignments in this course: this is the **only** assignment where you're going to be working directly with *regular expressions* (regexes) and *context-free grammars* (CFGs). Both of these are quite deep concepts that you can explore in more theoretical depth in a "theory of computation" course like CS 311.

The goal of this assignment is for you to gain some **practical** experience specifying *tokenizing rules* and *parsing rules*. In the field of PL, these are our primary use cases for regexes and CFGs.

This assignment will depend heavily on the week 4 lecture material, so don't worry if it seems confusing at first! If we end up moving through the material in lecture more slowly than I originally planned, I'll push back the due date of this assignment to make sure you have enough time to work on it after watching the relevant lectures.

This is arguably the most practical assignment in this course from the perspective of "real-world" software development. Parsers are ubiquitous: every application that can read files in some particular file format must include some code for *parsing* that file format. In PL we focus on parsing *text* files, but *binary* files can also be parsed by the same methods: think filetypes like `.png`, `.zip`, and `.mp3`.

### Getting help

If you have any questions about the assignment outside of lecture, **please make sure to ask both Katie (the instructor) and Katherine (the TA)** in order to get the fastest response, and so that we can divide the workload effectively. You can find our contact information in the sylalbus.

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier for us to help you!

### Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-320-assignment-3/-/archive/main/cs-320-assignment-3-main.zip>.

If you're using macOS or a GUI file manager on Linux, make sure to turn on the "show hidden files" setting in your file manager when you extract the zip archive. There should be a folder called ".vscode" in the archive, which will be invisible in your file manager by default because its name begins with a dot.

In VSCode, open the "File" menu and click "Open Folder..." if that option is there; otherwise click "Open". Either way, you should open the ***folder*** that you just extracted: the folder that contains `README.md`, `package.json`, etc. This is important: ***open the folder itself***, not any file ***in*** the folder. This is how VSCode knows where to find the project settings.

Alternatively, if you're working in a command line, navigate to this same folder in your terminal.

### Installing the dependencies, building, running, testing, submitting

This project is set up the same way as assignment 1, and all of the assignments in this course will have this same project structure.

Remember to run the `npm i` command once in the project folder before starting your work. This needs to be done once for each assignment.

Building, running, testing, and debugging the code works the same way as in assignment 1. Make sure to review the assignment 1 README if you need to.

Each assignment in this course will have you reading through comments in the `src/Main.ts` file. **After reading the rest of this README**, open that file to start the assignment.

The `src/Library.ts` file from assignment 1 has become the `src/Library` folder, but it still serves the same purpose. You're not expected to read or understand this code, and you shouldn't modify it, but you're welcome to ask about it if you're curious!

When you're finished with your code, submit it to the assignment 3 dropbox on Canvas with the same submission instructions as in assignment 1. The soft deadline for this assignment is listed on its Canvas dropbox page.

### Code requirements

The general code requirements that you're expected to follow are also the same as in assignment 1. Make sure to review the assignment 1 README if you need to!

### Input on the page

This time, there are two kinds of data that we have interactive inputs for:

- *Arithmetic expressions*, involving **addition, subtraction, multiplication, exponentiation, negation, parentheses, numbers, and names**, like `1`, `1.2 * 3.4`, and `-(-1 - x) ^ --(y + z)`.
- *Scopes*, which are **comma-separated lists of variable definitions**, like `x = 1` and `a = 10, bc = 20, def = 30`. To input an empty scope, leave the input box empty.

Be careful with large expressions: if your grammar is ambiguous, then the "parse" function will return and print **all** possible ASTs for your input, which may be an enormous number of ASTs. If your grammar is unambiguous, though, the parser should run very quickly even over very large inputs.

Note that **subtraction, multiplication, and exponentiation** are new since assignment 2! We could simulate subtraction in assignment 2 by combining addition with negation, but now we have an actual subtraction operator. Exponentiation will not work until you complete exercise 4, and multiplication will be ambiguous until you complete exercise 3.

Note also that the parsing of negated numbers has changed slightly! In assignment 2, the expression `-1` produced a `NegateNode` with a positive `NumLeaf` containing `1` as its subtree; in assignment 3, `-1` produces a single `NumLeaf` containing `-1`. This is the result of a change in the parsing code.

This change only applies to negated *numbers*, not other negated *expressions*. This means that expressions like `-x` and `-(1 + 2)` still work the same way as in assignment 2. The expression `--1` will produce a single `NegateNode` with a `NumLeaf` containing `-1` as its subtree, `---1` will produce a `NegateNode` with the `--1` tree as its subtree, and etc.

### Grading

Each exercise is worth five points. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
