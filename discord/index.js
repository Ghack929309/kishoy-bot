import { ChannelType } from "discord.js";
import { client } from "../lib/index.js";
import {
  eventChannelName,
  errorChannelName,
  fatalChannelName,
  MESSAGE_TYPE,
} from "../constant/index.js";
import GuildDataStore from "./store.js";
import { EmbedBuilder } from "discord.js";

class Discord {
  constructor({ client }) {
    this.client = client;
    this.guildId = null;
  }

  async getGuildId() {
    let guildData = GuildDataStore.loadGuildData();
    this.guildId = guildData[0]?.id;
    client.on("guildCreate", (guild) => {
      console.log(`Bot added to server: ${guild.name} (ID: ${guild.id})`);
      this.guildId = guild.id;
      GuildDataStore.saveGuildData([
        {
          name: guild.name,
          id: guild.id,
        },
      ]);
    });
  }

  async getGuild() {
    if (!this.guildId) {
      this.getGuildId();
    }
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild) {
      console.error(`Guild with ID ${this.guildId} not found`);
      return null;
    }
    return guild;
  }
  async createCategory({ categoryName }) {
    const guild = await this.getGuild();
    let category;
    category = guild.channels.cache.find(
      (channel) =>
        channel.name === categoryName &&
        channel.type === ChannelType.GuildCategory
    );
    if (!category && guild) {
      try {
        category = await guild.channels.create({
          name: categoryName,
          type: ChannelType.GuildCategory,
        });
      } catch (error) {
        console.error(`Category with name ${categoryName} not found`);
      }
    }
    return category;
  }
  async createChannelUnderCategory({ categoryName, channelName }) {
    const category = await this.createCategory({ categoryName });
    let channel;
    channel = category.children.cache.find(
      (channel) =>
        channel.name === channelName && channel.type === ChannelType.GuildText
    );
    if (!channel && category) {
      try {
        channel = await category.guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: category.id,
        });
      } catch (error) {
        console.error(`Channel with name ${channelName} not found`);
      }
    }
    return channel;
  }
  async createChannel({ channelName }) {
    const guild = await this.getGuild();
    let channel;
    channel = this.client.channels.cache.find(
      (channel) =>
        channel.name === channelName && channel.type === ChannelType.GuildText
    );
    if (!channel && guild) {
      try {
        channel = await guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
        });
      } catch (error) {
        console.error(`Channel with name ${channelName} not found`);
      }
    }
    return channel;
  }

  async sendMessage({ embed, message, type, channelName, categoryName }) {
    if (type === MESSAGE_TYPE.ERROR) {
      const channel = await this.createChannelUnderCategory({
        channelName,
        categoryName,
      });
      if (embed) channel.send({ embeds: [embed] });
      else channel.send(message);
      console.log("error message sent");
    } else if (type === MESSAGE_TYPE.EVENT) {
      const channel = await this.createChannelUnderCategory({
        channelName,
        categoryName,
      });
      if (embed) channel.send({ embeds: [embed] });
      else channel.send(message);
      console.log("event message sent");
    } else if (type === MESSAGE_TYPE.FATAL) {
      const channel = await this.createChannelUnderCategory({
        channelName,
        categoryName,
      });
      if (embed) channel.send({ embeds: [embed] });
      else channel.send(message);
      console.log("fatal message sent");
    }
  }
  async preventMessageDeletion(deletedMessage) {
    const restrictedChannels = [
      eventChannelName,
      errorChannelName,
      fatalChannelName,
    ];
    if (deletedMessage.partial) await deletedMessage.fetch(true);
    const deletedEmbed = deletedMessage.embeds[0];
    const constructEmbed = EmbedBuilder.from(deletedEmbed);
    if (
      restrictedChannels.includes(deletedMessage.channel.name) &&
      deletedMessage.author.bot
    ) {
      deletedMessage.channel.send(
        "message deletion is not allowed in this server."
      );
      if (deletedEmbed) {
        return deletedMessage.channel.send({ embeds: [constructEmbed] });
      }
      deletedMessage.channel.send(
        `the deleted message was: ${deletedMessage.content}`
      );
    }
  }
}

const discordServer = new Discord({ client });
export default discordServer;
