import { Application } from "express";
import { Route } from "./Route";
import { SecretController } from "../controllers/SecretController";

export class SecretsRoute implements Route {
  constructor(private secretController: SecretController) {}

  mountRoute(application: Application): void {
    application
      .route("/api/v1/secrets")
      .post(this.secretController.createSecret);
  }
}
