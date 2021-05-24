import ansiHTML = require("ansi-html");
import Html5Entities = require("html-entities");

const entities = new Html5Entities.Html5Entities();

export function CompileErrorTrace(message: string) {
  const errorParts = message.split("\n");

  const errorMessage = errorParts[1];

  errorParts.shift();
  errorParts.shift();

  const _errorParts = errorParts.filter((p) => !p.startsWith("    at"));

  const res = entities.decode(ansiHTML(entities.encode(_errorParts.join("\n"))));

  return `<div><h1 style='color: rgb(211, 79, 86)'>Failed to compile.</h1><strong>${errorMessage}</strong><pre>${res}</pre></div>`;
}
