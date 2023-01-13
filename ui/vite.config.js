import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     legacy({
//       targets: ['ie >= 11'],
//       additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
//     }),
//   ],
//   build: {
//     minify: true,
//   },
//   resolve: {
//     alias: {
//       // "@": fileURLToPath(new URL("./src", import.meta.url)),
//       '@': `${path.resolve(__dirname, 'src')}`,
//     },
//   },
//   server: {
//     port: 8081,
//     proxy: {
//       '^/api': {
//         target: 'http://127.0.0.1:8082',
//         // changeOrigin: true,
//       },
//     },
//   },
// });


export default defineConfig({
	resolve: {
		alias: {
			'@': `${path.resolve(__dirname, 'src')}`,
		},
	},

	build: {
		minify: true,
	},

	plugins: [
		vue(),
	],

	server: {
		port: 8080,
		proxy: {
			"^/api": {
				target: "http://127.0.0.1:8095",
			},
    }
	},
})
