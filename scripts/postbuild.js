import fs from "fs";
import path from "path";

const distPath = "./dist/assets";
const injectLoaderPrefix = "inject.ts-loader";
const injectLoaderOutput = `${injectLoaderPrefix}.js`;

const files = fs.readdirSync(distPath);
const loader = files.find((f) => f.startsWith(`${injectLoaderPrefix}-`) && f.endsWith(".js"));

if (!loader) throw new Error("inject loader not found!");

const originalPath = path.join(distPath, loader);
const stablePath = path.join(distPath, injectLoaderOutput);

fs.copyFileSync(originalPath, stablePath);
console.log(`Copied ${loader} -> ${injectLoaderOutput}`);
