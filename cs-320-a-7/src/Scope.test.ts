import "jest-extended";
import { BlockStmt, BoolLeaf, CallExpr, CallStmt, EqualExpr, IfStmt, NotExpr, NumLeaf, PlusExpr, PrintStmt, VarDeclStmt, VarLeaf, VarUpdateStmt, WhileStmt } from "./AST";
import { Func } from "./Function";
import { Prog } from "./Program";
import * as runtime from "./Library/Runtime";
import * as factories from "./Factories";

import * as scope from "./Scope";
import { SourceType } from "./Type";

test("executeInNestedScope", () => {
  const printedLines: string[] = [];
  jest.spyOn(runtime, "printLine").mockImplementation(val => printedLines.push(val.toString()));

  const testProg = new Prog(
    new scope.MapFuncScope(new Map([
      ["f", new Func(
        "f", "bool", [{ name: "a", type: "num" }], new BlockStmt([
          new CallStmt("g", []),
          new CallStmt("h", []),
          new CallStmt("g", []),
        ]), new BoolLeaf(true)
      )],
      ["g", new Func(
        "g", "num", [], new BlockStmt([
          new PrintStmt(new NumLeaf(1))
        ]), new NumLeaf(1)
      )],
      ["h", new Func(
        "h", "void", [], new BlockStmt([
          new VarDeclStmt("x", new CallExpr("g", [])),
          new WhileStmt(
            new NotExpr(new EqualExpr(new NumLeaf(5), new VarLeaf("x"))),
            new BlockStmt([
              new VarDeclStmt("y", new NumLeaf(10)),
              new PrintStmt(new VarLeaf("x")),
              new VarUpdateStmt("x", new PlusExpr(new CallExpr("g", []), new VarLeaf("x")))
            ])
          ),
          new VarDeclStmt("y", new NumLeaf(100))
        ]), null
      )],
      ["main", new Func(
        "main", "void", [], new BlockStmt([
          new PrintStmt(new CallExpr("f", [new NumLeaf(1)]))
        ]), null
      )]
    ]))
  );

  testProg.interpret();

  expect(printedLines).toEqual([
    "1", "1", "1", "1",
    "2", "1", "3", "1", "4", "1",
    "1", "true"
  ]);
});