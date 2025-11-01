import { type Options, defineConfig } from 'tsup';

function generateConfig(jsx: boolean): Options {
	return {
		target: 'esnext',
		platform: 'browser',
		format: 'esm',
		entry: ['src/**/*.ts'],
		splitting: true,
		outDir: 'dist/',
		minify: true,
		treeshake: false,
		clean: true,
        dts: true,
	};
}

export default defineConfig([generateConfig(true)]);
