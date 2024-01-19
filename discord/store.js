import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Store {
  constructor() {
    this.filePath = path.join(__dirname, "../constant", "guildData.json");
  }

  saveGuildData(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
      console.log("Guild data saved successfully.");
    } catch (error) {
      console.error("Error saving guild data:", error);
    }
  }

  loadGuildData() {
    try {
      fs.accessSync(this.filePath, fs.constants.F_OK);
      const data = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        const initialData = [];
        this.saveGuildData(initialData);
        return initialData;
      }
      console.error("Error loading guild data:", error);
      return [];
    }
  }
}
const GuildDataStore = new Store();
export default GuildDataStore;
