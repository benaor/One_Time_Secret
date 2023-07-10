import { NextFunction, Request, Response, request, response } from "express";
import { ValidationError } from "../../../../src/adapters/rest/controllers/ValidationError";
import { SecretByIdController } from "../../../../src/adapters/rest/controllers/SecretByIdController";
import { SecretNotFoundInRepositoryError } from "../../../../src/domain/models/errors/SecretNotFoundInRepositoryError";
import { SecretRetriever } from "../../../../src/domain/ports/in/SecretRetriever";
import { Secret } from "../../../../src/domain/models/Secret";

let req: Request;
let res: Response;
let next: NextFunction;
let secretRetriever: SecretRetriever;

describe("Secrets by Id Tests", () => {
  beforeEach(() => {
    req = expect.any(request);
    res = expect.any(response);
    next = jest.fn();

    secretRetriever = {
      retrieveSecret: jest.fn(),
    };
  });

  it("Should throw an error when sending invalid URL", () => {
    const secretsByIdController = new SecretByIdController(secretRetriever);
    secretsByIdController.retrieveSecretByUrl(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(new ValidationError("URL is not valid"));
  });

  it("Should throw an error when secret is not found", async () => {
    req.params = { urlId: "12345azerty" };
    secretRetriever.retrieveSecret = jest.fn().mockImplementation(async () => {
      throw new SecretNotFoundInRepositoryError();
    });

    const secretsByIdController = new SecretByIdController(secretRetriever);
    await secretsByIdController.retrieveSecretByUrl(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith(new SecretNotFoundInRepositoryError());
  });

  it("Should return a secret when it's found", async () => {
    const secret = "mySuperSecret";
    req.params = { urlId: "mySuperUrlId" };
    res.status = jest.fn();
    res.json = jest.fn();

    secretRetriever.retrieveSecret = jest
      .fn()
      .mockResolvedValue(new Secret(secret));

    const secretsByIdController = new SecretByIdController(secretRetriever);
    await secretsByIdController.retrieveSecretByUrl(req, res, next);

    expect(next).toBeCalledTimes(0);

    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(200);

    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ secret });
  });
});
