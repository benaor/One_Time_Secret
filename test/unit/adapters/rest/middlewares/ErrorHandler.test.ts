import { NextFunction, Request, Response, request, response } from "express";
import { errorHandler } from "../../../../../src/adapters/rest/middlewares/ErrorHandler";
import { ValidationError } from "../../../../../src/adapters/rest/controllers/ValidationError";
import { UrlIdTooShortError } from "../../../../../src/domain/models/errors/UrlIdTooShortError";
import { SecretTooShortError } from "../../../../../src/domain/models/errors/SecretTooShortError";
import { SecretNotFoundInRepositoryError } from "../../../../../src/domain/models/errors/SecretNotFoundInRepositoryError";

let req: Request;
let res: Response;
let next: NextFunction;

describe("Error handler Tests", () => {
  beforeEach(() => {
    req = expect.any(request);
    res = expect.any(response);
    res.status = jest.fn();
    res.json = jest.fn();
    next = jest.fn();
  });

  it("should send a uncontrolled error", () => {
    const error = new Error("Server is on fire");
    handleError(error);

    expectStatusAndJson(500, {
      title: "InternalServerError",
      message: "Something went wrong",
    });
  });

  it("should send a validation error", () => {
    const error = new ValidationError("body isn't present");
    handleError(error);

    expectStatusAndJson(400, {
      title: "ValidationError",
      message: "body isn't present",
    });
  });

  it("should send a UrliIDTooShort error", () => {
    const error = new UrlIdTooShortError();
    handleError(error);

    expectStatusAndJson(400, {
      title: "UrlIdTooShortError",
      message: "UrlId is too short",
    });
  });

  it("should send a SecretTooShort error", () => {
    const error = new SecretTooShortError();
    handleError(error);

    expectStatusAndJson(400, {
      title: "SecretTooShortError",
      message: "Secret is too short",
    });
  });

  it("should send a SecretTooShort error", () => {
    const error = new SecretNotFoundInRepositoryError();
    handleError(error);

    expectStatusAndJson(404, {
      title: "SecretNotFoundInRepositoryError",
      message: "Secret was not found in the repository",
    });
  });
});

const handleError = (error: Error) => errorHandler(error, req, res, next);

const expectStatusAndJson = (status: number, json: unknown) => {
  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(status);

  expect(res.json).toBeCalledTimes(1);
  expect(res.json).toBeCalledWith(json);
};
