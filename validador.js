(function () {
  function loadFlatpickrDependencies(callback) {
    const flatpickrCss = document.createElement("link");
    flatpickrCss.rel = "stylesheet";
    flatpickrCss.href =
      "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
    document.head.appendChild(flatpickrCss);

    const flatpickrScript = document.createElement("script");
    flatpickrScript.src = "https://cdn.jsdelivr.net/npm/flatpickr";
    flatpickrScript.onload = () => {
      const rangePluginScript = document.createElement("script");
      rangePluginScript.src =
        "https://cdn.jsdelivr.net/npm/flatpickr/dist/plugins/rangePlugin.js";
      rangePluginScript.onload = callback;
      document.head.appendChild(rangePluginScript);
    };
    document.head.appendChild(flatpickrScript);
  }

  function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) {
      callback(el);
    } else {
      setTimeout(() => waitForElement(selector, callback), 300);
    }
  }

  function createMultidataFields() {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `
      <label>Seleção Multidata* 
        <span class="tooltip-icon" data-tooltip="Escolha um intervalo de datas para o evento">?</span>
      </label>
      <div class="form-inline">
        <input id="dateStart" name="fmultidata_inicio" class="form-control" placeholder="Data Início" required>
        <input id="dateEnd" name="fmultidata_fim" class="form-control" placeholder="Data Fim" required>
      </div>
      <div class="form-inline" style="margin-top: 5px;">
        <input id="timeStart" name="fmultihora_inicio" class="form-control" type="time" required>
        <input id="timeEnd" name="fmultihora_fim" class="form-control" type="time" required>
      </div>
    `;

    const referenceGroup = document
      .querySelector("#datetimeRange")
      ?.closest(".form-group");
    if (referenceGroup?.parentNode) {
      referenceGroup.parentNode.insertBefore(group, referenceGroup);
    }

    flatpickr("#dateStart", {
      altInput: true,
      altFormat: "d/m/Y",
      dateFormat: "Y-m-d",
      disableMobile: true, // ← força flatpickr no mobile
      plugins: [new rangePlugin({ input: "#dateEnd" })],
    });
  }

  // Iniciar o carregamento e inicialização
  loadFlatpickrDependencies(() => {
    waitForElement("#datetimeRange", createMultidataFields);
  });
})();
