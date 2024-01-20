import discordServer from "../discord/index.js";
import { EmbedBuilder } from "discord.js";

export const errorNotification = async (req) => {
  const { message, type, fatal, details } = req.body;
  if (!message || !type || !fatal || !details) {
    return;
  }
  const messageType = fatal ? "fatal" : "error";
  const title = fatal ? "❌FATAL ERROR🆘" : "⭕ERROR";
  const textMessage = `Hey ${
    fatal ? "@everyone I'TS URGENT" : " "
  }we got an error \nmessage: ${message} \n type: ${type} \n details: ${details}`;
  const embededNotification = new EmbedBuilder()
    .setColor("Red")
    .setTitle(title)
    .setDescription(textMessage)
    .setTimestamp();
  await discordServer.sendMessage({
    embed: embededNotification,
    message: textMessage,
    type: messageType,
  });
};

export const eventNotification = async (req) => {
  const { message, type, details } = req.body;
  if (!message || !type || !details) {
    return;
  }
  const messageText = `Hey we got a ${type} event \nmessage: ${message} \n details:\n ${details}`;
  const embededNotification = new EmbedBuilder()
    .setColor("Green")
    .setTitle("💵💸EVENT NOTIFICATION🚀")
    .setDescription(messageText)
    .setTimestamp();
  await discordServer.sendMessage({
    embed: embededNotification,
    message: messageText,
    type: "event",
  });
};
