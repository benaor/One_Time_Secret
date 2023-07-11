import supertest from "supertest";
import server from "../../src/server";
import { SecretModel } from "../../src/adapters/repositories/SecretModel";

const request = supertest(server.app);

describe("Get Secrets from One Time Secret API integration Tests", () => {
  beforeEach(
    async () =>
      await SecretModel.create({
        urlId: "mylongurlid",
        secret: "myawesomesecret",
      })
  );

  afterEach(async () => await SecretModel.deleteMany({}));

  it("should retrieve a secret from database", async () => {
    const { body, status } = await request.get(`/api/v1/secret/mylongurlid`);

    expect(status).toBe(200);
    expect(body).toEqual({ secret: "myawesomesecret" });
  });

  it("should retrieve a, error if the secret doesn't exist in database", async () => {
    const { body, status } = await request.get(`/api/v1/secret/doesntexiste`);

    expect(status).toBe(404);
    expect(body).toEqual({
      message: "Secret was not found in the repository",
      title: "SecretNotFoundInRepositoryError",
    });
  });

  it("should retrieve an error if get the secret twice", async () => {
    await request.get(`/api/v1/secret/mylongurlid`);
    const { body, status } = await request.get(`/api/v1/secret/mylongurlid`);

    expect(status).toBe(404);
    expect(body).toEqual({
      message: "Secret was not found in the repository",
      title: "SecretNotFoundInRepositoryError",
    });
  });
});
