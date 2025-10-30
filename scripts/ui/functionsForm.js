import { byId } from "./dom.js";

export function buildFunctionsForm(root, functions, onSubmit) {
  const list = document.createElement("div");
  list.className = "functions-list";

  functions.forEach(fn => {
    const fnBlock = document.createElement("div");
    fnBlock.className = "function-block";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "selectedFunction";
    radio.value = fn.name;
    radio.id = `fn_${fn.name}`;

    const label = document.createElement("label");
    label.htmlFor = radio.id;
    label.textContent = fn.name;

    fnBlock.appendChild(radio);
    fnBlock.appendChild(label);

    // Аргументы
    fn.args.forEach(arg => {
      const argGroup = document.createElement("div");
      argGroup.className = "arg-group";

      if (arg === "order") {
        const minInput = document.createElement("input");
        minInput.id = `${fn.name}_order_min`;
        minInput.type = "number";
        minInput.name = `${fn.name}_order_min`;
        minInput.placeholder = "Мин";
        minInput.style.width = "70px";

        const maxInput = document.createElement("input");
        maxInput.id = `${fn.name}_order_max`;
        maxInput.type = "number";
        maxInput.name = `${fn.name}_order_max`;
        maxInput.placeholder = "Макс";
        maxInput.style.width = "70px";

        argGroup.appendChild(minInput);
        argGroup.appendChild(maxInput);
      } else if (arg === "file") {
        const fileNote = document.createElement("p");
        fileNote.textContent = 'Аргумент "file" будет взят из загруженного файла';
        argGroup.appendChild(fileNote);
      } else {
        // чекбокс + min/max
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = `${fn.name}_${arg}_active`;
        checkbox.id = `${fn.name}_${arg}_active`;
        checkbox.checked = true;

        const checkboxLabel = document.createElement("label");
        checkboxLabel.htmlFor = checkbox.id;
        checkboxLabel.textContent = `Параметр "${arg}":`;

        const minInput = document.createElement("input");
        minInput.id = `${fn.name}_${arg}_min`;
        minInput.type = "number";
        minInput.name = `${fn.name}_${arg}_min`;
        minInput.placeholder = "Мин";
        minInput.style.width = "70px";

        const maxInput = document.createElement("input");
        maxInput.id = `${fn.name}_${arg}_max`;
        maxInput.type = "number";
        maxInput.name = `${fn.name}_${arg}_max`;
        maxInput.placeholder = "Макс";
        maxInput.style.width = "70px";

        argGroup.appendChild(checkbox);
        argGroup.appendChild(checkboxLabel);
        argGroup.appendChild(minInput);
        argGroup.appendChild(maxInput);
      }

      fnBlock.appendChild(argGroup);
    });

    list.appendChild(fnBlock);
  });

  root.appendChild(list);

  const submit = document.createElement("button");
  submit.type = "button";
  submit.textContent = "Далее";
  submit.className = "btn btn--primary";
  submit.addEventListener("click", () => {
    const selected = root.querySelector('input[name="selectedFunction"]:checked');
    if (!selected) {
      alert("Выберите функцию");
      return;
    }

    const pickedName = selected.value;

    const meta = {};
    const fn = functions.find(f => f.name === pickedName);
    fn.args.forEach(arg => {
      if (arg === "order") {
        const minEl = byId(`${fn.name}_order_min`);
        const maxEl = byId(`${fn.name}_order_max`);
        const min = minEl?.value ? Number(minEl.value) : undefined;
        const max = maxEl?.value ? Number(maxEl.value) : undefined;
        meta.order = { min, max };
      } else {
        const minEl = byId(`${fn.name}_${arg}_min`);
        const maxEl = byId(`${fn.name}_${arg}_max`);
        const active = byId(`${fn.name}_${arg}_active`);
        const min = minEl?.value ? Number(minEl.value) : undefined;
        const max = maxEl?.value ? Number(maxEl.value) : undefined;
        meta[arg] = { min, max, active: !!active?.checked };
      }
    });

    onSubmit(pickedName, meta);
  });

  root.appendChild(submit);
}
