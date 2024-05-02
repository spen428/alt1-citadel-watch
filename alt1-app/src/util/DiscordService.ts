import { ChatLine } from "@alt1/chatbox";
import Logger from "./Logger";
import axios from "axios";
import { isTimeString, timeStringToUnixTimestampSeconds } from "./DateTimeUtil";

interface ChatLineWithTimestamp {
  text: string;
  timestamp?: number;
}

class DiscordService {
  forwardLineToDiscord(line: ChatLine) {
    const url = "http://localhost:3000/send-message";
    const body = this.getChatLineWithTimestamp(line);
    const headers = { "Content-Type": "application/json" };
    axios
      .post(url, body, { headers })
      .catch((error) =>
        Logger.writeError(`Error forwarding message: ${error}`),
      );
  }

  private getChatLineWithTimestamp(line: ChatLine): ChatLineWithTimestamp {
    if (
      line.fragments[0].text === "[" &&
      isTimeString(line.fragments[1].text)
    ) {
      const timestamp = timeStringToUnixTimestampSeconds(
        line.fragments[1].text,
      );
      const textWithoutTimestamp = line.text.substring(11);
      return { text: textWithoutTimestamp, timestamp };
    }

    return { text: line.text };
  }
}

export default new DiscordService();
