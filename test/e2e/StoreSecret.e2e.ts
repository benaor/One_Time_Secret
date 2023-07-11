import supertest from "supertest";
import server from "../../src/server";

const request = supertest(server.app);

describe("Store Secrets from One Time Secret API e2e Tests", () => {
  it("should store a secret in the database", async () => {
    const postResponse = await request
      .post(`/api/v1/secrets`)
      .send({ secret: "myLitleSecret" });

    const urlId = postResponse.body.urlId;

    expect(postResponse.status).toBe(201);
    expect(urlId.length).toBeGreaterThanOrEqual(10);

    const getResponse = await request.get(`/api/v1/secret/${urlId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({ secret: "myLitleSecret" });
  });

  it("should an error if the secret doesn't existe in database", async () => {
    const { body, status } = await request.get(`/api/v1/secret/doesntexist`);

    expect(status).toBe(404);
    expect(body).toEqual({
      message: "Secret was not found in the repository",
      title: "SecretNotFoundInRepositoryError",
    });
  });
});
