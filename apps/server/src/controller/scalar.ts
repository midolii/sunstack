import type { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';
import type { Env, Schema } from 'hono';
import { mergePath } from 'hono/utils/url';
import { OpenAPIRoute_PATH } from './openapi.js';

/** 在应用上注册 Scalar 页面，并指向相同前缀下的 OpenAPI 文档。 */
export function registerScalar<E extends Env, S extends Schema, B extends string>(
  basePath: string,
  app: OpenAPIHono<E, S, B>,
) {
  return app.get(
    mergePath(basePath, '/scalar'),
    Scalar({
      url: mergePath(basePath, OpenAPIRoute_PATH),
      theme: 'elysiajs',
      pageTitle: 'Server API',
    }),
  );
}
