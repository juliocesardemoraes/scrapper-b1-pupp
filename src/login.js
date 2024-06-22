function logar(event) {
  event.preventDefault();
  const formulario = document.getElementById("login__form");

  const formData = new FormData(formulario);
  const nome = formData.get("name");
  const email = formData.get("password");
  console.log(nome);
  console.log(email);

  //  window.location.href = "scrapper.html";
}
