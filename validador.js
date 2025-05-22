(function () {
  document.getElementById("prrprrpatapim").remove();

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
      rangePluginScript.onload = () => {
        const localeScript = document.createElement("script");
        localeScript.src =
          "https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/pt.js";
        localeScript.onload = callback;
        document.head.appendChild(localeScript);
      };
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
      <label>Data do Evento* 
        <span class="tooltip-icon" data-tooltip="Escolha uma ou mais datas para o evento (não inclua as datas de montagem/desmontagem caso estas sejam no dia posterior/anterior)">?</span>
      </label>
      <div class="dates-wrapper">
      <div class="form-inline">
        <input id="dateStart" name="fdata" class="form-control" placeholder="Início do Evento" required>
        <input id="timeStart" name="fhora" class="form-control" placeholder="Hora de início" required>
      </div>
      <b>até</b>
      <div class="form-inline" style="margin-top: 5px;">
        <input id="dateEnd" name="fdatafim" class="form-control" placeholder="Final do Evento" required>
        <input id="timeEnd" name="fhorafim" class="form-control" placeholder="Hora do termino" required>
      </div>
      </div>
    `;

    const targetInput = document.querySelector('input[name="fnomeevento"]');
    const targetGroup = targetInput?.closest(".form-group");
    if (targetGroup?.parentNode) {
      targetGroup.parentNode.insertBefore(group, targetGroup.nextSibling);
    }

    flatpickr("#dateStart", {
      altInput: true,
      altFormat: "d/m/Y",
      dateFormat: "Y-m-d",
      locale: "pt",
      disableMobile: true,
      minDate: "today",
      plugins: [new rangePlugin({ input: "#dateEnd" })],
    });

    ["#timeStart", "#timeEnd"].forEach((selector) => {
      flatpickr(selector, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        locale: "pt",
        disableMobile: true,
        minDate: "today",
      });
    });
  }

  loadFlatpickrDependencies(() => {
    waitForElement('input[name="fnomeevento"]', createMultidataFields);
  });

  // Delegação de eventos para tooltips dinâmicos
  document.body.addEventListener(
    "mouseenter",
    (e) => {
      const el = e.target.closest(".tooltip-icon");
      if (!el) return;

      const tooltipText = el.getAttribute("data-tooltip");
      if (!tooltipText) return;

      const temp = document.createElement("div");
      temp.style.cssText = `
      position: fixed;
      visibility: hidden;
      padding: 6px 10px;
      font-size: 12px;
      max-width: ${window.innerWidth <= 768 ? "15rem" : "24rem"};
      width: fit-content;
      white-space: pre-wrap;
    `;
      temp.textContent = tooltipText;
      document.body.appendChild(temp);

      const iconRect = el.getBoundingClientRect();
      const tooltipRect = temp.getBoundingClientRect();

      let left = iconRect.left + iconRect.width / 2 - tooltipRect.width / 2;
      let top = iconRect.bottom + 8;

      left = Math.max(
        8,
        Math.min(window.innerWidth - tooltipRect.width - 8, left)
      );
      top = Math.min(window.innerHeight - tooltipRect.height - 8, top);

      el.style.setProperty("--tooltip-left", `${left}px`);
      el.style.setProperty("--tooltip-top", `${top}px`);

      temp.remove();
      el.classList.add("show-tooltip");
    },
    true
  );

  document.body.addEventListener(
    "mouseleave",
    (e) => {
      const el = e.target.closest(".tooltip-icon");
      if (el) {
        el.classList.remove("show-tooltip");
      }
    },
    true
  );
  ////////////////////////////////////////iput required check
  const checkumemei = document.getElementById("qtd1.5check");
  const barumemei = document.getElementById("qtd1.5inpt");

  const checkdoispordois = document.getElementById("qtd2x2check");
  const bardoispordois = document.getElementById("qtd2x2inpt");

  checkumemei.addEventListener("change", () => {
    if (checkumemei.checked) {
      barumemei.disabled = false;
      barumemei.required = true;
    } else {
      barumemei.disabled = true;
      barumemei.required = false;
      barumemei.value = ""; // opcional: limpa o campo ao desativar
    }
  });
  checkdoispordois.addEventListener("change", () => {
    if (checkdoispordois.checked) {
      bardoispordois.disabled = false;
      bardoispordois.required = true;
    } else {
      bardoispordois.disabled = true;
      bardoispordois.required = false;
      bardoispordois.value = ""; // opcional: limpa o campo ao desativar
    }
  });
  ///////////////////////////////////////////////// animacoes
  (function () {
    const sections = document.querySelectorAll(".form-section");

    // Oculta todas as seções exceto a primeira
    sections.forEach((section, index) => {
      if (index !== 0) {
        section.style.display = "none";
      }
    });

    function animateFields(section) {
      const fields = section.querySelectorAll(".form-group");

      setTimeout(() => {
        fields.forEach((field, i) => {
          setTimeout(() => {
            field.classList.add("fade-in");

            // Remove a classe de animação após o fim e aplica final-state
            field.addEventListener(
              "animationend",
              () => {
                field.classList.remove("fade-in");
              },
              { once: true }
            );
          }, i * 120);
        });
      }, 300);
    }

    function animateSection(section) {
      section.style.display = "block";
      section.classList.add("slide-fade-in");

      // Remove a classe de animação após o fim e aplica final-state
      section.addEventListener(
        "animationend",
        () => {
          section.classList.remove("slide-fade-in");
        },
        { once: true }
      );

      section.scrollIntoView({ behavior: "smooth", block: "start" });
      animateFields(section);
    }

    function isValidPhone(value) {
      const digits = value.replace(/\D/g, "");
      return digits.length === 11;
    }

    function isValidEmail(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }

    function validateSection(section) {
      const inputs = section.querySelectorAll("input, select, textarea");
      const fobs2 = section.querySelectorAll('input[name="fobs2"]');
      const fobs3 = section.querySelectorAll('input[name="fobs3"]');
      const checkboxes = section.querySelectorAll('input[name="opcao"]');

      for (const input of inputs) {
        if (input.required) {
          const value = input.value.trim();
          if (!value) return false;

          if (input.name === "fcelular" && !isValidPhone(value)) {
            return false;
          }

          if (input.type === "email" && !isValidEmail(value)) {
            return false;
          }
        }
        if (Array.from(checkboxes).length > 0) {
          const peloMenosUmMarcado = Array.from(checkboxes).some(
            (cb) => cb.checked
          );

          if (!peloMenosUmMarcado) {
            return false;
          }
        }
        if (Array.from(fobs2).length > 0) {
          const peloMenosUmMarcado = Array.from(fobs2).some((cb) => cb.checked);

          if (!peloMenosUmMarcado) {
            return false;
          }
        }
        if (Array.from(fobs3).length > 0) {
          const peloMenosUmMarcado = Array.from(fobs3).some((cb) => cb.checked);

          if (!peloMenosUmMarcado) {
            return false;
          }
        }
      }
      return true;
    }

    function setupListeners(section, index) {
      const inputs = section.querySelectorAll("input, select, textarea");

      const nextSection = sections[index + 1];
      let validationTimeout;

      function checkAndAdvance() {
        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(() => {
          if (validateSection(section)) {
            if (nextSection && nextSection.style.display === "none") {
              animateSection(nextSection);
            }
            if (index === 1) {
              const submitButton = document.getElementsByClassName("btn")[0];
              if (submitButton) {
                submitButton.style.display = "block";
              }
            }
          } else {
            if (index === 1) {
              const submitButton = document.getElementsByClassName("btn")[0];
              if (submitButton) {
                submitButton.style.display = "none";
              }
            }
          }
        }, 2000);
      }

      inputs.forEach((input) => {
        input.addEventListener("input", checkAndAdvance);
        input.addEventListener("blur", checkAndAdvance);
        input.addEventListener("change", checkAndAdvance);
        input.addEventListener("paste", () => {
          setTimeout(checkAndAdvance, 100);
        });
      });
    }

    sections.forEach((section, index) => {
      setupListeners(section, index);
    });

    animateSection(sections[0]);

    const submitButton = document.getElementsByClassName("btn")[0];

    if (submitButton) {
      submitButton.type = "button";
      submitButton.textContent = "Solicitar Orçamento";
      submitButton.addEventListener("click", function () {
        const form = document.getElementById("formdoc");
        const formData = new FormData(form);

        // --- FORMATAÇÃO DE DATAS ---
        let fdataRaw = formData.get("fdata") || "";
        let fdatafimRaw = formData.get("fdatafim") || "";

        // Trata fdata: usa só o trecho antes de "até", se existir
        if (fdataRaw.includes("até")) {
          fdataRaw = fdataRaw.split("até")[0].trim();
        }

        // Trata fdatafim: de DD/MM/YYYY para YYYY-MM-DD
        let partesFim = fdatafimRaw.split("/");
        let fdatafimFormatada = "";
        if (partesFim.length === 3) {
          fdatafimFormatada = `${partesFim[2]}-${partesFim[1].padStart(
            2,
            "0"
          )}-${partesFim[0].padStart(2, "0")}`;
        }

        // Atualiza campos no formulário (remove os antigos e adiciona novos hidden com formato correto)
        ["fdata", "fdatafim"].forEach((name) => {
          const el = form.querySelector(`[name="${name}"]`);
          if (el) el.remove();
        });

        const fdataInput = document.createElement("input");
        fdataInput.type = "hidden";
        fdataInput.name = "fdata";
        fdataInput.value = fdataRaw;

        const fdatafimInput = document.createElement("input");
        fdatafimInput.type = "hidden";
        fdatafimInput.name = "fdatafim";
        fdatafimInput.value = fdatafimFormatada;

        form.appendChild(fdataInput);
        form.appendChild(fdatafimInput);

        // --- FORMATAÇÃO DE FOBS ---
        const fobsParts = [];

        const fobs1 = formData.get("fobs1") || "";
        const fobs2 = formData.get("fobs2") || "";
        const fobs3 = formData.get("fobs3") || "";
        const qtd2x2 = formData.get("fobs4qtd2x2") || "";
        const qtd1x1 = formData.get("fobs4qtd1.5") || "";
        const fobs5 = formData.get("fobs5") || "";
        const fobs6 = formData.get("fobs6") || "";
        const fobs7 = formData.get("fobs7") || "";

        const fobs4 = [];
        if (qtd2x2.trim() !== "") fobs4.push(`2x2: ${qtd2x2}`);
        if (qtd1x1.trim() !== "") fobs4.push(`1.5x1.5: ${qtd1x1}`);

        fobsParts.push(fobs1, fobs2, fobs3);
        if (fobs4.length > 0) fobsParts.push(fobs4.join(" "));
        fobsParts.push(fobs5, fobs6, fobs7);

        const fobsFinal = fobsParts.filter(Boolean).join("||");

        // Remove campos antigos de fobs
        [
          "fobs",
          "fobs1",
          "fobs2",
          "fobs3",
          "fobs4qtd2x2",
          "fobs4qtd1.5",
          "fobs5",
          "fobs6",
          "fobs7",
        ].forEach((name) => {
          const el = form.querySelector(`[name="${name}"]`);
          if (el) el.remove();
        });

        // Adiciona campo fobs único
        const fobsInput = document.createElement("input");
        fobsInput.type = "hidden";
        fobsInput.name = "fobs";
        fobsInput.value = fobsFinal;
        form.appendChild(fobsInput);

        // Envia normalmente para o action do form
        form.submit();
      });
      submitButton.style.display = "none";
    }
  })();
})();
