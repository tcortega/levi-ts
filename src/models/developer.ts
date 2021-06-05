import { model, Schema } from "mongoose";
import { IDeveloper } from "../typings";

const schema = new Schema({
  developer_id: String
});

export const developer = model<IDeveloper>("developer", schema, "developer");
