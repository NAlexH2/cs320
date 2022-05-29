// This code is our *runtime*: it provides primitive operations for interacting
// with the webpage. You're not expected to understand it, but feel free to ask
// outside of lecture if you're curious.
import { SourceType, Value, ValueOf } from "../AST";

export const clearOutput = (): void => {
  const output = <HTMLOListElement> document.getElementById("print-output");
  output.innerHTML = "";
}

export const printLine = (value: Value): void => {
  const output = <HTMLOListElement> document.getElementById("print-output");
  const line = output.appendChild(document.createElement("li"));
  line.innerText = value.toString();
}

export const input = <ValueType extends SourceType> (
  tag: ValueType
): ValueOf<ValueType> => {
  while (true) {
    const text = prompt("Enter a value of type " + tag + ".")?.trim();
    if (text != null) {
      switch (tag) {
        case "num": {
          const parsed: number = Number.parseFloat(text);
          if (!Number.isNaN(parsed))
            return <ValueOf<ValueType>> parsed;
        }

        case "bool":
          switch (text) {
            case "true": return <ValueOf<ValueType>> true;
            case "false": return <ValueOf<ValueType>> false;
          }
      }
    }
  }
}
