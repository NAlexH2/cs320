# CS 320, Spring 2022

## Assignment 7

This assignment is designed to briefly review the concept of *first-class functions* from the paradigm of *functional programming*.

Our toy language is the same as it was in assignment 6. This time, we're going to focus on cleaning up the pattern of "pushing" and "popping" nested scopes, in order to rule out some possibility of programmer error.

This assignment is quite short, and should not take you as much time as any of the previous assignments. To be honest, I think both you and I deserve a break at this point in the quarter! There is a bit of work for you to do, but there are also a few "free points" built into the grading scheme of assignment.

If you were hoping for a more extensive functional programming assignment to work on, please remember that you can reach out for additional reading at any time! My original plan was to rewrite some parts of this codebase in a purely-functional style, but we really just don't have enough time in lecture to build up to purely-functional techniques on top of all the other material we have to cover. FP is one of my favorite parts of the field of CS, though, so I can certainly give you more to chew on if this leaves you feeling unsatisfied!

### Getting help

If you have any questions about the assignment outside of lecture, **please make sure to ask both Katie (the instructor) and Katherine (the TA)** in order to get the fastest response, and so that we can divide the workload effectively. You can find our contact information in the sylalbus.

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier for us to help you!

### Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-320-assignment-7/-/archive/main/cs-320-assignment-7-main.zip>.

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

### The code

The code is almost the same as in assignment 6, but with a change in the `VarScope` type. Open src/Scope.ts and scroll down to the `MapVarScope` class to get started.

### Grading

There is only one exercise, worth 20 points. Don't worry about partial credit - once you figure out the main idea, you'll have a fully correct answer in no time.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
