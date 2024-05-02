import { captureHoldFullRs, ImgRef, PasteInput } from "@alt1/base";
import "./index.html";
import "./appconfig.json";
import "./icon.png";
import ChatBoxProcessor from "./util/ChatBoxProcessor";
import Logger from "./util/Logger";
import DiscordService from "./util/DiscordService";

const CAPTURE_INTERVAL_MS = 2000;

function captureAndProcessChatBox() {
  if (!window.alt1) {
    return;
  }

  const img = captureHoldFullRs();
  processScreenshot(img);
}

function processScreenshot(img: ImgRef) {
  const chatLines = ChatBoxProcessor.getChatLines(img);

  chatLines
    .filter((line) => line.text.includes("[Clan System]"))
    .forEach((line) => {
      Logger.writeLog(line);
      DiscordService.forwardLineToDiscord(line);
    });
}

function clearPasteTarget() {
  document.getElementsByClassName("forcehidden")[0].innerHTML = "";
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
      `Alt1 not detected, click <a href='${addAppUrl}'>here</a> to add this app to Alt1.`,
    );
}

PasteInput.listen(
  (img) => {
    processScreenshot(img);
    clearPasteTarget();
  },
  (err, errid) => Logger.writeError(`${errid} ${err}`),
);
