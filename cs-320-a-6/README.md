# CS 320, Spring 2022

## Assignment 6

This assignment is designed to review some of the concepts of *procedural programming* and *object-oriented programming*.

Our toy language has grown again: it now has *function definitions* and *function calls*. You won't be working on that part of the code, but we will review it a bit in lecture.

### Getting help

If you have any questions about the assignment outside of lecture, **please make sure to ask both Katie (the instructor) and Katherine (the TA)** in order to get the fastest response, and so that we can divide the workload effectively. You can find our contact information in the sylalbus.

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier for us to help you!

### Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-320-assignment-6/-/archive/main/cs-320-assignment-6-main.zip>.

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

A couple features have been removed from our toy language, again to avoid giving away the answers to previous exercises:

- The "less than" comparison operator (`<`) has been removed.
- The `switch`/`case` statement form has been removed.

The language is also now *procedural*, so **every program must have a `main` function**.

For example:

```
void main() {
  print f(5);
}

num f(num x) {
  return x + f(x - 1);
}
```

The order of functions is not important: any function can call any other function in the program.

### The code

Most of the codebase has been reorganized to an object-oriented structure, which we'll discuss a bit in lecture.

You'll notice that the folder structure is a little different than before: object-oriented code tends to be organized around nouns like "expression" and "statement" rather than verbs like "execute" and "typecheck". The `Expression` folder now contains all the code for typechecking and executing expressions, for example.

The `SyntaxAnalysis` folder hasn't changed, because (as you might have noticed) writing lexing code with regexes and parsing code with CFGs is kind of its own paradigm, separate from procedural or object-oriented code. The standard algorithms that we have for parsing are fundamentally imperative, and a CFG would usually be considered a declarative specification language.

To get started on the assignment, open `src/Scope.ts` and start reading through the comments. This is the only file you'll be working in for this assignment, but you're strongly encouraged to read through the rest of the codebase, in order to understand the context of the code you're working on.

### Grading

The first exercise is worth five points, and the second exercise is worth fifteen points (five for each method). You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
