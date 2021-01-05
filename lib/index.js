#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const depcheck_1 = __importDefault(require("depcheck"));
const fs_1 = __importDefault(require("fs"));
async function main() {
    const prefix = process.argv[2];
    try {
        const pkg = fs_1.default.readFileSync('./package.json', { encoding: 'utf8' });
        const jsonPkg = JSON.parse(pkg);
        const data = await depcheck_1.default('./', { package: jsonPkg });
        const deps = new Set();
        Object.keys(data.missing).forEach((k) => {
            if (prefix && k.indexOf(prefix) === 0) {
                deps.add(k);
            }
            else if (!prefix) {
                deps.add(k);
            }
        });
        Object.keys(data.using).forEach((k) => {
            if (prefix && k.indexOf(prefix) === 0) {
                deps.add(k);
            }
            else if (!prefix) {
                deps.add(k);
            }
        });
        // clear array
        jsonPkg.dependencies = {};
        const sorted = [...deps].sort();
        sorted.forEach((v) => {
            jsonPkg.dependencies[v] = '*';
        });
        fs_1.default.writeFileSync('./package.json', JSON.stringify(jsonPkg, null, 2));
    }
    catch (e) {
        console.log(e);
    }
}
main();
