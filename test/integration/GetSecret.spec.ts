import supertest from "supertest";
import server from "../../src/server";
import { SecretModel } from "../../src/adapters/repositories/SecretModel";

const request = supertest(server.app);

describe("Get Secrets from One Time Secret API integration Tests", () => {
  it("should retrieve a secret from database", async () => {
    SecretModel.findOne = jest
      .fn()
      .mockResolvedValue({ secret: "MyGreatestSecret" });
    SecretModel.deleteOne = jest.fn();

    const res = await request.get(`/api/v1/secret/myGreatestUrlId`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ secret: "MyGreatestSecret" });
  });

  it("should retrieve a, error if the secret doesn't exist in database", async () => {
    SecretModel.findOne = jest.fn().mockResolvedValue(null);
    SecretModel.deleteOne = jest.fn();

    const res = await request.get(`/api/v1/secret/myGreatestUrlId`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "Secret was not found in the repository",
      title: "SecretNotFoundInRepositoryError",
    });
  });
});
