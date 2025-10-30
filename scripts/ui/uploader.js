import { state, setUploadedFile, resetForStep1 } from "../store.js";
import { $, byId, show, hide } from "./dom.js";
import { notify } from "./notify.js";

export function initUploader() {
  const fileInput = byId("fileInput");
  const chooseFileButton = $(".data__button");
  const fileNameDisplay = byId("fileNameDisplay");
  const sidebar = byId("sidebar");
  const plotButton = byId("plotButton");
  const dataBlock = $("#step1 .data");
  const chartContainer = byId("chartContainer");

  chooseFileButton.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const valid = ["csv", "jpg", "jpeg", "png"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!valid.includes(ext)) {
      notify("error", "Неподдерживаемый формат файла");
      return;
    }

    setUploadedFile(file);
    fileNameDisplay.textContent = file.name;
    sidebar.classList.add("sidebar--visible");

    plotButton.style.display = ext === "csv" ? "block" : "none";

    show(dataBlock);
    hide(chartContainer);
    chartContainer.innerHTML = "";

    plotButton.textContent = "Показать график";
    resetForStep1();
  });

  const scriptInput = byId("scriptInput");
  scriptInput.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".py")) {
      notify("error", "Загрузите файл в формате .py");
      return;
    }
    const text = await file.text();
    state.pyContent = text;
  });
}
