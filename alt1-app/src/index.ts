import * as a1lib from "@alt1/base";
import "./index.html";
import "./appconfig.json";
import "./icon.png";
import ChatBoxReader, { ChatLine } from "@alt1/chatbox";

import axios from "axios";

const MOST_RECENTLY_FORWARDED_LINE_KEY = "mostRecentlyForwardedLine";

const output = document.getElementById("output");
const chatBoxReader = new ChatBoxReader();

function writeLog(message: string) {
  output.insertAdjacentHTML("beforeend", `<div>${message}</div>`);
}

function writeError(message: string) {
  output.insertAdjacentHTML(
    "beforeend",
    `<div style="color: red;">${message}</div>`,
  );
}

a1lib.PasteInput.listen(
  (img) => {
    processChatBox(img);
  },
  (err, errid) => {
    writeError(errid + " " + err);
  },
);

// noinspection JSUnusedGlobalSymbols
export function capture() {
  if (!window.alt1) {
    a1lib.PasteInput.fileDialog().showPicker();
    return;
  }

  const img = a1lib.captureHoldFullRs();
  processChatBox(img);
}

function hasBeenForwarded(line: string): boolean {
  return localStorage.getItem(MOST_RECENTLY_FORWARDED_LINE_KEY) === line;
}

function forwardLineToDiscord(line: string) {
  const url = "http://localhost:3000/send-message";
  const body = { messageContent: line };
  const headers = { "Content-Type": "application/json" };
  axios
    .post(url, body, { headers })
    .then(() => localStorage.setItem(MOST_RECENTLY_FORWARDED_LINE_KEY, line))
    .catch((error) =>
      writeError(`Error forwarding message to discord: ${error}`),
    );
}

function processChatLines(chatLines: ChatLine[]) {
  const linesNewestFirst = chatLines
    .filter((line) => line.text.includes("[Clan System]"))
    .reverse();
  for (const line of linesNewestFirst) {
    if (hasBeenForwarded(line.text)) {
      break;
    }

    forwardLineToDiscord(line.text);
  }
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

if (window.alt1) {
  alt1.identifyAppUrl("./appconfig.json");
} else {
  const addAppUrl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
  writeLog(
    `Alt1 not detected, click <a href='${addAppUrl}'>here</a> to add this app to Alt1`,
  );
}

writeLog(`<div onclick='TestApp.capture()'>Click to capture if on alt1</div>`);
