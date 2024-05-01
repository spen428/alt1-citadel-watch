import * as a1lib from "@alt1/base";
import "./index.html";
import "./appconfig.json";
import "./icon.png";
import ChatBoxReader, { ChatLine } from "@alt1/chatbox";

import axios from "axios";

const CAPTURE_INTERVAL_MS = 2000;

const logElement = document.getElementById("log");
const chatBoxReader = new ChatBoxReader();

function writeLog(message: string) {
  logElement.innerText += "\n" + message;
}

function captureAndProcessChatBox() {
  if (!window.alt1) {
    return;
  }

  const img = a1lib.captureHoldFullRs();
  processChatBox(img);
}

function forwardLineToDiscord(line: string) {
  const url = "http://localhost:3000/send-message";
  const body = { messageContent: line };
  const headers = { "Content-Type": "application/json" };
  axios
    .post(url, body, { headers })
    .catch((error) => writeLog(`ERROR: Error forwarding message: ${error}`));
}

function processChatLines(chatLines: ChatLine[]) {
  chatLines
    .filter((line) => line.text.includes("[Clan System]"))
    .forEach((line) => {
      writeLog(line.text);
      forwardLineToDiscord(line.text);
    });
}

function processChatBox(img: a1lib.ImgRef) {
  const chatBoxImg = chatBoxReader.find(img);
  if (!chatBoxImg) {
    return;
  }

  const chatLines = chatBoxReader.read(img);
  if (!chatLines) {
    return;
  }

  processChatLines(chatLines);
}

export function showFilePicker() {
  try {
    a1lib.PasteInput.fileDialog().showPicker();
  } catch (e) {
    writeLog("ERROR: " + e);
  }
}

if (window.alt1) {
  alt1.identifyAppUrl("./appconfig.json");
  setInterval(() => captureAndProcessChatBox(), CAPTURE_INTERVAL_MS);
} else {
  const addAppUrl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
  document
    .getElementById("output")
    .insertAdjacentHTML(
      "beforeend",
      `Alt1 not detected, click <a href='${addAppUrl}'>here</a> to add this app to Alt1`,
    );
}

a1lib.PasteInput.listen(
  (img) => {
    processChatBox(img);
  },
  (err, errid) => writeLog(`ERROR: ${errid} ${err}`),
);

document
  .getElementById("output")
  .insertAdjacentHTML(
    "beforeend",
    `<div onclick='TestApp.showFilePicker()'>Click to select a test image</div>`,
  );
