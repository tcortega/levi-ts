import { model, Schema } from "mongoose";
import { IDefaultSettings } from "../typings/index";

const schema = new Schema({
    prefix: String,
    chatId: String,
    banlist: [String],
    cooldownBypass: Boolean,
});

export const settings = model<IDefaultSettings>("settings", schema);