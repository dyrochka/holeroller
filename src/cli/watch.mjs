import {context} from "esbuild";
import {esbuildOptions} from "./esbuildOptions.mjs";

const ctx = await context(esbuildOptions);
await ctx.watch({});
