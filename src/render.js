const playwright = require("playwright");
const name = document.getElementById("name");
const pass = document.getElementById("pass");
const passBtn = document.getElementById("passBtn");
const addMessageBtn = document.getElementById("addMessage");
const sendChatMessagesBtn = document.getElementById("sendChatMessages");
const modalCloseBtn = document.getElementById("modal-close-btn");
let page = null;
const arrayOfMessages = new Set([]);
let editValue = "";
let intervalBlas = null;
const TIME_FOR_EACH_MESSAGE = 35;
let messageLoop = false;

const chatSelector = ".chat-input.chat-input-layout";
const buttonSendChatMessage = "svg.chat-controls-button__icon--DVtUL";

const startBtn = document.getElementById("startBtn");

function getRandomValue(max) {
  return Math.floor(Math.random() * max);
}

const sendMessageFunctionality = async (message) => {
  if (message === "") {
    return;
  }
  await page.waitForSelector(chatSelector);
  await page.type(chatSelector, message);
  await page.waitForSelector(buttonSendChatMessage);
  await page.click(buttonSendChatMessage);
};

const getRandomMessage = () => {
  const indexItem = getRandomValue(arrayOfMessages.size - 1);
  let counter = 0;
  let message = "";

  arrayOfMessages.forEach((item) => {
    if (counter === indexItem) {
      message = item;
    }
    counter++;
  });

  return message;
};

async function startSendingMessages() {
  messageLoop = !messageLoop;

  if (messageLoop) {
    sendChatMessagesBtn.innerText =
      "Estamos enviando mensagens automáticas no momento";
  } else if (messageLoop === false) {
    sendChatMessagesBtn.innerText =
      "Não estamos enviando mensagens automáticas no momento";
  }

  while (messageLoop) {
    let message = getRandomMessage();
    await sendMessageFunctionality(message);
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * TIME_FOR_EACH_MESSAGE)
    );
  }
}

const sendMessagesTimer = async () => {
  if (!page) return;

  if ((await page.isVisible(chatSelector, { timeout: 100 })) === false) {
    alert("Entre em uma sala!");
  }

  if (arrayOfMessages.size === 0) return;

  startSendingMessages();
  message = "";
};

sendChatMessagesBtn.onclick = async (e) => {
  await sendMessagesTimer();
};

startBtn.onclick = async (e) => {
  const url = "https://www.b1.bet/#/";
  const browserContext = await playwright.chromium.launchPersistentContext("", {
    headless: false,
    args: [`--app=${url}`, "--window-size=1920,1080"],
  });

  [page] = browserContext.pages();
  // Wait for the page to be ready
  await page.waitForLoadState("domcontentloaded");

  // Select the button and perform actions
  const buttonSelector =
    'a.p-ripple.p-element.btn.btn-primary.ng-tns-c85-1:has-text("Login")';
  await page.waitForSelector(buttonSelector, { timeout: 15000 });
  await page.click(buttonSelector);

  // Print the page title
  console.log(await page.title());
  // Selectors
  const inputUser = 'input[type="text"]';
  const inputPassword = 'input[type="password"]';

  // Selectors values
  const name = "SpaceAquelino";
  const pass = "@Aquelino88653361";
  const ROULETTE_URL =
    "https://www.b1.bet/#/game/casinolive?st=&stTp=1&p=480&t=1&g=SWS-playtech:RoletaBrasileria&lp=480";

  await page.waitForSelector(inputUser);
  await page.fill(inputUser, name);

  await page.waitForSelector(inputPassword);
  await page.fill(inputPassword, pass);

  await page.press(inputPassword, "Enter");
  // await page.click("submit-button-selector"); // Replace with the actual submit button selector

  const responsePromise = page.waitForResponse(
    (resp) =>
      resp.url().includes("/api/Login_Authenticate") && resp.status() === 200
  );
  await responsePromise;

  await page.goto("https://www.b1.bet/#/game/casinolive", {
    waitUntil: "networkidle",
  });
  await page.goto(`${ROULETTE_URL}`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(12000);

  const iframeHandle = await page.$("#SOSWScriptWdget > iframe");
  const src = await iframeHandle.getAttribute("src");
  await page.goto(src);

  // Convert the XPath to a CSS selector
  const closeButtonSelector = "div.close-button.header__close-button";

  // Click the button using the CSS selector
  await page.waitForSelector(closeButtonSelector);
  await page.click(closeButtonSelector);

  const rouletteSelector =
    "div.game-category__title--tgCXt:has-text('Roulette')";
  // Click the button using the CSS selector
  //const svgButtonSelector = "svg.close-button__icon";
  // await page.click(svgButtonSelector);

  // .chat-input-container

  await page.waitForSelector(rouletteSelector);
  await page.click(rouletteSelector);
  sendChatMessagesBtn.removeAttribute("disabled");
};

// passBtn.onclick = async (e) => {
//   if (page === null) return "nulo";

//   const inputName = name.value;
//   console.log(inputName);
//   const inputUser = 'input[type="text"]';
//   await page.waitForSelector(inputUser);
//   await page.fill(inputUser, inputName);
// };

//------PAGE HTML CONFIG------
addMessageBtn.onclick = async (e) => {
  const addMessageBtn = document.getElementById("message-modal");
  addMessageBtn.classList.add("is-active");
};

modalCloseBtn.onclick = () => {
  const addMessageBtn = document.getElementById("message-modal");
  addMessageBtn.classList.remove("is-active");
};

const form = document.getElementById("create-message-form");
const editForm = document.getElementById("edit-message-form");
const messageList = document.getElementById("message-list");

const addMessage = (value) => {
  console.log("value", value);
  return `<div id='card-${value}' class="card mt-4">
          <header class="card-header">
            <p class="card-header-title">Mensagem</p>
          </header>
          <div class="card-content">
            <div class="content">
              ${value}
            </div>
          </div>
          <footer class="card-footer">
            <button href="#" class="card-footer-item" onclick='editar("${value}")'>Editar</a>
            <button href="#" class="card-footer-item" onclick='deletar("${value}")'>Deletar</a>
          </footer>
        </div>`;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const payload = new FormData(form);
  const addMessageBtn = document.getElementById("message-modal");

  if (editValue != "") {
    //Editar
    console.log("Editar");

    for (item of payload) {
      if (arrayOfMessages.has(editValue)) {
        // Update set
        arrayOfMessages.delete(editValue);
        arrayOfMessages.add(item[1]);
        // Remove card
        const idCardToRemove = document.getElementById(`card-${editValue}`);
        idCardToRemove.remove();
        // Update html
        messageList.innerHTML += addMessage(item[1]);
        editValue = "";
      }
    }
  } else {
    // Adicionar
    for (item of payload) {
      if (arrayOfMessages.has(item[1])) break;
      arrayOfMessages.add(item[1]);
      messageList.innerHTML += addMessage(item[1]);
    }
  }

  addMessageBtn.classList.remove("is-active");
});

const editar = (valor) => {
  //const getItem = document.getElementById(`card-${valor}`);
  editValue = valor;
  const addMessageBtn = document.getElementById("message-modal");
  addMessageBtn.classList.add("is-active");

  // if (arrayOfMessages.has(valor)) {
  //   arrayOfMessages.delete("hello");
  //   arrayOfMessages.add("hello world");
  // }
};

const deletar = (valor) => {
  arrayOfMessages.delete(valor);
  const idCardToRemove = document.getElementById(`card-${valor}`);
  idCardToRemove.remove();
};

//------PAGE HTML CONFIG------
