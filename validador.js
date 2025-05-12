document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact_form");

  const startDate = form.querySelector("input[name='fdata']");
  const startTime = form.querySelector("input[name='fhora']");
  const endDate = form.querySelector("input[name='fdatafim']");
  const endTime = form.querySelector("input[name='fhorafim']");

  const qtd2x2 = form.querySelector("input[name='qtd2x2']");
  const item2x2 = form.querySelector("input[name='item1']");

  const qtd1_5 = form.querySelector("input[name='qtd1.5']");
  const item1_5 = form.querySelector("input[name='item2']");

  console.log(startDate, startTime, endDate);

  function parseDateTime(dateInput, timeInput) {
    if (!dateInput.value || !timeInput.value) return null;
    return new Date(`${dateInput.value}T${timeInput.value}`);
  }

  function showError(input, message) {
    let container = input.closest(".form-group") || input.parentElement;
    let error = container.querySelector(".error-message");
    if (!error) {
      error = document.createElement("div");
      error.className = "error-message";
      error.style.color = "red";
      error.style.fontSize = "0.9em";
      error.style.marginTop = "4px";
      container.appendChild(error);
    }
    error.textContent = message;
    input.classList.add("input-error");
  }

  function clearError(input) {
    let container = input.closest(".form-group") || input.parentElement;
    let error = container.querySelector(".error-message");
    if (error) error.remove();
    input.classList.remove("input-error");
  }

  function isPast(datetime) {
    return datetime < new Date();
  }

  function validateStartDateTime() {
    const start = parseDateTime(startDate, startTime);
    if (!start) return;

    if (isPast(start)) {
      showError(startDate, "Data/Hora de início não pode estar no passado.");
    } else {
      clearError(startDate);
    }

    validateEndDateTime(); // revalida fim caso usuário esteja corrigindo início
  }

  function validateEndDateTime() {
    const start = parseDateTime(startDate, startTime);
    const end = parseDateTime(endDate, endTime);
    if (!start || !end) return;

    if (end <= start) {
      showError(endDate, "Término deve ser depois do início.");
    } else {
      clearError(endDate);
    }
  }

  function handleBarracaCheckboxes() {
    qtd2x2.disabled = !item2x2.checked;
    qtd2x2.required = item2x2.checked;
    if (!item2x2.checked) {
      qtd2x2.value = "";
      clearError(qtd2x2);
    }

    qtd1_5.disabled = !item1_5.checked;
    qtd1_5.required = item1_5.checked;
    if (!item1_5.checked) {
      qtd1_5.value = "";
      clearError(qtd1_5);
    }
  }

  function validateQuantityInput(input, checkbox) {
    if (!checkbox.checked) return;
    if (!input.value || isNaN(input.value) || parseInt(input.value) <= 0) {
      showError(input, "Informe uma quantidade válida.");
    } else {
      clearError(input);
    }
  }

  // Eventos de validação dinâmica
  startDate.addEventListener("change", validateStartDateTime);
  startTime.addEventListener("input", validateStartDateTime);

  endDate.addEventListener("change", validateEndDateTime);
  endTime.addEventListener("input", validateEndDateTime);

  item2x2.addEventListener("change", () => {
    handleBarracaCheckboxes();
    validateQuantityInput(qtd2x2, item2x2);
  });
  qtd2x2.addEventListener("input", () =>
    validateQuantityInput(qtd2x2, item2x2)
  );

  item1_5.addEventListener("change", () => {
    handleBarracaCheckboxes();
    validateQuantityInput(qtd1_5, item1_5);
  });
  qtd1_5.addEventListener("input", () =>
    validateQuantityInput(qtd1_5, item1_5)
  );

  handleBarracaCheckboxes();

  form.addEventListener("submit", function (e) {
    validateStartDateTime();
    validateEndDateTime();
    validateQuantityInput(qtd2x2, item2x2);
    validateQuantityInput(qtd1_5, item1_5);

    // Evita envio se ainda houver erros visíveis
    if (form.querySelector(".error-message")) {
      e.preventDefault();
    }
  });
});
