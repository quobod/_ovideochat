export const log = console.log.bind(console);

export const table = console.table.bind(console);

export const error = console.error.bind(console);

export const cls = console.clear.bind(console);

export const dlog = (
  argument = "printer argument",
  label = "printer label"
) => {
  console.group(label);
  console.trace(argument);
  console.groupEnd();
};
