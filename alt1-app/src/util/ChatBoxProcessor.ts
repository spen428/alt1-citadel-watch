import ChatBoxReader, { Chatbox, ChatLine } from "@alt1/chatbox";
import { ImgRef } from "@alt1/base";
import Logger from "./Logger";

class ChatBoxProcessor {
  private readonly chatBoxReader = new ChatBoxReader();

  getChatLines(img: ImgRef): ChatLine[] {
    const chatBoxImg = this.chatBoxReader.find(img);
    if (!chatBoxImg) {
      Logger.writeError("No chat box image");
      return [];
    }
    this.drawChatBoxToDebugCanvas(img, chatBoxImg);

    const chatLines = this.chatBoxReader.read(img);
    if (!chatLines?.length) {
      Logger.writeError("No chat lines");
      return [];
    }

    return chatLines;
  }

  private drawChatBoxToDebugCanvas(img: ImgRef, chatBox: { boxes: Chatbox[] }) {
    if (chatBox.boxes.length < 1) {
      Logger.writeError("Cannot draw chat box with no ChatBox elements");
      return;
    }

    if (chatBox.boxes.length > 1) {
      Logger.writeWarning("More than one ChatBox element");
    }

    const rect = chatBox.boxes[0].rect;
    const imgCropped = img.read(rect.x, rect.y, rect.width, rect.height);

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.getContext("2d").putImageData(imgCropped.toDrawableData(), 0, 0);
  }
}

export default new ChatBoxProcessor();
