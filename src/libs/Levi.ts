import { ConfigObject, create } from "@open-wa/wa-automate";
import MessageHandler from "../handler/Message";
import { createLogger, Logger } from "winston";
import LeviConfig from "../config";

export default class Levi {
  public constructor(public readonly config: typeof LeviConfig, public readonly options: ConfigObject) {
    this.build(config, options);
  }

  private async build(config: typeof LeviConfig, options: ConfigObject) {
    const client = await create(options);
    client.log = createLogger();

    const messageHandler = new MessageHandler(client, this.config.prefix);

    client.onAnyMessage(async message => {
      await client.getAmountOfLoadedMessages().then(msg => msg >= 3000 ? client.cutMsgCache() : msg);
      await client.sendSeen(message.chatId);
      await messageHandler.handle(message);
    });

    client.onStateChanged(async state => {
      if (state === "CONFLICT" || state === "UNLAUNCHED") {
        await client.forceRefocus();
        return undefined;
      }
      if (state === "CONNECTED") client.log.debug("Connected to WhatsApp Web!");
      if (state === "UNPAIRED") client.log.debug("Logged out :(");
    });

  }
}

declare module "@open-wa/wa-automate" {
  interface Client {
    handler: MessageHandler;
    config: typeof LeviConfig;
    log: Logger;
  }
  interface Message {
    prefix: string;
  }
}