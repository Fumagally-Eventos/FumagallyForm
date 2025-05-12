document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact_form");
  const submitButton = form.querySelector("button[type='submit']");

  const startDate = form.querySelector("input[name='fdata']");
  const startTime = form.querySelector("input[name='fhora']");
  const endDate = form.querySelector("input[name='fdatafim']");
  const endTime = form.querySelector("input[name='fhorafim']");

  const email = form.querySelector("input[name='femail']");
  const phone = form.querySelector("input[name='fcelular']");

  const qtd2x2 = form.querySelector("input[name='qtd2x2']");
  const item2x2 = form.querySelector("input[name='item1']");

  const qtd1_5 = form.querySelector("input[name='qtd1.5']");
  const item1_5 = form.querySelector("input[name='item2']");

  const allRequired = form.querySelectorAll("[required]");

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

  function formatDateBR(input) {
    input.addEventListener("input", () => {
      let val = input.value.replace(/\D/g, "").slice(0, 8);
      if (val.length >= 5)
        input.value = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
      else if (val.length >= 3)
        input.value = `${val.slice(0, 2)}/${val.slice(2)}`;
      else input.value = val;
    });
  }

  function formatTime24h(input) {
    input.addEventListener("input", () => {
      let val = input.value.replace(/\D/g, "").slice(0, 4);
      if (val.length >= 3) input.value = `${val.slice(0, 2)}:${val.slice(2)}`;
      else input.value = val;
    });
  }

  function parseDateTimeBR(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}T${timeStr}`);
  }

  function isPast(datetime) {
    return datetime < new Date();
  }

  function validateStartDateTime() {
    const start = parseDateTimeBR(startDate.value, startTime.value);
    if (!start || isNaN(start)) return;

    if (isPast(start)) {
      showError(startDate, "Data/Hora de início não pode estar no passado.");
    } else {
      clearError(startDate);
    }

    validateEndDateTime();
    updateSubmitState();
  }

  function validateEndDateTime() {
    const start = parseDateTimeBR(startDate.value, startTime.value);
    const end = parseDateTimeBR(endDate.value, endTime.value);
    if (!start || !end || isNaN(start) || isNaN(end)) return;

    if (end <= start) {
      showError(endDate, "Término deve ser após o início.");
    } else {
      clearError(endDate);
    }
    updateSubmitState();
  }

  function validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.value)) {
      showError(email, "E-mail inválido.");
    } else {
      clearError(email);
    }
    updateSubmitState();
  }

  function validatePhone() {
    const cleaned = phone.value.replace(/\D/g, "");
    if (cleaned.length < 10 || cleaned.length > 15) {
      showError(phone, "Telefone inválido.");
    } else {
      clearError(phone);
    }
    updateSubmitState();
  }

  function validateCheckboxes() {
    const anyChecked = item2x2.checked || item1_5.checked;
    if (!anyChecked) {
      showError(item2x2, "Selecione ao menos um item.");
    } else {
      clearError(item2x2);
    }
    updateSubmitState();
  }

  function validateQuantityInput(input, checkbox) {
    if (checkbox.checked) {
      if (!input.value || isNaN(input.value) || parseInt(input.value) <= 0) {
        showError(input, "Informe uma quantidade válida.");
      } else {
        clearError(input);
      }
    } else {
      clearError(input);
    }
    updateSubmitState();
  }

  function handleBarracaCheckboxes() {
    qtd2x2.disabled = !item2x2.checked;
    qtd2x2.required = item2x2.checked;
    qtd1_5.disabled = !item1_5.checked;
    qtd1_5.required = item1_5.checked;
    validateCheckboxes();
  }

  function updateSubmitState() {
    const hasError = form.querySelector(".input-error") || !isFormValid();
    submitButton.disabled = hasError;
    submitButton.style.opacity = hasError ? "0.5" : "1";
    submitButton.style.pointerEvents = hasError ? "none" : "auto";
  }

  function isFormValid() {
    const allFilled = Array.from(allRequired).every((el) => {
      if (el.type === "checkbox" || el.type === "radio") return true;
      return el.value.trim() !== "";
    });
    return allFilled && (item2x2.checked || item1_5.checked);
  }

  // Aplicar máscaras
  formatDateBR(startDate);
  formatDateBR(endDate);
  formatTime24h(startTime);
  formatTime24h(endTime);

  // Listeners
  startDate.addEventListener("input", validateStartDateTime);
  startTime.addEventListener("input", validateStartDateTime);
  endDate.addEventListener("input", validateEndDateTime);
  endTime.addEventListener("input", validateEndDateTime);
  email.addEventListener("input", validateEmail);
  phone.addEventListener("input", validatePhone);

  item2x2.addEventListener("change", () => {
    handleBarracaCheckboxes();
    validateQuantityInput(qtd2x2, item2x2);
  });
  item1_5.addEventListener("change", () => {
    handleBarracaCheckboxes();
    validateQuantityInput(qtd1_5, item1_5);
  });
  qtd2x2.addEventListener("input", () =>
    validateQuantityInput(qtd2x2, item2x2)
  );
  qtd1_5.addEventListener("input", () =>
    validateQuantityInput(qtd1_5, item1_5)
  );

  // Inicializa estados
  handleBarracaCheckboxes();
  updateSubmitState();

  form.addEventListener("submit", function (e) {
    validateStartDateTime();
    validateEndDateTime();
    validateEmail();
    validatePhone();
    validateQuantityInput(qtd2x2, item2x2);
    validateQuantityInput(qtd1_5, item1_5);
    validateCheckboxes();

    if (form.querySelector(".input-error")) {
      e.preventDefault();
    }
  });
});
