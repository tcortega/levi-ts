import { Message, decryptMedia } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("sticker", {
    aliases: ["stiker", "fig"],
    category: "general",
    cooldown: 20,
    description: {
        content: "Crie figurinhas a partir de uma imagem ou vídeo, use *--crop* para cortar os stickers.",
        usage: "[--crop]"
    }
})
export default class extends BaseCommand {
    public async exec(msg: Message, query: string[]): Promise<void> {
        const { flags } = this.parseArgs(query);
        const isCropped = flags.includes("crop");
        const isQuotedImage = msg.quotedMsg && msg.quotedMsg.type === "image";
        const isQuotedVideo = msg.quotedMsg && msg.quotedMsg.type === "video";
        if (msg.type === "image" || isQuotedImage) {
            const wait = await this.client.reply(msg.chatId, "*Processando...*", msg.id) as Message["id"];
            await this.create(msg, wait, isQuotedImage!, false, isCropped);
        } else if (msg.quotedMsg && msg.quotedMsg.type === "document" && ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(msg.quotedMsg.mimetype!)) {
            const wait = await this.client.reply(msg.chatId, "*Processando...*", msg.id) as Message["id"];
            await this.create(msg, wait, true, false, isCropped);
        } else if (msg.type === "video" || isQuotedVideo) {
            if ((Number(msg.duration) || Number(msg.quotedMsg!.duration)) >= 15) {
                await this.client.reply(msg.chatId, "Por favor use um vídeo/gif com duração inferior a 15 segundos.", msg.id);
                return undefined;
            }
            const wait = await this.client.reply(msg.chatId, "*Processando...* (as vezes leva de 1 a 5 minutos para processar)", msg.id) as Message["id"];
            await this.create(msg, wait, isQuotedVideo!, true, isCropped);
        } else {
            await this.client.reply(msg.chatId, `Por favor envie uma imagem/vídeo/gif com a legenda *${msg.prefix}fig* ou responda isso à mídia alvo! Você também pode enviar uma imagem como documento e responder com *${msg.prefix}fig*`, msg.id);
        }
    }

    private async create(message: Message, waitMsg: Message["id"], isQuoted: boolean, isGif = false, crop = false): Promise<void> {
        try {
            const msg = isQuoted ? message.quotedMsg! : message;
            const media = await decryptMedia(msg, this.client.config.UserAgent);
            const imageBase64 = `data:${msg.mimetype as string};base64,${media.toString("base64")}`;
            if (isGif) {
                await this.client.sendMp4AsSticker(message.chatId, media.toString("base64"), { crop }, { author: "Levi", pack: "Criado por" });
                await this.client.deleteMessage(message.chatId, waitMsg);
                return undefined;
            }
            await this.client.sendImageAsSticker(message.chatId, imageBase64, { keepScale: !crop, author: "Levi", pack: "Criado por" });
            await this.client.deleteMessage(message.chatId, waitMsg);
        } catch (e) {
            await this.client.deleteMessage(message.chatId, waitMsg);
            await this.client.reply(message.chatId, `Um erro ocorreu ao tentar criar a figurinha. ${isGif ? "tente denovo com um video/gif mais curto" : ""}`, message.id);
        }
    }
}
