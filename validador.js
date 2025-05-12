(function () {
  document.getElementById("prrprrpatapim").remove();
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

    function parseDateTime(dateInput, timeInput) {
      return new Date(`${dateInput.value}T${timeInput.value}`);
    }

    function showError(input, message) {
      let error = input.parentNode.querySelector(".error-message");
      if (!error) {
        error = document.createElement("div");
        error.className = "error-message";
        error.style.color = "red";
        error.style.fontSize = "0.9em";
        error.style.marginTop = "4px";
        input.parentNode.appendChild(error);
      }
      error.textContent = message;
    }

    function clearErrors() {
      form.querySelectorAll(".error-message").forEach((e) => e.remove());
    }

    function isPast(datetime) {
      return datetime < new Date();
    }

    function handleBarracaCheckboxes() {
      qtd2x2.disabled = !item2x2.checked;
      qtd2x2.required = item2x2.checked;
      if (!item2x2.checked) qtd2x2.value = "";

      qtd1_5.disabled = !item1_5.checked;
      qtd1_5.required = item1_5.checked;
      if (!item1_5.checked) qtd1_5.value = "";
    }

    item2x2.addEventListener("change", handleBarracaCheckboxes);
    item1_5.addEventListener("change", handleBarracaCheckboxes);
    handleBarracaCheckboxes(); // init

    form.addEventListener("submit", function (e) {
      clearErrors();
      let valid = true;

      const start = parseDateTime(startDate, startTime);
      const end = parseDateTime(endDate, endTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        showError(startDate, "Datas e horários inválidos.");
        valid = false;
      } else {
        if (isPast(start)) {
          showError(
            startDate,
            "Data/Hora de início não pode estar no passado."
          );
          valid = false;
        }

        if (start >= end) {
          showError(
            endDate,
            "Data/Hora de término deve ser posterior ao início."
          );
          valid = false;
        }
      }

      if (!valid) {
        e.preventDefault();
      }
    });
  });
  // Exemplo de alerta para verificar a execução
})();
