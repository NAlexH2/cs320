# CS 320, Spring 2022

## Assignment 2

In this assignment, we'll introduce another tiny language, similar to the Boolean logic language from assignment 1. This time, our language supports a couple arithmetic features: addition, negation, and floating-point numbers. (No subtraction or multiplication, just to keep things simple for now.)

We're also introducing support for a very simple kind of *variables* in our language, where the value of each variable is set before the program's execution begins. We'll cover more interesting kinds of variables later in the course, but we have to build up to them.

The goal of this assignment is to get you some more exercise with manipulating abstract syntax trees (ASTs), and to introduce the concepts of *scope* and *binding*, which will be fundamental throughout the course.

### Getting help

If you have any questions about the assignment outside of lecture, **please make sure to ask both Katie (the instructor) and Katherine (the TA)** in order to get the fastest response, and so that we can divide the workload effectively. You can find our contact information in the sylalbus.

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier for us to help you!

### Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-320-assignment-2/-/archive/main/cs-320-assignment-2-main.zip>.

If you're using macOS or a GUI file manager on Linux, make sure to turn on the "show hidden files" setting in your file manager when you extract the zip archive. There should be a folder called ".vscode" in the archive, which will be invisible in your file manager by default because its name begins with a dot.

In VSCode, open the "File" menu and click "Open Folder..." if that option is there; otherwise click "Open". Either way, you should open the ***folder*** that you just extracted: the folder that contains `README.md`, `package.json`, etc. This is important: ***open the folder itself***, not any file ***in*** the folder. This is how VSCode knows where to find the project settings.

Alternatively, if you're working in a command line, navigate to this same folder in your terminal.

### Installing the dependencies, building, running, testing, submitting

This project is set up the same way as assignment 1, and all of the assignments in this course will have this same project structure.

Remember to run the `npm i` command once in the project folder before starting your work. This needs to be done once for each assignment.

Building, running, testing, and debugging the code works the same way as in assignment 1. Make sure to review the assignment 1 README if you need to.

Each assignment in this course will have you reading through comments in the `src/Main.ts` file. **After reading the rest of this README**, open that file to start the assignment.

The `src/Library.ts` file from assignment 1 has become the `src/Library` folder, but it still serves the same purpose. You're not expected to read or understand this code, and you shouldn't modify it, but you're welcome to ask about it if you're curious!

When you're finished with your code, submit it to the assignment 2 dropbox on Canvas with the same submission instructions as in assignment 1. The soft deadline for this assignment is listed on its Canvas dropbox page.

### Code requirements

The general code requirements that you're expected to follow are also the same as in assignment 1. Make sure to review the assignment 1 README if you need to!

### Input on the page

This time, there are three kinds of data that we have interactive inputs for:

- *Names*, which can include any lowercase or uppercase letter but no punctuation or spaces, like `x`, `abc`, and `Name`.
- *Arithmetic expressions*, involving **addition, negation, parentheses, numbers, and names**, like `1`, `1.2 + 3.4`, and `-(1 + x) + --(-y + --z)`.
- *Scopes*, which are **comma-separated lists of variable definitions**, like `x = 1` and `a = 10, bc = 20, def = 30`. To input an empty scope, leave the input box empty.

Note that there is no way to input a negative number leaf in an arithmetic expression: for example, if you input `-1`, the AST you get will be a `"negate"` node containing a `"num"` node as its subtree, not a single `"num"` node with a negative `value` field.

You can assume this will always be true in the inputs to your functions: a `NumLeaf` in an `AST` will never have a negative `value` field. You do not have to check for this case and throw an error, you can just assume it won't happen.

### Grading

Exercises 1 and 2 are worth six points each, and exercise 3 is worth eight points. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.