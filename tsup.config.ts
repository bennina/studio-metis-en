// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'index.ts',
    'theme/index': 'lib/theme/index.ts',
    'components/atoms/index': 'components/atoms/index.ts',
    'components/molecules/index': 'components/molecules/index.ts',
    'components/sections/index': 'components/sections/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'next'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
