(function () {
  const EXPECTED_PARENT_ORIGIN = "http://localhost:3000";
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
    const resp = await fetchData(msg.email);
    window.addEventListener("message", (e) => {
      if (e.origin !== EXPECTED_PARENT_ORIGIN) return;
      const msg = e.data || {};
      if (msg.type !== "SET_EMAIL" || typeof msg.email !== "string") return;
      console.log(resp, "asdfoi2");
      e.source?.postMessage({ type: "SET_EMAIL_ACK", resp: resp }, e.origin);
    });
  }
  initBridge();

  console.log(window.location.origin);
  const asdf = document.getElementById("formdoc");
  document.cookie =
    "PHPSESSID=509861694ab26b846caed0335d9dfef1; path=/; domain=app6.meeventos.com.br; samesite=None; Partitioned; secure";
  const btn = document.createElement("div");

  btn.innerText = "asdf";
  btn.onclick = () => {
    console.log(document.cookie);
    async function fetchData() {
      window.parent.postMessage(
        { type: "SET_EMAIL_ACK", data: "taltal" },
        "http://localhost:3000"
      );
    }
    fetchData();
  };

  asdf.appendChild(btn);
})();
