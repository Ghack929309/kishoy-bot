import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import notificationRoutes from "./routes/notifications.routes.js";
import { client } from "./lib/index.js";
import discordServer from "./discord/index.js";

config();

const app = express();
app.use(bodyParser.json());
const allowedOrigins = ["https://kishoy.com"];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));
const PORT = process.env.PORT || 3001;

app.use(notificationRoutes);

app.listen(PORT, () => {
  console.log(`bot server is running on port ${PORT}`);
  client.login(process.env.DISCORD_TOKEN);

  client.once("ready", () => {
    console.log(`Logged in as ${client.user.username}!`);
  });
  discordServer.getGuildId();
  client.on("guildDelete", (guild) => {
    console.log(`Bot removed from server: ${guild.name} (ID: ${guild.id})`);
  });

  client.on("messageDelete", (message) =>
    discordServer.preventMessageDeletion(message)
  );
});
