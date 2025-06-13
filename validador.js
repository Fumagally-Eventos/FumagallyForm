(function () {
  // document.getElementById("prrprrpatapim").remove();
  alert("foi2");
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

  // Funções de validação globais
  function isValidPhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length === 11;
  }

  function isValidEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  // Função global para validação
  function validateSection(section) {
    const inputs = section.querySelectorAll("input, select, textarea");
    let isValid = true;
    let allFieldsValid = true;
    let requiredFieldsCount = 0;
    let validRequiredFieldsCount = 0;
    const processedGroups = new Set();

    const sectionId = section.id || "Seção sem ID";
    const sectionNumber =
      Array.from(document.querySelectorAll(".form-section")).indexOf(section) +
      1;

    console.log(`\n=== VALIDAÇÃO DA SEÇÃO ${sectionNumber} (${sectionId}) ===`);
    console.log(`Iniciando validação em: ${new Date().toLocaleTimeString()}`);

    const validationData = {
      resumo: {
        Seção: sectionNumber,
        "ID da Seção": sectionId,
        "Campos Obrigatórios": 0,
        "Campos Válidos": 0,
        "Seção Válida": "Não",
      },
      campos: [],
    };

    for (const input of inputs) {
      if (input.type === "hidden" || !input.offsetParent) continue;

      // Data/hora - apenas incrementa o requiredFieldsCount corretamente
      if (["fhora", "fhorafim", "fdatafim", "fdata"].includes(input.name)) {
        requiredFieldsCount++;
        const altInput = input.nextElementSibling;
        const value =
          input.value.trim() || (altInput && altInput.value.trim()) || "vazio";
        const isTouched =
          input.dataset.touched === "true" ||
          (altInput && altInput.dataset.touched === "true");
        const isFieldValid = value !== "vazio";

        validationData.campos.push({
          tipo: "Data/Hora",
          nome: input.name,
          valor: value,
          status: isTouched ? "tocado" : "não tocado",
          valido: isFieldValid ? "sim" : "não",
          altInput: altInput ? "sim" : "não",
          altValue: altInput ? altInput.value : "não existe",
        });

        if (isTouched && isFieldValid) {
          validRequiredFieldsCount++;
          console.log(`[Seção ${sectionNumber}] Campo ${input.name} válido`);
        }

        continue;
      }

      // Campos de radio
      if (input.type === "radio" && input.required) {
        const groupName = input.name;
        if (processedGroups.has(groupName)) continue;

        const groupInputs = section.querySelectorAll(
          `input[name="${groupName}"]`
        );
        if (groupInputs.length > 0) {
          requiredFieldsCount++;
          processedGroups.add(groupName);

          const algumSelecionado = Array.from(groupInputs).some(
            (input) => input.checked
          );
          if (algumSelecionado) validRequiredFieldsCount++;

          validationData.campos.push({
            tipo: "Radio",
            grupo: groupName,
            opcoes: groupInputs.length,
            selecionado: algumSelecionado ? "sim" : "não",
            status: Array.from(groupInputs).some(
              (input) => input.dataset.touched === "true"
            )
              ? "tocado"
              : "não tocado",
            valido: algumSelecionado ? "sim" : "não",
          });

          if (!algumSelecionado) {
            isValid = false;
            allFieldsValid = false;
          }
        }
        continue;
      }

      // Campos de quantidade relacionados a checkbox
      if (
        input.id &&
        (input.id.includes("qtd1.5inpt") || input.id.includes("qtd2x2inpt"))
      ) {
        const relatedCheckbox = document.getElementById(
          input.id.replace("inpt", "check")
        );
        if (relatedCheckbox && relatedCheckbox.checked) {
          requiredFieldsCount++;

          const isQtyValid = input.value.trim();
          if (isQtyValid) validRequiredFieldsCount++;

          validationData.campos.push({
            tipo: "Quantidade",
            id: input.id,
            valor: input.value.trim() || "vazio",
            status: input.dataset.touched === "true" ? "tocado" : "não tocado",
            checkbox: relatedCheckbox.checked ? "marcado" : "desmarcado",
            valido: isQtyValid ? "sim" : "não",
          });

          if (!isQtyValid) {
            isValid = false;
            allFieldsValid = false;
          }
        }
        continue;
      }

      // Outros campos obrigatórios
      if (input.required) {
        requiredFieldsCount++;

        const value = input.value.trim();
        let isCampoValido = !!value;

        // Validação específica de email e celular
        if (input.name === "fcelular" && value && !isValidPhone(value)) {
          isCampoValido = false;
        }
        if (input.type === "email" && value && !isValidEmail(value)) {
          isCampoValido = false;
        }

        validationData.campos.push({
          tipo: "Outro",
          nome: input.name,
          tipoCampo: input.type,
          valor: value || "vazio",
          status: input.dataset.touched === "true" ? "tocado" : "não tocado",
          valido: isCampoValido ? "sim" : "não",
        });

        if (isCampoValido) {
          validRequiredFieldsCount++;
        } else {
          isValid = false;
          allFieldsValid = false;
        }
      }
    }

    // Resumo
    allFieldsValid =
      requiredFieldsCount > 0 &&
      validRequiredFieldsCount === requiredFieldsCount;

    validationData.resumo["Campos Obrigatórios"] = requiredFieldsCount;
    validationData.resumo["Campos Válidos"] = validRequiredFieldsCount;
    validationData.resumo["Seção Válida"] = allFieldsValid ? "Sim" : "Não";

    console.log("\n=== RESUMO DA VALIDAÇÃO ===");
    console.table(validationData.resumo);
    console.log("\n=== DETALHES DOS CAMPOS ===");
    console.table(validationData.campos);

    return { isValid, allFieldsValid };
  }

  function createMultidataFields() {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `
      <label id="fdatalabel"><div>Data do Evento* 
        <span class="tooltip-icon" data-tooltip="Escolha uma ou mais datas para o evento (não inclua as datas de montagem/desmontagem caso estas sejam no dia posterior/anterior)">?</span></div>
        <span class="filled">&#10004;</span><span class="unfilled">&#10071;</span>
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

    function markDateFieldsAsTouched() {
      const dateInputs = [
        document.getElementsByName("fdata")[0],
        document.getElementsByName("fdatafim")[0],
        document.getElementsByName("fhora")[0],
        document.getElementsByName("fhorafim")[0],
      ];
      dateInputs.forEach((input) => {
        if (input) {
          input.dataset.touched = "true";
          const altInput = input.nextElementSibling;
          if (altInput) {
            altInput.dataset.touched = "true";
          }
          console.log(`Campo ${input.name} marcado como tocado`);
        }
      });

      const sections = document.querySelectorAll(".form-section");
      const currentSection = Array.from(sections).find(
        (section) =>
          section.querySelector('input[name="fdata"]') ||
          section.querySelector('input[name="fdatafim"]') ||
          section.querySelector('input[name="fhora"]') ||
          section.querySelector('input[name="fhorafim"]')
      );

      if (currentSection) {
        const { isValid, allFieldsValid } = validateSection(currentSection);
        console.log("Validação após mudança de data/hora:", {
          isValid,
          allFieldsValid,
          sectionId: currentSection.id,
          sectionNumber: Array.from(sections).indexOf(currentSection) + 1,
        });
      }
    }

    function updateDateValidationIcons() {
      const dateLabel = document.getElementById("fdatalabel");
      if (!dateLabel) return;

      const dateFilledIcon = dateLabel.querySelector(".filled");
      const dateUnfilledIcon = dateLabel.querySelector(".unfilled");
      if (!dateFilledIcon || !dateUnfilledIcon) return;

      const dateInputs = [
        document.getElementsByName("fdata")[0],
        document.getElementsByName("fdatafim")[0],
        document.getElementsByName("fhora")[0],
        document.getElementsByName("fhorafim")[0],
      ];

      const anyTouched = dateInputs.some(
        (input) =>
          input?.dataset.touched === "true" ||
          (input?.nextElementSibling &&
            input.nextElementSibling.dataset.touched === "true")
      );
      const allFilled = dateInputs.every((input) => {
        if (!input) return false;
        const altInput = input.nextElementSibling;
        return input.value.trim() || (altInput && altInput.value.trim());
      });

      if (!anyTouched) {
        dateFilledIcon.style.display = "none";
        dateUnfilledIcon.style.display = "none";
      } else if (!allFilled) {
        dateFilledIcon.style.display = "none";
        dateUnfilledIcon.style.display = "block";
      } else {
        dateFilledIcon.style.display = "block";
        dateUnfilledIcon.style.display = "none";
      }
    }

    flatpickr("#dateStart", {
      altInput: true,
      altFormat: "d/m/Y",
      dateFormat: "Y-m-d",
      locale: "pt",
      disableMobile: true,
      minDate: "today",
      plugins: [new rangePlugin({ input: "#dateEnd" })],
      onChange: function (selectedDates, dateStr, instance) {
        console.log("Data inicial alterada:", dateStr);
        markDateFieldsAsTouched();
        updateDateValidationIcons();

        // patch: também marca o dateEnd como tocado
        const dateEndInput = document.getElementsByName("fdatafim")[0];
        if (dateEndInput) {
          dateEndInput.dataset.touched = "true";
          const altInputEnd = dateEndInput.nextElementSibling;
          if (altInputEnd) {
            altInputEnd.dataset.touched = "true";
          }
        }
      },
      onClose: function (selectedDates, dateStr, instance) {
        console.log("Data inicial fechada:", dateStr);
        markDateFieldsAsTouched();
        updateDateValidationIcons();
      },
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
        onChange: function (selectedDates, dateStr, instance) {
          console.log(`Hora ${selector} alterada:`, dateStr);
          markDateFieldsAsTouched();
          updateDateValidationIcons();
        },
        onClose: function (selectedDates, dateStr, instance) {
          console.log(`Hora ${selector} fechada:`, dateStr);
          markDateFieldsAsTouched();
          updateDateValidationIcons();
        },
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
      barumemei.value = "";
    }
    updateCheckboxValidationIcons("qtd1.5check");
    const section = document.querySelector(".form-section");
    if (section) {
      validateSection(section);
    }
  });
  checkdoispordois.addEventListener("change", () => {
    if (checkdoispordois.checked) {
      bardoispordois.disabled = false;
      bardoispordois.required = true;
    } else {
      bardoispordois.disabled = true;
      bardoispordois.required = false;
      bardoispordois.value = "";
    }
    updateCheckboxValidationIcons("qtd2x2check");
    const section = document.querySelector(".form-section");
    if (section) {
      validateSection(section);
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
      // Se a seção já está visível, não anima novamente
      if (section.style.display === "block") {
        console.log("Seção já está visível, pulando animação");
        return;
      }

      section.style.display = "block";
      section.classList.add("slide-fade-in");

      // Remove a classe de animação após o fim
      section.addEventListener(
        "animationend",
        () => {
          section.classList.remove("slide-fade-in");
          console.log("Animação da seção concluída");
        },
        { once: true }
      );

      section.scrollIntoView({ behavior: "smooth", block: "start" });
      animateFields(section);
    }

    function setupListeners(section, index) {
      const inputs = section.querySelectorAll("input, select, textarea");
      const nextSection = sections[index + 1];
      let validationTimeout;
      let isAnimating = false;
      let lastValidationResult = false;

      function markFieldAsTouched(input) {
        input.dataset.touched = "true";

        // Para campos de data/hora, marca todos os campos relacionados
        if (
          input.name === "fhora" ||
          input.name === "fhorafim" ||
          input.name === "fdatafim" ||
          input.name === "fdata"
        ) {
          const dateInputs = [
            document.getElementsByName("fdata")[0],
            document.getElementsByName("fdatafim")[0],
            document.getElementsByName("fhora")[0],
            document.getElementsByName("fhorafim")[0],
          ];
          dateInputs.forEach((dateInput) => {
            if (dateInput) dateInput.dataset.touched = "true";
          });
        }

        // Para radio buttons, marca todo o grupo como tocado
        if (input.type === "radio") {
          const groupName = input.name;
          const groupInputs = section.querySelectorAll(
            `input[name="${groupName}"]`
          );
          groupInputs.forEach((groupInput) => {
            groupInput.dataset.touched = "true";
            console.log(`Marcando radio button ${groupInput.id} como tocado`);
          });

          // Força uma validação imediata do grupo
          const label = document.getElementById(groupName + "label");
          if (label) {
            const filledIcon = label.querySelector(".filled");
            const unfilledIcon = label.querySelector(".unfilled");
            if (filledIcon && unfilledIcon) {
              const peloMenosUmMarcado = Array.from(groupInputs).some(
                (input) => input.checked
              );
              if (peloMenosUmMarcado) {
                filledIcon.style.display = "block";
                unfilledIcon.style.display = "none";
                console.log(`Grupo ${groupName} marcado como válido`);
              } else {
                filledIcon.style.display = "none";
                unfilledIcon.style.display = "block";
                console.log(`Grupo ${groupName} marcado como inválido`);
              }
            }
          }
        }

        // Para checkboxes que controlam inputs
        if (input.type === "checkbox" && input.id.includes("check")) {
          const relatedInput = document.getElementById(
            input.id.replace("check", "inpt")
          );
          if (relatedInput) {
            relatedInput.dataset.touched = "true";
          }
        }

        // Força uma validação imediata
        checkAndAdvance();
      }

      function checkAndAdvance() {
        if (isAnimating) {
          console.log("Animação em andamento, pulando validação");
          return;
        }

        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(() => {
          const { isValid, allFieldsValid } = validateSection(section);

          if (allFieldsValid && !lastValidationResult) {
            if (nextSection) {
              console.log("Iniciando animação da próxima seção");
              isAnimating = true;
              lastValidationResult = true;
              animateSection(nextSection);

              nextSection.addEventListener(
                "animationend",
                () => {
                  console.log("Animação concluída, resetando flags");
                  isAnimating = false;
                },
                { once: true }
              );
            }
            if (index === 1) {
              const submitButton = document.getElementsByClassName("btn")[0];
              if (submitButton) {
                submitButton.style.display = "block";
              }
            }
          } else if (!allFieldsValid) {
            lastValidationResult = false;
            if (index === 1) {
              const submitButton = document.getElementsByClassName("btn")[0];
              if (submitButton) {
                submitButton.style.display = "none";
              }
            }
          }
        }, 500);
      }

      inputs.forEach((input) => {
        // Marca o campo como tocado quando recebe foco
        input.addEventListener("focus", () => {
          markFieldAsTouched(input);
        });

        // Para radio buttons, adiciona evento de change
        if (input.type === "radio") {
          input.addEventListener("change", () => {
            console.log(`Radio button ${input.id} alterado`);
            markFieldAsTouched(input);
          });
        }

        // Validação em tempo real com debounce
        input.addEventListener("input", checkAndAdvance);
        input.addEventListener("blur", () => {
          markFieldAsTouched(input);
          checkAndAdvance();
        });
        input.addEventListener("change", () => {
          markFieldAsTouched(input);
          checkAndAdvance();
        });
        input.addEventListener("paste", () => {
          markFieldAsTouched(input);
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

        fobsParts.push(fobs2, fobs3);
        if (fobs4.length > 0) fobsParts.push(fobs4.join(" "));
        fobsParts.push(fobs5, fobs6, fobs7);

        const fobsFinal = fobsParts.filter(Boolean).join("||");

        // Remove campos antigos de fobs
        [
          "fobs",
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

  // Função para atualizar ícones de validação do checkbox
  function updateCheckboxValidationIcons(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    const quantityInput = document.getElementById(
      checkboxId.replace("check", "inpt")
    );
    const label = document.getElementById(checkboxId + "label");

    if (!label) return;

    const filledIcon = label.querySelector(".filled");
    const unfilledIcon = label.querySelector(".unfilled");
    if (!filledIcon || !unfilledIcon) return;

    if (!checkbox.checked) {
      filledIcon.style.display = "none";
      unfilledIcon.style.display = "none";
      return;
    }

    if (!quantityInput.dataset.touched && !quantityInput.value.trim()) {
      filledIcon.style.display = "none";
      unfilledIcon.style.display = "none";
    } else if (quantityInput.dataset.touched && !quantityInput.value.trim()) {
      filledIcon.style.display = "none";
      unfilledIcon.style.display = "block";
    } else if (quantityInput.value.trim()) {
      filledIcon.style.display = "block";
      unfilledIcon.style.display = "none";
    }
  }
})();
