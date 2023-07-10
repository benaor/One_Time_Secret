import { NextFunction, Request, Response, request, response } from "express";
import { SecretStorer } from "../../../../src/domain/ports/in/SecretStorer";
import { ValidationError } from "../../../../src/adapters/rest/controllers/ValidationError";
import { SecretController } from "../../../../src/adapters/rest/controllers/SecretController";
import { UrlId } from "../../../../src/domain/models/UrlId";

let req: Request;
let res: Response;
let next: NextFunction;
let secretStorer: SecretStorer;

describe("Secrets Tests", () => {
  beforeEach(() => {
    req = expect.any(request);
    res = expect.any(response);
    next = jest.fn();

    secretStorer = {
      storeSecret: jest.fn(),
    };
  });

  it("Should throw a valdidation error if the body of the request is not provided", () => {
    tryToCreateSecret(secretStorer).create();

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(validationError);
  });

  it("Should throw a valdidation error if the secret isn't String", () => {
    tryToCreateSecret(secretStorer).withBody({ secret: 123 }).create();

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(validationError);
  });

  it("Should create a valid secret", async () => {
    const urlId = new UrlId("myGreatUrlId");
    secretStorer.storeSecret = jest.fn().mockResolvedValue(urlId);

    await tryToCreateSecret(secretStorer)
      .withBody({ secret: "MyGreatSecret" })
      .withResponseStatus()
      .withResponseJson()
      .create();

    expect(next).toBeCalledTimes(0);

    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(201);

    expect(secretStorer.storeSecret).toBeCalledTimes(1);

    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith(urlId);
  });
});

const tryToCreateSecret = (secretStorer: SecretStorer) => ({
  withBody(_body: Record<string, unknown>) {
    req.body = _body;
    return this;
  },

  withResponseStatus() {
    res.status = jest.fn();
    return this;
  },

  withResponseJson() {
    res.json = jest.fn();
    return this;
  },

  async create() {
    const secretsController = new SecretController(secretStorer);
    await secretsController.createSecret(req, res, next);
  },
});

const validationError = new ValidationError("Requests body isn't valid");
