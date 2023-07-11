import supertest from "supertest";
import server from "../../src/server";
import { SecretModel } from "../../src/adapters/repositories/SecretModel";

const request = supertest(server.app);

describe("Store Secrets from One Time Secret API integration Tests", () => {
  it("should store a secret in the database", async () => {
    SecretModel.create = jest.fn();
    const secret = "myLitleSecret";
    const res = await request.post(`/api/v1/secrets`).send({ secret: secret });

    expect(res.status).toBe(201);
    expect(res.body.urlId.length).toBeGreaterThanOrEqual(10);
  });

  it("should received an error if secret is smaller than 3 characters", async () => {
    SecretModel.create = jest.fn();
    const secret = "abc";
    const res = await request.post(`/api/v1/secrets`).send({ secret: secret });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "Secret is too short",
      title: "SecretTooShortError",
    });
  });
});
