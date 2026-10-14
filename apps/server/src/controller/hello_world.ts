import { createRoute, OpenAPIHono, type RouteHandler, z } from '@hono/zod-openapi';

const route = createRoute({
  method: 'get',
  path: '/hello_world',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string().default('hello world').describe('返回信息') }),
        },
      },
      description: '测试接口',
    },
  },
});

const handler: RouteHandler<typeof route> = (c) => {
  return c.json({ message: 'hello world' }, 200);
};

/** hello world 测试 */
const app = new OpenAPIHono().openapiRoutes([{ route, handler }]);

export { app as HelloWorldRoute };
