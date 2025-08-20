(function () {
  alert("foi", window.location.origin);
  console.log(window.location.origin);
  const asdf = document.getElementById("formdoc");

  const btn = document.createElement("div");

  btn.innerText = "asdf";
  btn.onclick = () => {
    console.log(window.location.origin);
  };

  asdf.appendChild(btn);
})();
