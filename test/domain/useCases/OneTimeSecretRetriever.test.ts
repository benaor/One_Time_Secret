import { Secret } from "../../../src/domain/models/Secret";
import { UrlId } from "../../../src/domain/models/UrlId";
import { OneTimeSecretRetriever } from "../../../src/domain/useCases/OneTimeSecretRetriever";
import { SecretRepository } from "../../../src/domain/ports/out/SecretRepository";

describe("One Time Secret Retriever", () => {
  it("should retrieve a secret one time", async () => {
    const secret = new Secret("123aze");
    const urlId = new UrlId("123456azerty");

    const secretRepository: SecretRepository = {
      getSecretByUrlId: jest.fn().mockResolvedValue(secret),
      removeSecretByUrlId: jest.fn(),
      storeUrlIdAndSecret: jest.fn(),
    };

    const oneTimeSecretRetriever = new OneTimeSecretRetriever(secretRepository);

    expect(await oneTimeSecretRetriever.retrieveSecret(urlId)).toEqual(secret);

    expect(secretRepository.getSecretByUrlId).toBeCalledTimes(1);
    expect(secretRepository.getSecretByUrlId).toBeCalledWith(urlId);

    expect(secretRepository.removeSecretByUrlId).toBeCalledTimes(1);
    expect(secretRepository.removeSecretByUrlId).toBeCalledWith(urlId);
  });
});
