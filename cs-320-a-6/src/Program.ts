import { StaticTypeError } from "./Type";
import { FuncScope } from "./Scope";
import { newEmptyVarScope } from "./Factories";
import { CallStmt } from "./Statement";

const mainCall: CallStmt = new CallStmt("main", []);

export class Prog {
  readonly functions: FuncScope;

  constructor(functions: FuncScope) {
    this.functions = functions;
  }

  typecheck(): void {
    for (const func of this.functions.functionsInScope())
      func.typecheckDefinition(this.functions);

    mainCall.typecheck(this.functions, newEmptyVarScope());
  }

  interpret(): void {
    mainCall.interpret(this.functions, newEmptyVarScope())
  }
}