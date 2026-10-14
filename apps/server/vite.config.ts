import build, { type NodeBuildOptions } from '@hono/vite-build/node';
import devServer, { type DevServerOptions } from '@hono/vite-dev-server';
import { defineConfig } from 'vite';

/** Hono vite 插件配置 */
const HONO_VITE_PLUGIN_OPTIONS: NodeBuildOptions & DevServerOptions = {
  entry: 'src/index.ts',
  outputDir: './dist',
  output: 'index.js',
  minify: true,
};

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';
  return {
    plugins: [isDev ? devServer(HONO_VITE_PLUGIN_OPTIONS) : build(HONO_VITE_PLUGIN_OPTIONS)],
  };
});
