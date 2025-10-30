import { initUploader } from "./ui/uploader.js";
import { initChartToggle } from "./ui/chartToggle.js";
import { initSteps } from "./ui/steps.js";

document.addEventListener("DOMContentLoaded", () => {
  initUploader();
  initChartToggle();
  initSteps();
});
