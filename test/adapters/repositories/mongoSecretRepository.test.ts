import mongoose from "mongoose";
import { MongoSecretRepository } from "../../../src/adapters/repositories/MongoSecretRepository";
import { Secret } from "../../../src/domain/models/Secret";
import { UrlId } from "../../../src/domain/models/UrlId";
import { SecretModel } from "../../../src/adapters/repositories/SecretModel";
import { SecretNotFoundInRepositoryError } from "../../../src/domain/models/errors/SecretNotFoundInRepositoryError";

describe("MongoSecretRepository Tests", () => {
  it("should connect to the database", () => {
    mongoose.connect = jest.fn();

    new MongoSecretRepository();

    expect(mongoose.connect).toBeCalledTimes(1);
    expect(mongoose.connect).toBeCalledWith(
      "mongodb://localhost:27017/onetimesecret"
    );
  });

  it("should not connect to the database if the connection is already open", () => {
    // @ts-ignore
    mongoose.connection.readyState = 1;
    mongoose.connect = jest.fn();

    new MongoSecretRepository();

    expect(mongoose.connect).toBeCalledTimes(0);
  });

  it("should retrieve a secret from mongo", async () => {
    const secret = "mySuperSecret";
    const urlId = new UrlId("123456azerty");

    SecretModel.findOne = jest.fn().mockResolvedValue({ secret: secret });
    const { getSecretByUrlId } = new MongoSecretRepository();

    expect(await getSecretByUrlId(urlId)).toEqual(new Secret(secret));

    expect(SecretModel.findOne).toBeCalledTimes(1);
    expect(SecretModel.findOne).toBeCalledWith(urlId);
  });

  it("should throw an error when querying that does not exist", async () => {
    const urlId = new UrlId("123456azerty");

    SecretModel.findOne = jest.fn().mockResolvedValue(null);
    const { getSecretByUrlId } = new MongoSecretRepository();

    expect(getSecretByUrlId(urlId)).rejects.toThrow(
      SecretNotFoundInRepositoryError
    );

    expect(SecretModel.findOne).toBeCalledTimes(1);
    expect(SecretModel.findOne).toBeCalledWith(urlId);
  });

  it("should remove a secret from the database", async () => {
    const urlId = new UrlId("123456azerty");

    SecretModel.deleteOne = jest.fn();
    const { removeSecretByUrlId } = new MongoSecretRepository();

    await removeSecretByUrlId(urlId);

    expect(SecretModel.deleteOne).toBeCalledTimes(1);
    expect(SecretModel.deleteOne).toBeCalledWith(urlId);
  });

  it("should create a secret in the database", async () => {
    const urlId = new UrlId("123456azerty");
    const secret = new Secret("mySuperSecret");

    SecretModel.create = jest.fn();
    const { storeUrlIdAndSecret } = new MongoSecretRepository();

    await storeUrlIdAndSecret(urlId, secret);

    expect(SecretModel.create).toBeCalledTimes(1);
    expect(SecretModel.create).toBeCalledWith({
      urlId: urlId.toString(),
      secret: secret.toString(),
    });
  });
});
