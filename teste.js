(function () {
  alert("foi", window.location.origin);
  console.log(window.location.origin);
  const asdf = document.getElementById("formdoc");
  document.cookie = "";
  document.cookie =
    "PHPSESSID=509861694ab26b846caed0335d9dfef1; user_language=pt_BR; path=/; domain=app6.meeventos.com.br; secure; samesite=None";
  const btn = document.createElement("div");

  btn.innerText = "asdf";
  btn.onclick = () => {
    document.cookie =
      "PHPSESSID=509861694ab26b846caed0335d9dfef1; user_language=pt_BR; path=/; domain=app6.meeventos.com.br; secure; samesite=None";
    console.log(document.cookie);
  };

  asdf.appendChild(btn);
})();
