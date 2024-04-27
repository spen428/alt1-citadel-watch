const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors("http://localhost"));

const secrets = JSON.parse(fs.readFileSync("secrets.json", "utf8"));
if (!secrets || !secrets.channelId || !secrets.discordBotToken) {
  throw new Error("Missing secrets.json");
}

app.post("/send-message", async (req, res) => {
  const url = `https://discord.com/api/v9/channels/${secrets.channelId}/messages`;
  const body = { content: req.body.messageContent };
  const headers = {
    Authorization: `Bot ${secrets.discordBotToken}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(url, body, { headers });
    res.status(200).send("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error.response.data);
    res.status(500).send("Error sending message.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Relaying messages to channel ${secrets.channelId}`);
});
