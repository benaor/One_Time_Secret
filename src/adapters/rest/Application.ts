import express from "express";
import { Route } from "./routes/Route";
import { errorHandler } from "./middlewares/ErrorHandler";

export class Application {
  public app: express.Application = express();

  constructor(private routeList: Route[]) {
    this.appConfig();
    this.mountRoute();
  }

  startServerOnPort(port: number): void {
    this.app.listen(port, () => console.info(`Listening on port ${port}`));
  }

  private mountRoute() {
    this.routeList.forEach((route) => route.mountRoute(this.app));
    this.app.use(errorHandler);
  }

  private appConfig() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
}
