import { Message } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("cooldown", {
  devOnly: true,
  aliases: ["cooldownbypass", "cdb"],
  category: "dev",
  cooldown: 3,
  description: {
    content: "Ativa ou desativa o bypass de cooldown entre comandos.",
  },
  groupOnly: true,
})
export default class extends BaseCommand {
  public async exec(msg: Message): Promise<void> {
    const oldValue = (await this.client.db.models.settings.findOne({ chatId: msg.chatId }))?.cooldownBypass;

    await this.client.db.models.settings.findOneAndUpdate({ chatId: msg.chatId }, { cooldownBypass: !oldValue });

    if (!oldValue) {
      await this.client.reply(msg.chatId, "O cooldown entre comandos foi desativado!", msg.id);
      return undefined;
    }
    await this.client.reply(msg.chatId, "O cooldown entre comandos foi ativado!", msg.id);
  }
}
