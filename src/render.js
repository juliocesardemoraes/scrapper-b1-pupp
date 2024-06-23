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
const HEADLESS_BOOLEAN = true;

// SHARED SELECTORS
const chatSelector = ".chat-input.chat-input-layout";
const buttonSendChatMessage = "svg.chat-controls-button__icon--DVtUL";

// DOM ELEMENTS
const progressBar = document.getElementById("animate-value");
const sendChatMessagesBtn = document.getElementById("sendChatMessages");
const form = document.getElementById("create-message-form");
const messageList = document.getElementById("message-list");
let roomList = document.getElementById("room-list");
const checkRoomsBtn = document.getElementById("checkRooms");
const btnContainer = document.getElementById("btnContainer");

function getRandomValue(max) {
  return Math.floor(Math.random() * max);
}

async function sendMessageFunctionality(message) {
  if (message === "") {
    return;
  }
  await page.waitForSelector(chatSelector);
  await page.type(chatSelector, message);
  await page.waitForSelector(buttonSendChatMessage);
  await page.click(buttonSendChatMessage);
}

function getRandomMessage() {
  const indexItem = getRandomValue(arrayOfMessages.size - 1);
  let counter = 0;
  let message = "";

  arrayOfMessages.forEach(function (item) {
    if (counter === indexItem) {
      message = item;
    }
    counter++;
  });

  return message;
}

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

async function sendMessagesTimer() {
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
}

async function sendChatMessages(e) {
  await sendMessagesTimer();
}

function animateProgressBar(minValue, maxValue) {
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
}

async function shutdownPlaywright() {
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
}

async function runScrapper(e) {
  try {
    if (page) {
      page = null;
      return;
    }

    btnContainer.innerHTML = "";
    animateProgressBar("0px", "20px");

    toast({
      message: "O site está rodando, aguarde alguns segundos",
      type: "is-info",
      duration: 2000,
    });

    browser = await firefox.launch({
      headless: HEADLESS_BOOLEAN,
      devtools: false,
      args: [
        "--no-sandbox",
        "--no-devtools",
        "--disable-setuid-sandbox",
        "--mute-audio",
      ],
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

    const buttonSelector =
      'a.p-ripple.p-element.btn.btn-primary.ng-tns-c85-1:has-text("Login")';

    await page.waitForSelector(buttonSelector, { timeout: 15000 });
    await page.click(buttonSelector);

    const inputUser = 'input[type="text"]';
    const inputPassword = 'input[type="password"]';

    const user = JSON.parse(localStorage.getItem("user"));
    const ROULETTE_URL =
      "https://www.b1.bet/#/game/casinolive?st=&stTp=1&p=480&t=1&g=SWS-playtech:RoletaBrasileria&lp=480";

    await page.waitForSelector(inputUser);
    await page.fill(inputUser, user.name);
    await page.waitForSelector(inputPassword);
    await page.fill(inputPassword, user.password);

    await page.press(inputPassword, "Enter");

    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/Login_Authenticate") && resp.status() === 200
    );
    await responsePromise;

    // Define the selector for the element
    const selector = ".Message--red .Message-body";

    // Check if the element exists
    const elementExists = await page.$(selector, { timeout: 12000 });

    if (elementExists) {
      toast({
        message: "Conta invalida",
        type: "is-danger",
        duration: 2000,
      });

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }

    animateProgressBar("20px", "80px");

    await page.goto("https://www.b1.bet/#/game/casinolive", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(2000);

    const MAX_RETRIES = 3;
    let retries = 0;
    let elementFound = false;
    while (retries < MAX_RETRIES && !elementFound) {
      try {
        await page.goto(`${ROULETTE_URL}`, {
          waitUntil: "domcontentloaded",
        });
        await page.waitForSelector("#SOSWScriptWdget > iframe", {
          timeout: 12000,
        });
        elementFound = true;
      } catch (e) {
        retries++;
        console.log(`Attempt ${retries} failed. Retrying...`);
      }
    }

    animateProgressBar("80px", "100px");

    const iframeHandle = await page.$("#SOSWScriptWdget > iframe");
    const src = await iframeHandle.getAttribute("src");
    await page.goto(src);

    animateProgressBar("100px", "120px");

    const closeButtonSelector = "div.close-button.header__close-button";
    await page.waitForSelector(closeButtonSelector);
    await page.click(closeButtonSelector);

    const rouletteSelector =
      "div.game-category__title--tgCXt:has-text('Roulette')";

    animateProgressBar("120px", "160px");

    await page.waitForSelector(rouletteSelector);
    await page.click(rouletteSelector);
    checkRoomsBtn.removeAttribute("disabled");
    // sendChatMessagesBtn.removeAttribute("disabled");

    animateProgressBar("160px", "200px");
    animateProgressBar("200px", "0px");

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
}

function openModalButton(e) {
  const addMessageBtn = document.getElementById("message-modal");
  addMessageBtn.classList.add("is-active");
}

function closeModalButton() {
  const addMessageBtn = document.getElementById("message-modal");
  addMessageBtn.classList.remove("is-active");
}

async function closeRoom() {
  await page.click("svg.close-button__icon");
}

let isInsideRoom = false;

async function checkRooms() {
  if (isInsideRoom) {
    await closeRoom();
    isInsideRoom = false;
    checkRoomsBtn.innerText = "Buscar salas";
    checkRoomsBtn.classList.remove("is-danger");
  }
  await page.waitForTimeout(1000);

  const elements = await page.$$("div.tables-grid__item--Jt0at");
  let itemsIndex = 0;
  roomList.innerHTML = "";
  arrayOfHtmlItems = [];

  for (let i = 0; i < elements.length; i++) {
    const nameElement = await elements[i].$(
      'div[data-automation-locator="lobby-table-name"]'
    );
    let nameText = "";
    if (nameElement) {
      nameText = await nameElement.textContent();
    } else {
      console.log('No child element with class "lobby-table-name" found.');
    }

    const tableElement = await elements[i].$(
      "div.table--Ohpzf.lobby-table-hover-4Gdj"
    );

    if (!tableElement) {
      console.log(
        'No child element with classes "table--Ohpzf lobby-table-hover-4Gdj" found.'
      );
    }

    if (nameText == "") continue;

    arrayOfHtmlItems.push({ name: nameText, elementSelector: tableElement });
    roomList.innerHTML += addRoom(nameText, itemsIndex, tableElement);
    itemsIndex++;
  }
}

async function enterRoom(elementIndex) {
  isInsideRoom = true;
  const tableElement = arrayOfHtmlItems[elementIndex].elementSelector;
  await tableElement.click();
  // await page.waitForSelector(chatSelector);
  sendChatMessagesBtn.removeAttribute("disabled");
  checkRoomsBtn.innerText = "Fechar sala atual";
  checkRoomsBtn.classList.add("is-danger");
  roomList.innerHTML = `Sala ${arrayOfHtmlItems[elementIndex].name} selecionada, se deseja trocar clique no botão buscar salas`;
}

function addMessage(value) {
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
}

function addRoom(roomText, itemsIndex, tableElement) {
  return `<div id='card-${roomText}' class="card mt-4 card-hover" onclick='enterRoom("${itemsIndex}")'>
                <header class="card-header">
                  <p class="card-header-title">Sala</p>
                </header>
                <div class="card-content">
                  <div class="content">
                    ${roomText}
                  </div>
                </div>
          </div>`;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const payload = new FormData(form);
  const addMessageBtn = document.getElementById("message-modal");

  if (editValue != "") {
    for (item of payload) {
      if (arrayOfMessages.has(editValue)) {
        arrayOfMessages.delete(editValue);
        arrayOfMessages.add(item[1]);
        const idCardToRemove = document.getElementById(`card-${editValue}`);
        idCardToRemove.remove();
        messageList.innerHTML += addMessage(item[1]);
        editValue = "";
      }
    }
  } else {
    for (item of payload) {
      if (arrayOfMessages.has(item[1])) break;
      arrayOfMessages.add(item[1]);
      messageList.innerHTML += addMessage(item[1]);
    }
  }

  addMessageBtn.classList.remove("is-active");
});

function editar(valor) {
  editValue = valor;
  const addMessageBtn = document.getElementById("message-modal");
  addMessageBtn.classList.add("is-active");
}

function deletar(valor) {
  arrayOfMessages.delete(valor);
  const idCardToRemove = document.getElementById(`card-${valor}`);
  idCardToRemove.remove();
}
