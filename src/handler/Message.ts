import { Client, Message } from "@open-wa/wa-automate";

export default class MessageHandler {
  public constructor(public readonly client: Client, public readonly prefix: string) { }

  public async handle(msg: Message): Promise<void> {
    Object.assign(msg, { body: msg.type === "chat" ? msg.body : (msg.type === "image" && msg.caption) ? msg.caption : (msg.type === "video" && msg.caption) ? msg.caption : msg.body });

  }
}