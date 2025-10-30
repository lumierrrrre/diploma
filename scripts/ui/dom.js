export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
export const byId = (id) => document.getElementById(id);

export function show(el) { el?.classList?.remove("hidden"); }
export function hide(el) { el?.classList?.add("hidden"); }
export function swapSteps(hideStepId, showStepId) {
  byId(hideStepId)?.classList?.remove("step--active");
  byId(showStepId)?.classList?.add("step--active");
}
