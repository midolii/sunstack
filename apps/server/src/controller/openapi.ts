import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env, Schema } from 'hono';
import { mergePath } from 'hono/utils/url';

/** Openapi 地址 */
export const OpenAPIRoute_PATH = '/openapi';

/** 在应用上注册 OpenAPI 文档，basePath 为文档公共路径前缀。 */
export function registerOpenAPI<E extends Env, S extends Schema, B extends string>(
  basePath: string,
  app: OpenAPIHono<E, S, B>,
) {
  return app.doc31(mergePath(basePath, OpenAPIRoute_PATH), {
    openapi: '3.1.0',
    info: { title: 'Server', version: '0.0.1' },
  });
}
