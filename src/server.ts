import { UniqidTokenGenerator } from "./adapters/externalServices/UniqidTokenGenerator";
import { MongoSecretRepository } from "./adapters/repositories/MongoSecretRepository";
import { Application } from "./adapters/rest/Application";
import { SecretByIdController } from "./adapters/rest/controllers/SecretByIdController";
import { SecretController } from "./adapters/rest/controllers/SecretController";
import { Route } from "./adapters/rest/routes/Route";
import { SecretByIdRoute } from "./adapters/rest/routes/SecretByIdRoute";
import { SecretsRoute } from "./adapters/rest/routes/SecretsRoute";
import { OneTimeSecretRetriever } from "./domain/useCases/OneTimeSecretRetriever";
import { OneTimeSecretStorer } from "./domain/useCases/OneTimeSecretStorer";

// Services
const secretRepository = new MongoSecretRepository();
const tokenGenerator = new UniqidTokenGenerator();

// Create new Secrets
const secretStorer = new OneTimeSecretStorer(secretRepository, tokenGenerator);
const secretsController = new SecretController(secretStorer);
const secretsRoute = new SecretsRoute(secretsController);

// retrieve Secrets by Id
const secretByIdRetriever = new OneTimeSecretRetriever(secretRepository);
const secretByIdController = new SecretByIdController(secretByIdRetriever);
const secretByIdRoute = new SecretByIdRoute(secretByIdController);

const routes: Array<Route> = [];
routes.push(secretsRoute);
routes.push(secretByIdRoute);

const app = new Application(routes);

app.startServerOnPort(parseInt(process.argv[1]) || 3000);

export default app;
