import { NextFunction, Request, Response } from "express";
import { SecretStorer } from "../../../domain/ports/in/SecretStorer";
import { ValidationError } from "./ValidationError";
import { Secret } from "../../../domain/models/Secret";

export class SecretController {
  constructor(private secretStorer: SecretStorer) {}

  async createSecret(req: Request, res: Response, next: NextFunction) {
    try {
      this.secretIsValidInRequest(req);
      const secret = new Secret(req.body.secret);
      const urlId = await this.secretStorer.storeSecret(secret);

      res.status(201);
      res.json(urlId);
    } catch (error) {
      next(error);
    }
  }

  secretIsValidInRequest(req: Request) {
    if (typeof req.body?.secret !== "string")
      throw new ValidationError("Requests body isn't valid");
  }
}
