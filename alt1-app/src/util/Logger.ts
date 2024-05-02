import { ChatLine } from "@alt1/chatbox";

class Logger {
  writeLog(message: string | ChatLine, color: string = "white") {
    const logElement = document.getElementById("log");

    if (typeof message === "string") {
      logElement.innerHTML += `<br/><span style="color: ${color}">${message}</span>`;
      return;
    }

    logElement.innerHTML += "<br/>";
    message.fragments.forEach((fragment) => {
      logElement.innerHTML += `<span style="color: rgb(${fragment.color.join(",")})">${fragment.text}</span>`;
    });
  }

  writeError(message: string | ChatLine) {
    this.writeLog("ERROR: " + message, "red");
  }

  writeWarning(message: string | ChatLine) {
    this.writeLog("WARN: " + message, "orange");
  }
}

export default new Logger();
