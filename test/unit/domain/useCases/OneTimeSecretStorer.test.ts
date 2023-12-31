import { Secret } from "../../../../src/domain/models/Secret";
import { UrlId } from "../../../../src/domain/models/UrlId";
import { OneTimeSecretStorer } from "../../../../src/domain/useCases/OneTimeSecretStorer";
import { SecretRepository } from "../../../../src/domain/ports/out/SecretRepository";
import { TokenGenerator } from "../../../../src/domain/ports/out/TokenGenerator";

describe("One Time Secret Storer", () => {
  it("should store a secret and return an urlId to query then", async () => {
    const url = "123456azerty";
    const secret = new Secret("123aze");
    const urlId = new UrlId(url);

    const secretStorerRepository: SecretRepository = {
      getSecretByUrlId: jest.fn(),
      removeSecretByUrlId: jest.fn(),
      storeUrlIdAndSecret: jest.fn(),
    };

    const tokenGenerator: TokenGenerator = {
      generateToken: jest.fn().mockReturnValue(url),
    };
    const oneTimeSecretStorer = new OneTimeSecretStorer(
      secretStorerRepository,
      tokenGenerator
    );

    const storeAction = await oneTimeSecretStorer.storeSecret(secret);

    expect(storeAction).toEqual(urlId);
    expect(secretStorerRepository.storeUrlIdAndSecret).toHaveBeenCalledTimes(1);
    expect(secretStorerRepository.storeUrlIdAndSecret).toHaveBeenCalledWith(
      urlId,
      secret
    );
    expect(tokenGenerator.generateToken).toHaveBeenCalledTimes(1);
  });
});
