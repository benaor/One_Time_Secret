import mongoose from "mongoose";
import { Secret } from "../../domain/models/Secret";
import { UrlId } from "../../domain/models/UrlId";
import { SecretRepository } from "../../domain/ports/out/SecretRepository";
import { SecretModel } from "./SecretModel";
import { SecretNotFoundInRepositoryError } from "../../domain/models/errors/SecretNotFoundInRepositoryError";

export class MongoSecretRepository implements SecretRepository {
  constructor() {
    this.setConnection();
  }

  async getSecretByUrlId(urlId: UrlId): Promise<Secret> {
    const res = await SecretModel.findOne({ urlId: urlId.toString() });
    if (!res) throw new SecretNotFoundInRepositoryError();

    return new Secret(res.secret);
  }

  async removeSecretByUrlId(urlId: UrlId): Promise<void> {
    await SecretModel.deleteOne({ urlId: urlId.toString() });
  }

  async storeUrlIdAndSecret(urlId: UrlId, secret: Secret): Promise<void> {
    await SecretModel.create({
      urlId: urlId.toString(),
      secret: secret.toString(),
    });
  }

  private async setConnection() {
    if (this.isNotConnected())
      await mongoose.connect("mongodb://localhost:27017/onetimesecret");
  }

  isNotConnected() {
    return mongoose.connection.readyState === 0;
  }
}
