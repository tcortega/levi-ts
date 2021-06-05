import { Message } from "@open-wa/wa-automate";
import { stripIndent } from "common-tags";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("help", {
    aliases: ["menu", "h"],
    category: "general",
    description: {
        content: "Gera uma lista de comandos",
        usage: "[comando]"
    }
})
export default class extends BaseCommand {
    public async exec(msg: Message, args: string[]): Promise<void> {
        const handler = this.handler!;
        const command = handler.commands.get(args[0]) ?? Array.from(handler.commands.values()).find(x => x.options.aliases.includes(args[0]));
        if (!command) {
            let base = "*Lista de Comandos*\n\n";
            const modules = handler.categories;
            for (const mod of modules) {
                base += `*${this.firstUpperCase(mod.name)}*\n${mod.commands.map(x => x.id).join(", ") || "None"}\n`;
            }
            await this.client.reply(msg.chatId, base, msg.id);
            return undefined;
        }
        const detail = stripIndent(`
        Informações do comando *${command.id}*
        _${command.options.description.content ? command.options.description.content : "Nenhuma descrição disponível"}_

        *Apelidos:* ${command.options.aliases.join(", ") || "Sem apelidos"}
        *Uso:* ${command.options.description.usage ? `${msg.prefix}${command.id} ${command.options.description.usage}` : `${handler.prefix}${command.id}`}
        *Cooldown:* ${command.options.cooldown ? `${command.options.cooldown}s` : "10s"}

        ℹ️ _<> significa obrigatório e [ ] significa opcional, não inclua <> ou [ ] ao usar um comando._
        `);
        await this.client.reply(msg.chatId, detail, msg.id);
    }

    private firstUpperCase(text: string): string {
        return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
    }
}
