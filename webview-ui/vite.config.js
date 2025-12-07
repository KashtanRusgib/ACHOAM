/// <reference types="vitest/config" />
var __assign =
	(this && this.__assign) ||
	function () {
		__assign =
			Object.assign ||
			((t) => {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i]
					for (var p in s) if (Object.hasOwn(s, p)) t[p] = s[p]
				}
				return t
			})
		return __assign.apply(this, arguments)
	}
var _a, _b, _c, _d, _e, _f, _g, _h

import { writeFileSync } from "node:fs"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "path"
import { defineConfig } from "vite"

// Custom plugin to write the server port to a file
var writePortToFile = () => ({
	name: "write-port-to-file",
	configureServer: (server) => {
		var _a
		;(_a = server.httpServer) === null || _a === void 0
			? void 0
			: _a.once("listening", () => {
					var _a
					var address = (_a = server.httpServer) === null || _a === void 0 ? void 0 : _a.address()
					var port = typeof address === "object" && address ? address.port : null
					if (port) {
						var portFilePath = resolve(__dirname, ".vite-port")
						writeFileSync(portFilePath, port.toString())
					} else {
						console.warn("[writePortToFile] Could not determine server port")
					}
				})
	},
})
var isDevBuild = process.argv.includes("--dev-build")
// Valid platforms, these should the keys in platform-configs.json
var VALID_PLATFORMS = ["vscode", "standalone"]
var platform = process.env.PLATFORM || "vscode" // Default to vscode
if (!VALID_PLATFORMS.includes(platform)) {
	throw new Error('Invalid PLATFORM "'.concat(platform, '". Must be one of: ').concat(VALID_PLATFORMS.join(", ")))
}
console.log("Building webview for", platform)
export default defineConfig({
	plugins: [react(), tailwindcss(), writePortToFile()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/setupTests.ts"],
		coverage: {
			provider: "v8",
			reportOnFailure: true,
			reporter: ["html", "lcov", "text"],
			reportsDirectory: "./coverage",
			exclude: [
				"**/*.{spec,test}.{js,jsx,ts,tsx,mjs,cjs}",
				"**/*.d.ts",
				"**/vite-env.d.ts",
				"**/*.{config,setup}.{js,ts,mjs,cjs}",
				"**/*.{css,scss,sass,less,styl}",
				"**/*.{svg,png,jpg,jpeg,gif,ico}",
				"**/*.{json,yaml,yml}",
				"**/__mocks__/**",
				"node_modules/**",
				"build/**",
				"coverage/**",
				"dist/**",
				"public/**",
				"src/services/grpc-client.ts",
			],
		},
	},
	build: {
		outDir: "build",
		reportCompressedSize: false,
		// Only minify in production build
		minify: !isDevBuild,
		// Enable inline source maps for dev build
		sourcemap: isDevBuild ? "inline" : false,
		rollupOptions: {
			output: __assign(
				{
					inlineDynamicImports: true,
					entryFileNames: "assets/[name].js",
					chunkFileNames: "assets/[name].js",
					assetFileNames: "assets/[name].[ext]",
					// Disable compact output for dev build
					compact: !isDevBuild,
				},
				isDevBuild && {
					generatedCode: {
						constBindings: false,
						objectShorthand: false,
						arrowFunctions: false,
					},
				},
			),
		},
		chunkSizeWarningLimit: 100000,
	},
	server: {
		port: 25463,
		hmr: {
			host: "localhost",
			protocol: "ws",
		},
		cors: {
			origin: "*",
			methods: "*",
			allowedHeaders: "*",
		},
	},
	define: {
		__PLATFORM__: JSON.stringify(platform),
		process: JSON.stringify({
			env: {
				NODE_ENV: JSON.stringify(
					(
						(_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0
							? void 0
							: _a.IS_DEV
					)
						? "development"
						: "production",
				),
				CLINE_ENVIRONMENT: JSON.stringify(
					(_c =
						(_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0
							? void 0
							: _b.CLINE_ENVIRONMENT) !== null && _c !== void 0
						? _c
						: "production",
				),
				IS_DEV: JSON.stringify(
					(_d = process === null || process === void 0 ? void 0 : process.env) === null || _d === void 0
						? void 0
						: _d.IS_DEV,
				),
				IS_TEST: JSON.stringify(
					(_e = process === null || process === void 0 ? void 0 : process.env) === null || _e === void 0
						? void 0
						: _e.IS_TEST,
				),
				CI: JSON.stringify(
					(_f = process === null || process === void 0 ? void 0 : process.env) === null || _f === void 0
						? void 0
						: _f.CI,
				),
				// PostHog environment variables
				TELEMETRY_SERVICE_API_KEY: JSON.stringify(
					(_g = process === null || process === void 0 ? void 0 : process.env) === null || _g === void 0
						? void 0
						: _g.TELEMETRY_SERVICE_API_KEY,
				),
				ERROR_SERVICE_API_KEY: JSON.stringify(
					(_h = process === null || process === void 0 ? void 0 : process.env) === null || _h === void 0
						? void 0
						: _h.ERROR_SERVICE_API_KEY,
				),
			},
		}),
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			"@components": resolve(__dirname, "./src/components"),
			"@context": resolve(__dirname, "./src/context"),
			"@shared": resolve(__dirname, "../src/shared"),
			"@utils": resolve(__dirname, "./src/utils"),
		},
	},
})
