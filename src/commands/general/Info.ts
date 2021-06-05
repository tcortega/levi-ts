import { Message } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("info", {
    aliases: ["botinfo"],
    category: "general",
    description: {
        content: "Exibe informações do bot."
    }
})
export default class extends BaseCommand {
    public exec(msg: Message): void {
        void this.client.reply(msg.chatId, "Esse bot foi criado com typescript e @open-wa/wa-automate. Só pra putas piranhas", msg.id);
    }
}
