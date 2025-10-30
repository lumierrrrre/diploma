export async function runPythonFunction({ functionName, args, orderOverride, file, pyContent }) {
  const finalArgs = args.map(a => {
    if (typeof a === "object" && a?.name === "order") {
      if (Number.isFinite(orderOverride)) return orderOverride;
      return Number.isFinite(a.min) ? a.min : 1;
    }
    if (a === "file") {
      return file;
    }
    return a; 
  });
}
