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

const url = `https://discord.com/api/v9/channels/${secrets.channelId}/messages`;
const headers = {
  Authorization: `Bot ${secrets.discordBotToken}`,
  "Content-Type": "application/json",
};

app.post("/send-message", async (req, res) => {
  const timestamp = req.body.timestamp
    ? `<t:${req.body.timestamp}:f>`
    : "Unknown time";

  const body = { content: `[${timestamp}] ${req.body.text}` };

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
