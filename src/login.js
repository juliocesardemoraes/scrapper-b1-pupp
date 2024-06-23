const { toast } = require("bulma-toast");
const formularioLogin = document.getElementById("login__form");
const formularioCadastro = document.getElementById("signup__form");
const formularioLoginInput = document.getElementById("name__input");
const formularioPasswordInput = document.getElementById("password__input");
const URL = "http://localhost:4000";

const getData = async () => {
  const user = localStorage.getItem("user");

  if (user) {
    const userJson = JSON.parse(user);
    formularioLoginInput.value = userJson?.name;
    formularioPasswordInput.value = userJson?.password;
  }

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(`${URL}/playwrighturl`, requestOptions);
  const authUser = await response.json();
  localStorage.setItem("url", authUser.message);
};

async function logar(event) {
  event.preventDefault();

  const formData = new FormData(formularioLogin);
  const name = formData.get("name");
  const password = formData.get("password");

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(
    `${URL}/user/login?name=${name}&password=${password}`,
    requestOptions
  );
  const authUser = await response.json();

  if (response.status != 200) {
    toast({
      message: authUser.message,
      type: "is-danger",
      duration: 2000,
    });
  } else {
    toast({
      message: authUser.message,
      type: "is-success",
      duration: 2000,
    });

    localStorage.setItem(
      "user",
      JSON.stringify({ name: name, password: password })
    );

    setTimeout(() => {
      window.location.href = "scrapper.html";
    }, 2000);
  }
}
