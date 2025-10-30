export function parsePythonFunctions(pyText) {
  if (!pyText || typeof pyText !== "string") return [];
  const regex = /^\s*def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*:/gm;
  const result = [];
  let m;
  while ((m = regex.exec(pyText)) !== null) {
    const name = m[1];
    const argsRaw = m[2].trim();
    const args = argsRaw
      ? argsRaw.split(",").map(s => s.trim()).map(a => {
          const onlyName = a.split("=")[0].split(":")[0].trim();
          return onlyName;
        })
      : [];
    result.push({ name, args });
  }
  return result;
}
