import { ChatId, Message } from "@open-wa/wa-automate";
import { ITweetData, ITweetMediaMetaData, TwitterScraperError } from "@tcortega/twitter-scraper";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("twitter", {
  aliases: ["twt", "tt"],
  category: "general",
  cooldown: 15,
  description: {
    content: "Baixa vídeos ou imagens de um tweet.",
    usage: "<link>",
  },
})
export default class extends BaseCommand {
  public async exec(msg: Message, args: string[]): Promise<void> {
    await this.client.reply(msg.chatId, "*Processando...*", msg.id);

    if (this.hasValidArgs(args)) {
      try {
        const tweetMeta = await this.client.twtScraper.getTweetMeta(args[0]);
        if (tweetMeta.isVideo!) {
          this.sendVideo(msg.chatId, tweetMeta.id, tweetMeta.media_url!, tweetMeta.description!);
          return undefined;
        }

        if (tweetMeta.isImage!) {
          this.sendImages(msg.chatId, tweetMeta);
          return undefined;
        }

        await this.tweetUrlHasNoMedia(msg.chatId, msg.id);
        return undefined;
      } catch (e) {
        if (e instanceof TwitterScraperError) {
          if (e.errorType === "INVALID_URL") {
            await this.client.reply(msg.chatId, "O link do tweet é inválido ou o tweet foi excluido.", msg.id);

            return undefined;
          }
        }
        console.log(e);
      }
    }

    await this.client.reply(msg.chatId, "Você está usando o comando de forma incorreta, favor verificar a forma correta digitando *#h <comando>*", msg.id);
  }

  private async sendVideo(chatId: ChatId, tweetId: string, tweetMedia: ITweetMediaMetaData[], description?: string) {
    const videoUrl = tweetMedia[0].url;
    await this.client.sendFileFromUrl(chatId, videoUrl, `${tweetId}.mp4`, description!);
  }

  private async sendImages(chatId: ChatId, tweetMeta: ITweetData) {
    tweetMeta.media_url!.forEach(async (media) => {
      await this.client.sendFileFromUrl(chatId, media.url, `${tweetMeta.id}.jpg`, tweetMeta.description!);
    });
  }

  private async tweetUrlHasNoMedia(chatId: ChatId, quoteId: Message["id"]) {
    await this.client.reply(chatId, "O link enviado não contém imagens ou vídeos bobinho.", quoteId);
  }

  private hasValidArgs(args: string[]): boolean {
    if (args.length != 1) {
      return false;
    }

    return true;
  }
}
