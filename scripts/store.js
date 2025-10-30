export const state = {
  uploadedFile: null,         // File (csv | jpg | png)
  uploadedImage: null,        // { name, url, file } | null
  pyContent: "",              // содержимое .py
  chartVisible: false,        // флаг показа графика (шаг1)
  currentFunction: null,      // выбранная Python-функция (имя)
  currentArguments: [],       // аргументы для выбранной функции (вкл. объект order)
  argumentMetadata: null      // метаданные аргументов (min/max и т.п.)
};

export function setUploadedFile(file) {
  if (state.uploadedImage?.url) {
    URL.revokeObjectURL(state.uploadedImage.url);
  }

  state.uploadedFile = file || null;

  if (!file) {
    state.uploadedImage = null;
    return;
  }

  const ext = file.name.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png"].includes(ext)) {
    const url = URL.createObjectURL(file);
    state.uploadedImage = { name: file.name, url, file };
  } else {
    state.uploadedImage = null;
  }
}

export function resetForStep1() {
  state.chartVisible = false;
}

export function selectFunction(name, args, meta) {
  state.currentFunction = name;
  state.currentArguments = args;
  state.argumentMetadata = meta || null;
}
