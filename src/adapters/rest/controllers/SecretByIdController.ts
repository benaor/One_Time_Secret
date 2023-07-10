import { NextFunction, Request, Response } from "express";
import { ValidationError } from "./ValidationError";
import { SecretRetriever } from "../../../domain/ports/in/SecretRetriever";
import { UrlId } from "../../../domain/models/UrlId";

export class SecretByIdController {
  constructor(private secretRetriever: SecretRetriever) {}

  retrieveSecretByUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      this.validateThatRequestContainUrlId(req);

      const urlId = new UrlId(req.params.urlId);
      const secret = await this.secretRetriever.retrieveSecret(urlId);

      res.status(200);
      res.json(secret);
    } catch (error) {
      next(error);
    }
  };

  validateThatRequestContainUrlId(req: Request) {
    if (!req.params?.urlId) throw new ValidationError("URL is not valid");
  }
}
