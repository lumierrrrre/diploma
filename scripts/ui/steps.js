import { state, selectFunction } from "../store.js";
import { $, byId, show, hide, swapSteps } from "./dom.js";
import { notify } from "./notify.js";
import { parsePythonFunctions } from "../py/parser.js";
import { buildFunctionsForm } from "./functionsForm.js";
import { runPythonFunction } from "../py/runner.js";

const { renderChart, Chart } = window;

export function initSteps() {
  const sidebar = byId("sidebar");
  const dataBlock = $("#step1 .data");
  const chartContainer = byId("chartContainer");

  const nextStepButton = $(".sidebar__actions--next");
  const backToStep1Button = byId("backToStep1");
  const backToStep2 = byId("backToStep2");

  nextStepButton.addEventListener("click", () => {
    if (!state.uploadedFile && !state.pyContent) {
      notify("error", "Сначала выберите CSV/изображение или загрузите .py");
      return;
    }

    const step2 = byId("step2");

    if (state.pyContent && !state.uploadedFile) {
      byId("step1").classList.remove("step--active");
      step2.classList.add("step--active");
      sidebar.classList.remove("sidebar--visible");
      show(dataBlock);
      hide(chartContainer);
      chartContainer.innerHTML = "";
      byId("plotButton").textContent = "Показать график";
      state.chartVisible = false;
      return;
    }

    step2.classList.remove("step--active");
    byId("step3").classList.add("step--active");
    sidebar.classList.remove("sidebar--visible");

    const functionForm = byId("functionForm");
    functionForm.innerHTML = "";

    const functions = parsePythonFunctions(state.pyContent);
    if (!functions.length) {
      functionForm.innerHTML = "<p>Функции не найдены.</p>";
      return;
    }

    buildFunctionsForm(functionForm, functions, (pickedName, argMeta) => {
      const fn = functions.find(f => f.name === pickedName);
      const args = [];
      const metaByArg = {};

      fn.args.forEach(arg => {
        if (arg === "file") {
          args.push("file");
          return;
        }
        if (arg === "order") {
          const minEl = byId(`${fn.name}_order_min`);
          const maxEl = byId(`${fn.name}_order_max`);
          const min = parseInt(minEl?.value || "1", 10);
          const max = parseInt(maxEl?.value || "10", 10);
          args.push({ name: "order", min, max });
          metaByArg.order = { min, max };
          return;
        }
        const active = byId(`${fn.name}_${arg}_active`);
        if (active?.checked) args.push(arg);

        const minEl = byId(`${fn.name}_${arg}_min`);
        const maxEl = byId(`${fn.name}_${arg}_max`);
        const min = minEl?.value ? Number(minEl.value) : undefined;
        const max = maxEl?.value ? Number(maxEl.value) : undefined;
        metaByArg[arg] = { min, max };
      });

      selectFunction(fn.name, args, metaByArg);
      renderStep4Controls();
    });
  });

  backToStep1Button.addEventListener("click", () => {
    swapSteps("step2", "step1");
    sidebar.classList.add("sidebar--visible");
    show(dataBlock);
    hide(chartContainer);
    chartContainer.innerHTML = "";
    byId("plotButton").textContent = "Показать график";
    state.chartVisible = false;
  });

  backToStep2.addEventListener("click", () => {
    swapSteps("step3", "step2");
  });
}

export function renderStep4Controls() {
  byId("step3").classList.remove("step--active");
  byId("step4").classList.add("step--active");

  const container = $("#step4 .data__description");
  container.innerHTML = `
    <div id="orderControl" style="margin-bottom: 1rem;"></div>
    <div id="chartArea"></div>
  `;

  const orderParam = state.currentArguments.find(
    (a) => typeof a === "object" && a?.name === "order"
  );

  const chartArea = byId("chartArea");

  async function draw(resultCsv) {
    const blob = new Blob([resultCsv], { type: "text/csv" });
    chartArea.innerHTML = "";
    await renderChart(chartArea, blob, { Chart }, { height: "600px" });
  }

  async function runAndDraw(orderValue) {
    try {
      const resultCsv = await runPythonFunction({
        functionName: state.currentFunction,
        args: state.currentArguments,
        orderOverride: orderValue,
        file: state.uploadedFile,
        pyContent: state.pyContent
      });
      await draw(resultCsv);
    } catch (err) {
      console.error("❌ Ошибка при выполнении Python:", err);
      notify("error", "Ошибка при выполнении функции");
    }
  }

  if (orderParam) {
    const { min = 1, max = 10 } = orderParam;
    const wrap = byId("orderControl");

    const label = document.createElement("label");
    label.textContent = "Параметр order:";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = String(min);
    slider.max = String(max);
    slider.value = String(min);
    slider.step = "1";

    const valueDisplay = document.createElement("span");
    valueDisplay.textContent = String(min);
    valueDisplay.style.marginLeft = "10px";

    slider.addEventListener("input", () => {
      const val = parseInt(slider.value, 10);
      valueDisplay.textContent = String(val);
      runAndDraw(val);
    });

    wrap.appendChild(label);
    wrap.appendChild(slider);
    wrap.appendChild(valueDisplay);

    runAndDraw(min);
  } else {
    runAndDraw(undefined);
  }
}
