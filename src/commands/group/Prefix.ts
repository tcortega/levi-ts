import { Message } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("prefix", {
    adminOnly: true,
    aliases: [],
    category: "group",
    cooldown: 30,
    description: {
        content: "Modifica o prefixo utilizado para comandos (o prefixo padrão ainda pode ser utilizado), use *--reset* para resetar o prefixo.",
        usage: "<novo prefixo | [--reset]>"
    },
    groupOnly: true
})
export default class extends BaseCommand {
    public async exec(msg: Message, query: string[]): Promise<void> {
        const regex = /^([-@.;^$!*=~+?<>\/#&+,\w])*$/;
        const defaultPrefix = this.client.config.prefix;
        const { flags, args } = this.parseArgs(query);
        if (flags.includes("reset")) {
            await this.client.db.models.settings.findOneAndUpdate({ chatId: msg.chatId }, { prefix: defaultPrefix });
            await this.client.reply(msg.chatId, `O prefixo dos comandos foi resetado para: *${defaultPrefix}*`, msg.id);
            return undefined;
        }
        const newPrefix = args[0];
        if (!newPrefix) {
            await this.client.reply(msg.chatId, "Por favor escolha o novo prefixo!", msg.id);
            return undefined;
        } else if (!regex.exec(newPrefix)) {
            await this.client.reply(msg.chatId, "Você não pode usar caracteres não suportados. Apenas letras alfabéticas ou caracteres especiais com tamanho máximo de 5 letras.", msg.id);
            return undefined;
        } else if (newPrefix.length >= 5) {
            await this.client.reply(msg.chatId, "Você não pode usar mais de cinco letras.!", msg.id);
            return undefined;
        }
        await this.client.db.models.settings.findOneAndUpdate({ chatId: msg.chatId }, { prefix: newPrefix.toLowerCase() });
        await this.client.reply(msg.chatId, `O prefixo do grupo foi alterado para: *${newPrefix.toLowerCase()}*`, msg.id);
        return undefined;
    }
}
