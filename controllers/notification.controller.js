import discordServer from "../discord/index.js";

export const errorNotification = async (req) => {
  const { message, type, fatal, details } = req.body;
  if (!message || !type || !fatal || !details) {
    return;
  }
  const messageType = fatal ? "fatal" : "error";
  const textMessage = `Hey ${
    fatal ? "@everyone I'TS URGENT" : " "
  }we got an error \nmessage: ${message} \n type: ${type} \n details: ${details}`;
  await discordServer.sendMessage({ message: textMessage, type: messageType });
};

export const eventNotification = async (req) => {
  const { message, type, details } = req.body;
  if (!message || !type || !details) {
    return;
  }
  const messageText = `Hey we got a ${type} event \nmessage: ${message} \n details:\n ${details}`;
  await discordServer.sendMessage({ message: messageText, type: "event" });
};
