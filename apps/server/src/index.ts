import { OpenAPIHono } from '@hono/zod-openapi';
import { HelloWorldRoute } from './controller/hello_world.js';
import { registerOpenAPI } from './controller/openapi.js';
import { registerScalar } from './controller/scalar.js';

const app = new OpenAPIHono().route('/__inner', HelloWorldRoute);

registerOpenAPI('/', app);
registerScalar('/', app);

export default app;
export type ServerType = typeof app;
