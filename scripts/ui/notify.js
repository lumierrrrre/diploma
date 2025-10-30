export function notify(type, msg) {
  if (type === "error") console.error(msg);
  else console.log(msg);
  alert(msg);
}
