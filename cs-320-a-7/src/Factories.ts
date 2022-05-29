import { Func } from "./Function";
import {
  VarScope, MapFuncScope, MapVarScope
} from "./Scope";

export function newFunctionScope(functions: ReadonlyMap<string, Func>) {
  return new MapFuncScope(functions);
}

export function newEmptyVarScope<Entry>(): VarScope<Entry> {
  return new MapVarScope<Entry>();
}