# CS 320, Spring 2022

## Assignment 1

Welcome to our first assignment! Our main goal in this assignment is just to warm up with TypeScript, but we'll get to see our first example of a tiny interpreter by the end of the assignment.

Please read this document as carefully as possible, and review it if you get lost. This is meant to be a guided exercise; you shouldn't have to spend a ton of time guessing.

### Prerequisite

Before you start this assignment, you'll need to follow the instructions in the [TypeScript intro project](https://gitlab.cecs.pdx.edu/cas28/typescript-intro) in order to set up your work environment.

### Getting help

If you have any questions about the assignment outside of lecture, **please make sure to ask both Katie (the instructor) and Katherine (the TA)** in order to get the fastest response, and so that we can divide the workload effectively. You can find our contact information in the sylalbus.

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier for us to help you!

### Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/cs-320-assignment-1/-/archive/main/cs-320-assignment-1-main.zip>.

If you're using macOS or a GUI file manager on Linux, make sure to turn on the "show hidden files" setting in your file manager when you extract the zip archive. There should be a folder called ".vscode" in the archive, which will be invisible in your file manager by default because its name begins with a dot.

In VSCode, open the "File" menu and click "Open Folder..." if that option is there; otherwise click "Open". Either way, you should open the ***folder*** that you just extracted: the folder that contains `README.md`, `package.json`, etc. This is important: ***open the folder itself***, not any file ***in*** the folder. This is how VSCode knows where to find the project settings.

Alternatively, if you're working in a command line, navigate to this same folder in your terminal.

### Installing the dependencies

You'll repeat this step for each TypeScript project in this course, in order to keep each project's dependencies separate for more reliable builds.

Run the command `npm i` in your terminal; if you're using VSCode, use the terminal in the bottom panel.

### Installing the VSCode testing plugin (optional, recommended)

If you're using VSCode, I recommend installing a plugin to make running the test suite more convenient. Open the "Extensions" pane in the left sidebar and search "Jest", and install the top result. This should add a new "Testing" pane to your left sidebar with an icon that looks like a lab beaker.

If you're not using VSCode, there is a way to run the tests from the command line instead. See the section titled "Testing the project" below for instructions.

### Working through the assignment

The main source code is in `src/Main.ts`, which you'll add some code to. **This is the only source code file that you're required to read and understand.**

**After** you've finished reading this README document, when you're ready to start working on the code of the assignment, open `src/Main.ts` and read through **all** of the comments carefully. The comments introduce TypeScript and explain the assignment work.

In `src/Library.ts` there is some code that you're not expected to read or understand, which implements the UI behavior. Do not modify any of this code.

If you've got some web design experience, feel free to play around with the `style/main.css` and `html/index.html` files and let me know if you come up with anything that looks nice!

### Building the project

Every TypeScript project we work with will be built the same way: see the TypeScript intro project for build instructions.

### Running the project

To run the project after building it, you can open the `html/index.html` file in a web browser. (Just drag the file onto the web browser application and it should open.) This is the assignment webpage, where you'll interact with the code that you work on.

Focus first on the **Lists** section. The first form in the section has a "Print input list" button: this allows you to input a list and see the same list printed as the output, so that you can make sure you understand how to input lists correctly. When inputting a `List` value in one of these text boxes, write a **sequence of numbers separated by commas**, like "1, 2, 3". (Any spaces are ignored.) To input an empty `List`, leave the text box empty.

The rest of the forms in the section correspond to functions in `src/Main.ts` that operate on values of the `List` type: the text boxes allow you to input the arguments to a function, and the button executes the function and prints its output. For functions that modify one of their arguments and return `void` (like `unshift`), the argument that was modified is printed after the function returns.

Similarly, in the **Trees** section, the first "Print input tree" form allows you to practice entering tree input, and the rest of the forms correspond to functions in `src/Main.ts` that operate on values of the `LogicTree` type. When inputting a `LogicTree` value in one of these text boxes, write a **Boolean logic expression using && and !**, like "true && !(false && true)". (Again, any spaces are ignored.) There is no "OR" operator in this language yet: we're keeping it very simple for now.

### Testing the project

The automated tests for this project are written using the Jest testing framework. If you have the VSCode Jest extension installed, you can run the tests from the "Testing" pane in the left sidebar. If you're working in a terminal, you can run `npm run test` from the root of the project directory.

You're encouraged to read through the tests, and feel free to ask if you want help understanding them. It should hopefully be an easy enough pattern to copy and paste and modify for yourself. It's a good idea to add your own additional tests, but it's not required.

**The tests do not tell you how to write your code.** A test failure tells you that there is something wrong with your code, but it does not tell you how to fix the problem. When you get a test failure, your next step should be ***debugging*** with an interactive debugger.

### Debugging the project

The `.vscode` folder that you extracted contains settings for debugging with VSCode and Firefox. You're welcome to use a different TypeScript debugger, but we'll only be providing instructions for this setup.

You can interactively debug the project in VSCode by opening the "Run" menu and choosing "Start Debugging". This will open a special Firefox window connected to VSCode.

To set a breakpoint, click to the left of a line number in VSCode and you should see a red dot appear. When execution reaches this line, the debugger will pause the execution of your program and let you inspect the state of the program.

Breakpoints can only work on lines that have *runtime behavior*. This generally means lines that you might end with a semicolon, although semicolons are mostly optional in TypeScript.

When you're in a debugging session, you should see an extra debugging toolbar appear near the top of your VSCode window.

**While the debugging toolbar is present, don't edit your code.** It won't break anything, but it will get confusing when the running version of your code is out of sync with the version you see in the editor. You can use the red square "Stop" button to stop the debugging session and go back to editing your code.

The other important debugger buttons appear when execution is paused at a breakpoint:

- The "Continue" button un-pauses execution.
- The "Step Over" button moves to the next line of execution in the current function.
- The "Step Into" button moves one level down the call stack, if the current line contains a function call.
- The "Step Out" button moves one level up the call stack.

While execution is paused in the debugger, you can use the "Run and Debug" pane in the left sidebar to observe the state of each variable in the "Variables" section and the state of the call stack in the "Call Stack" section.

These are your most important tools for debugging: if something in one of your functions is going wrong and you don't know why, step through the function in the debugger and watch how the variables and call stack change. We'll discuss this process in the week 2 lectures.

### Code requirements

Your code must compile without warnings or errors. If you see warnings or errors in files that you haven't modified, you can safely ignore them as long as your code still compiles and runs and passes the tests.

You may add new functions and comments to the file, but **do not change any of the provided code**, including the type definitions.

You may use TypeScript features that we haven't introduced in this class, but there are two main **forbidden features** (which we won't introduce in class):

- The non-null assertion operator, written as a '`!`' character that comes **after** its argument, for example `x!`, `x!.y`, or `x.f()!`.
- The object indexing operator, where square brackets are used with a string to index into a non-array object, for example `x["y"]`.

Note that the standard Boolean negation operator that comes **before** its argument is allowed, for example `!x`, `!x.y`, or `!x.f()`; this has an entirely different meaning than the non-null assertion operator. Indexing into arrays with `number` indices is also allowed, although it won't be very relevant in this assignment.

### Submitting your work

When you're finished, **submit only your modified `src/Main.ts` file to the Canvas dropbox, without zipping or renaming the file.**. Do not submit any other files. Please try to do this correctly in order to help the grading work go smoothly.

There's no need to put your name in the source code, Canvas will tell me which submission is yours.

**Make sure to click the submit button:** the submission isn't finished immediately after you upload your file, you still have to submit it.

You may resubmit to update your submission as many times as you want before the soft deadline for the assignment, which is shown on the Canvas dropbox page.

If you submit your work by the soft deadline, we'll grade your most recent submission that was submitted by that deadline, and then you'll have time to resubmit for a regrade one more time as explained in the syllabus.

If you submit your work after the soft deadline, we'll grade your most recent submission to date when we get around to grading it, which might be a while. That's the deal!

### Grading

Each question is worth five points. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
