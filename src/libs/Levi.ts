import Util from "../utils/Util";
import LeviConfig from "../config";
import MessageHandler from "../handler/Message";
import { Logger } from "winston";
import { create, ConfigObject } from "@open-wa/wa-automate";
import { DatabaseHandler } from "../handler/Database";
import { createLogger } from "../utils/Logger";
import { TwitterScraper } from "@tcortega/twitter-scraper";

export default class Levi {
  public constructor(public readonly config: typeof LeviConfig, public readonly options: ConfigObject) {
    void create(options).then(async (client) => {
      const database = new DatabaseHandler(client);
      const handler = new MessageHandler(client, this.config.prefix);

      Object.assign(client, {
        config,
        db: database,
        handler,
        log: createLogger(),
        util: new Util(client),
        twtScraper: await TwitterScraper.create(),
      });

      void handler.loadAll();
      await database.connect();

      await client.onAnyMessage(async (message) => {
        await client.getAmountOfLoadedMessages().then((msg) => (msg >= 3000 ? client.cutMsgCache() : msg));
        await client.sendSeen(message.chatId);
        await handler.handle(message);
      });

      await client.onStateChanged(async (state) => {
        if (state === "CONFLICT" || state === "UNLAUNCHED") {
          await client.forceRefocus();
          return undefined;
        }
        if (state === "CONNECTED") client.log.debug("Connected to the phone!");
        if (state === "UNPAIRED") client.log.debug("Logged out!");
      });
    });
  }
}

declare module "@open-wa/wa-automate" {
  interface Client {
    handler: MessageHandler;
    db: DatabaseHandler;
    config: typeof LeviConfig;
    util: Util;
    log: Logger;
    twtScraper: TwitterScraper;
  }
  interface Message {
    prefix: string;
  }
}
