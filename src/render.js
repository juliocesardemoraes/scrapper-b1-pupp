const playwright = require("playwright");
const { firefox } = require("playwright-core");

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
let arrayOfHtmlItems = [];
let isInsideRoom = false;

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
  if (page) {
    page = null;
    return;
  }

  const browser = await firefox.launch({
    headless: true,
    devtools: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    viewport: {
      width: 1920,
      height: 1080,
    },
  });

  page = await context.newPage();
  await page.goto("https://www.b1.bet/#/", { waitUntil: "domcontentloaded" });
  console.log(await page.content());

  const progressBar = document.getElementById("animate-value");
  progressBar.animate(
    [
      {
        width: "0px",
      },
      {
        width: "20px",
      },
    ],
    {
      duration: 500,
    }
  );

  setTimeout(() => {
    progressBar.style.width = "20px";
  }, 450);

  // Select the button and perform actions
  const buttonSelector =
    'a.p-ripple.p-element.btn.btn-primary.ng-tns-c85-1:has-text("Login")';

  // Capture a screenshot for debugging
  await page.screenshot({ path: "error_screenshot.png" });
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
let roomList = document.getElementById("room-list");
const checkRoomsBtn = document.getElementById("checkRooms");

const closeRoom = async () => {
  await page.click("svg.close-button__icon");
};

checkRoomsBtn.onclick = async () => {
  // Print out the outer HTML of each element
  if (isInsideRoom === true) {
    closeRoom();
    isInsideRoom = false;
  }

  const elements = await page.$$("div.tables-grid__item--Jt0at");

  let itemsIndex = 0;

  // table--Ohpzf lobby-table-hover-4Gdj

  roomList.innerHTML = "";
  arrayOfHtmlItems = [];

  for (const element of elements) {
    const outerHTML = await element.evaluate((el) => el.outerHTML);
    // Extract the child element with the data attribute 'data-automation-locator="lobby-table-name"'
    const nameElement = await element.$(
      'div[data-automation-locator="lobby-table-name"]'
    );
    let nameText = "";
    if (nameElement) {
      nameText = await nameElement.textContent();
      console.log("Lobby Table Name:", nameText.trim());
    } else {
      console.log('No child element with class "lobby-table-name" found.');
    }

    const tableElement = await element.$(
      "div.table--Ohpzf.lobby-table-hover-4Gdj"
    );

    if (tableElement) {
      const tableOuterHTML = await tableElement.evaluate((el) => el.outerHTML);
      console.log("Table Element:", tableOuterHTML);
    } else {
      console.log(
        'No child element with classes "table--Ohpzf lobby-table-hover-4Gdj" found.'
      );
    }

    arrayOfHtmlItems.push({ name: nameText, elementSelector: tableElement });
    roomList.innerHTML += addRoom(nameText, itemsIndex, tableElement);
    itemsIndex++;
  }
};

const enterRoom = async (elementIndex) => {
  isInsideRoom = true;
  const tableElement = arrayOfHtmlItems[elementIndex].elementSelector;
  await tableElement.click();
  roomList.innerHTML =
    "Sala selecionada, se deseja trocar clique no botão buscar salas";
};

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

const addRoom = (roomText, itemsIndex, tableElement) => {
  return `<div id='card-${roomText}' class="card mt-4" onclick='enterRoom("${itemsIndex}")'>
                <header class="card-header">
                  <p class="card-header-title">Sala</p>
                </header>
                <div class="card-content">
                  <div class="content">
                    ${roomText}
                  </div>
                </div>
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
