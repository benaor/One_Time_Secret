import mongoose from "mongoose";

export interface ISecretSchema extends mongoose.Document {
  urlId: string;
  secret: string;
}

const SecretSchema = new mongoose.Schema<ISecretSchema>({
  urlId: String,
  secret: String,
});

export const SecretModel = mongoose.model<ISecretSchema>(
  "Secrets",
  SecretSchema
);
