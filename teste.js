(function () {
  let receivedEmail = null; // Variável para armazenar o email recebido

  async function fetchData(email) {
    return fetch(
      "https://app6.meeventos.com.br/fumagallyeventos/index.php?p=visualizar&pagina=consultacadastrocliente",
      {
        credentials: "include",
        headers: {
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Priority: "u=0",
        },
        referrer:
          "https://app6.meeventos.com.br/fumagallyeventos/index.php?p=orcamento&acao=novo",
        body: `email=${email}`,
        method: "POST",
        mode: "cors",
      }
    );
  }

  async function initBridge() {
    window.addEventListener("message", (e) => {
      if (e.origin !== "http://localhost:3000") return;
      const msg = e.data || {};
      if (msg.type !== "SET_EMAIL" || typeof msg.email !== "string") return;

      // Armazena o email recebido
      receivedEmail = msg.email;
      console.log("Email recebido:", receivedEmail);
    });
  }
  initBridge();

  console.log(window.location.origin);
  const asdf = document.getElementById("formdoc");
  document.cookie =
    "PHPSESSID=509861694ab26b846caed0335d9dfef1; path=/; domain=app6.meeventos.com.br; samesite=None; Partitioned; secure";
  const btn = document.createElement("div");

  btn.innerText = "asdf";
  btn.onclick = async () => {
    if (!receivedEmail) {
      console.log("Nenhum email recebido ainda");
      return;
    }

    try {
      const response = await fetchData(receivedEmail);
      const responseData = await response.text(); // ou response.json() se for JSON

      window.parent.postMessage(
        { type: "SET_EMAIL_ACK", data: responseData },
        "http://localhost:3000"
      );
    } catch (error) {
      console.error("Erro na requisição:", error);
      window.parent.postMessage(
        { type: "SET_EMAIL_ACK", data: "Erro na requisição" },
        "http://localhost:3000"
      );
    }
  };

  asdf.appendChild(btn);
})();
