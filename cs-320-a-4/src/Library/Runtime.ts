// This code is our *runtime*: it provides primitive operations for interacting
// with the webpage. You're not expected to understand it, but feel free to ask
// outside of lecture if you're curious.
import { Value } from "../AST";

export const clearOutput = (): void => {
  const output = <HTMLOListElement> document.getElementById("print-output");
  output.innerHTML = "";
}

export const printLine = (value: Value): void => {
  const output = <HTMLOListElement> document.getElementById("print-output");
  const line = output.appendChild(document.createElement("li"));
  line.innerText = value.toString();
}
