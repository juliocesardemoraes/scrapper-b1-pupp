const { firefox } = require("playwright-core");
const { toast } = require("bulma-toast");

// Playwright
let page = null;
let browser = null;

// Global variables
const arrayOfMessages = new Set([]);
let editValue = "";
const TIME_FOR_EACH_MESSAGE = 35;
let messageLoop = false;
let arrayOfHtmlItems = [];
let isInsideRoom = false;

// SELECTORS
const chatSelector = ".chat-input.chat-input-layout";
const buttonSendChatMessage = "svg.chat-controls-button__icon--DVtUL";
const progressBar = document.getElementById("animate-value");

// DOM ELEMENTS
const name = document.getElementById("name");
const pass = document.getElementById("pass");
const passBtn = document.getElementById("passBtn");
const addMessageBtn = document.getElementById("addMessage");
const sendChatMessagesBtn = document.getElementById("sendChatMessages");
const modalCloseBtn = document.getElementById("modal-close-btn");
const form = document.getElementById("create-message-form");
const messageList = document.getElementById("message-list");
let roomList = document.getElementById("room-list");
const checkRoomsBtn = document.getElementById("checkRooms");
const startBtn = document.getElementById("startBtn");
const btnContainer = document.getElementById("btnContainer");
const progressContainer = document.getElementById("progress-bar");

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
    console.log("LOOP");
    let message = getRandomMessage();
    await sendMessageFunctionality(message);
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * TIME_FOR_EACH_MESSAGE)
    );
  }
}

const sendMessagesTimer = async () => {
  if (!page) return;

  await page.waitForSelector(chatSelector, { timeout: 12000 });

  if (arrayOfMessages.size === 0) {
    toast({
      message: "Crie uma mensagem antes de enviar mensagens",
      type: "is-danger",
      duration: 2000,
    });
    return;
  }

  startSendingMessages();
  message = "";
};

sendChatMessagesBtn.onclick = async (e) => {
  await sendMessagesTimer();
};

const animateProgressBar = (minValue, maxValue) => {
  progressBar.animate(
    [
      {
        width: minValue,
      },
      {
        width: maxValue,
      },
    ],
    {
      duration: 300,
    }
  );

  setTimeout(() => {
    progressBar.style.width = maxValue;
  }, 250);
};

const shutdownPlaywright = async () => {
  if (!browser || !page) return;

  btnContainer.innerHTML = `<button id="startBtn" class="button is-primary mt-2" onclick='runScrapper()'>
        Rodar scrapper
      </button>`;

  roomList.innerHTML = "";

  await browser.close();
  animateProgressBar("200px", "0px");
  page = null;
  sendChatMessagesBtn.setAttribute("disabled", "true");
  checkRoomsBtn.setAttribute("disabled", "true");
};

const runScrapper = async (e) => {
  try {
    if (page) {
      page = null;
      return;
    }

    btnContainer.innerHTML = "";
    // Get first login button
    animateProgressBar("0px", "20px");

    toast({
      message: "O site está rodando, aguarde alguns segundos",
      type: "is-info",
      duration: 2000,
    });

    browser = await firefox.launch({
      headless: true,
      devtools: false,
      args: [
        "--no-sandbox",
        "--no-devtools",
        "--disable-setuid-sandbox",
        "--mute-audio",
      ],
      ignoreDefaultArgs: ["--mute-audio"],
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

    // Select the button and perform actions
    const buttonSelector =
      'a.p-ripple.p-element.btn.btn-primary.ng-tns-c85-1:has-text("Login")';

    // Capture a screenshot for debugging
    await page.screenshot({ path: "error_screenshot.png" });
    await page.waitForSelector(buttonSelector, { timeout: 15000 });
    await page.click(buttonSelector);

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

    // Login success
    animateProgressBar("20px", "80px");

    await page.goto("https://www.b1.bet/#/game/casinolive", {
      waitUntil: "networkidle",
    });
    await page.goto(`${ROULETTE_URL}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("#SOSWScriptWdget > iframe", { timeout: 24000 });
    animateProgressBar("80px", "100px");

    const iframeHandle = await page.$("#SOSWScriptWdget > iframe");
    const src = await iframeHandle.getAttribute("src");
    await page.goto(src);

    // Iframe link
    animateProgressBar("100px", "120px");

    // Convert the XPath to a CSS selector
    const closeButtonSelector = "div.close-button.header__close-button";

    // Click the button using the CSS selector
    await page.waitForSelector(closeButtonSelector);
    await page.click(closeButtonSelector);

    const rouletteSelector =
      "div.game-category__title--tgCXt:has-text('Roulette')";

    // Roulette Selection
    animateProgressBar("120px", "160px");

    await page.waitForSelector(rouletteSelector);
    await page.click(rouletteSelector);
    sendChatMessagesBtn.removeAttribute("disabled");
    checkRoomsBtn.removeAttribute("disabled");

    // Iframe link
    animateProgressBar("160px", "200px");
    progressContainer.remove();
    toast({
      message: "Pronto, você já pode procurar as salas",
      type: "is-success",
      duration: 2000,
    });
  } catch (error) {
    toast({
      message: "Ocorreu algum erro, tente novamente",
      type: "is-danger",
      duration: 2000,
    });

    await shutdownPlaywright();
    return;
  }
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
