(function () {
  alert("foi", window.location.origin);
  console.log(window.location.origin);
  const asdf = document.getElementById("formdoc");
  document.cookie = "";
  document.cookie =
    "user_language=pt_BR; PHPSESSID=509861694ab26b846caed0335d9dfef1;";
  const btn = document.createElement("div");

  btn.innerText = "asdf";
  btn.onclick = () => {
    console.log(document.cookie);
  };

  asdf.appendChild(btn);
})();
