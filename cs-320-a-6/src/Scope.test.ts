import "jest-extended";
import { BlockStmt, BoolLeaf, CallExpr, CallStmt, EqualExpr, IfStmt, NotExpr, NumLeaf, PlusExpr, PrintStmt, VarDeclStmt, VarLeaf, VarUpdateStmt, WhileStmt } from "./AST";
import { Func } from "./Function";
import { Prog } from "./Program";
import * as runtime from "./Library/Runtime";
import * as factories from "./Factories";

import * as scope from "./Scope";
import { SourceType } from "./Type";

interface FuncScopeFactory {
  new(functions: Map<string, Func>): scope.FuncScope;
}

test("DebugMapFuncScope test", () => {
  const DebugMapFuncScope: FuncScopeFactory = (<any> scope).DebugMapFuncScope;
  expect(DebugMapFuncScope).toBeDefined();
  expect(DebugMapFuncScope.prototype).toBeInstanceOf(scope.MapFuncScope);

  jest.spyOn(runtime, "printLine").mockImplementation(_ => { });

  const infoLogs: string[] = [];
  jest.spyOn(console, "info").mockImplementation(msg => infoLogs.push(msg));

  const testProg = new Prog(
    new DebugMapFuncScope(new Map([
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
            new VarUpdateStmt("x", new PlusExpr(new CallExpr("g", []), new VarLeaf("x")))
          )
        ]), null
      )],
      ["main", new Func(
        "main", "void", [], new BlockStmt([
          new PrintStmt(new CallExpr("f", [new NumLeaf(1)]))
        ]), null
      )]
    ]))
  );

  testProg.typecheck();

  expect(infoLogs).toEqual(["g", "h", "g", "g", "g", "f", "main"]);

  while (infoLogs.length > 0)
    infoLogs.pop();

  testProg.interpret();

  expect(infoLogs).toEqual(["main", "f", "g", "h", "g", "g", "g", "g", "g", "g"]);
});

test("ListVarScope test", () => {
  const ListVarScope = (<any>scope)["ListVarScope"]!;
  expect(ListVarScope).toBeDefined();
  expect(ListVarScope.prototype).toBeInstanceOf(scope.ListVarScopeSpec);

  const printedLines: string[] = [];
  jest.spyOn(runtime, "printLine").mockImplementation(line => {
    printedLines.push(line.toString())
  });

  jest.spyOn(factories, "newEmptyVarScope").mockImplementation(() => new ListVarScope(new Map(), null))

  const testProg = new Prog(
    new scope.MapFuncScope(new Map([
      ["main", new Func(
        "main", "void", [], new BlockStmt([
          new VarDeclStmt("x", new NumLeaf(1)),
          new PrintStmt(new VarLeaf("x")),
          new BlockStmt([
            new PrintStmt(new VarLeaf("x")),
            new VarDeclStmt("x", new NumLeaf(2)),
            new PrintStmt(new VarLeaf("x")),
            new VarUpdateStmt("x", new NumLeaf(3)),
            new PrintStmt(new VarLeaf("x")),
            new VarDeclStmt("y", new BoolLeaf(true)),
            new PrintStmt(new VarLeaf("y"))
          ]),
          new PrintStmt(new VarLeaf("x")),
        ]), null
      )]
    ]))
  );

  testProg.typecheck();
  testProg.interpret();
  expect(printedLines).toEqual(["1", "1", "2", "3", "true", "1"]);

  expect(() => new Prog(
    new scope.MapFuncScope(new Map([
      ["main", new Func(
        "main", "void", [], new BlockStmt([
          new BlockStmt([
            new VarDeclStmt("y", new BoolLeaf(true)),
          ]),
          new PrintStmt(new VarLeaf("y")),
        ]), null
      )]
    ]))
  ).typecheck()).toThrow(scope.ScopeError);

  new Prog(
    new scope.MapFuncScope(new Map([
      ["main", new Func(
        "main", "void", [], new BlockStmt([
          new VarDeclStmt("x", new BoolLeaf(false)),
          new WhileStmt(new BoolLeaf(true), new BlockStmt([
            new VarDeclStmt("y", new BoolLeaf(true)),
            new PrintStmt(new VarLeaf("y")),
            new PrintStmt(new VarLeaf("x"))
          ])),
          new VarDeclStmt("y", new BoolLeaf(true)),
        ]), null
      )]
    ]))
  ).typecheck()

  expect(() => new Prog(
    new scope.MapFuncScope(new Map([
      ["main", new Func(
        "main", "void", [], new BlockStmt([
          new WhileStmt(new BoolLeaf(true), new BlockStmt([
            new VarDeclStmt("y", new BoolLeaf(true)),
          ])),
          new VarUpdateStmt("y", new BoolLeaf(false))
        ]), null
      )]
    ]))
  ).typecheck()).toThrow(scope.ScopeError);

  new Prog(
    new scope.MapFuncScope(new Map([
      ["main", new Func(
        "main", "void", [], new BlockStmt([
          new VarDeclStmt("x", new BoolLeaf(false)),
          new IfStmt(new BoolLeaf(true),
            new BlockStmt([
              new VarDeclStmt("y", new BoolLeaf(true)),
              new PrintStmt(new VarLeaf("y")),
              new PrintStmt(new VarLeaf("x"))
            ]),
            new BlockStmt([
              new VarDeclStmt("z", new BoolLeaf(true)),
              new PrintStmt(new VarLeaf("z")),
              new PrintStmt(new VarLeaf("x"))
            ])
          ),
          new VarDeclStmt("y", new BoolLeaf(true)),
          new VarDeclStmt("z", new BoolLeaf(true)),
        ]), null
      )]
    ]))
  ).typecheck()

  expect(() => new Prog(
    new scope.MapFuncScope(new Map([
      ["main", new Func(
        "main", "void", [], new BlockStmt([
          new VarDeclStmt("x", new BoolLeaf(false)),
          new IfStmt(new BoolLeaf(true),
            new BlockStmt([
              new VarDeclStmt("y", new BoolLeaf(true)),
              new PrintStmt(new VarLeaf("y")),
              new PrintStmt(new VarLeaf("x"))
            ]),
            new BlockStmt([
              new VarDeclStmt("z", new BoolLeaf(true)),
              new PrintStmt(new VarLeaf("z")),
              new PrintStmt(new VarLeaf("x"))
            ])
          ),
          new PrintStmt(new VarLeaf("z"))
        ]), null
      )]
    ]))
  ).typecheck()).toThrow(scope.ScopeError);
})