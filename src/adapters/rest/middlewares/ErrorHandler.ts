import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../controllers/ValidationError";
import { UrlIdTooShortError } from "../../../domain/models/errors/UrlIdTooShortError";
import { SecretTooShortError } from "../../../domain/models/errors/SecretTooShortError";
import { SecretNotFoundInRepositoryError } from "../../../domain/models/errors/SecretNotFoundInRepositoryError";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Case of status 400
  if (
    error instanceof ValidationError ||
    error instanceof UrlIdTooShortError ||
    error instanceof SecretTooShortError
  ) {
    res.status(400);
    res.json({
      title: error.name,
      message: error.message,
    });
    // Case of status 404 SecretNotFoundInRepositoryError
  } else if (error instanceof SecretNotFoundInRepositoryError) {
    res.status(404);
    res.json({
      title: error.name,
      message: error.message,
    });
  } else {
    res.status(500);
    res.json({
      title: "InternalServerError",
      message: "Something went wrong",
    });
  }
}
