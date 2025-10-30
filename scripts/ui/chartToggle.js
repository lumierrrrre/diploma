import { state } from "../store.js";
import { byId, show, hide } from "./dom.js";

const { renderChart, Chart } = window;

export function initChartToggle() {
  const plotButton = byId("plotButton");
  const chartContainer = byId("chartContainer");
  const dataBlock = document.querySelector("#step1 .data");

  let chartHandle = null;

  plotButton.addEventListener("click", async () => {
    if (!state.uploadedFile) return;

    if (!state.chartVisible) {
      hide(dataBlock);
      show(chartContainer);
      if (chartHandle) { chartHandle.destroy(); chartHandle = null; }
      chartContainer.innerHTML = "";

      chartHandle = await renderChart(chartContainer, state.uploadedFile, { Chart }, {
        height: "600px"
      });

      plotButton.textContent = "Скрыть график";
      state.chartVisible = true;
    } else {
      show(dataBlock);
      hide(chartContainer);
      chartContainer.innerHTML = "";
      plotButton.textContent = "Показать график";
      state.chartVisible = false;
    }
  });
}
