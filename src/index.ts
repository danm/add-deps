#!/usr/bin/env node

import depcheck from 'depcheck';
import fs from 'fs';

async function main () {
  const prefix = process.argv[2];

  try {
    const pkg = fs.readFileSync('./package.json', { encoding: 'utf8' });
    const jsonPkg = JSON.parse(pkg);
  
    const data = await depcheck('./', { package: jsonPkg });
    const deps: Set<string> = new Set();

    Object.keys(data.missing).forEach((k: string) => {
      if (prefix && k.indexOf(prefix) === 0) {
        deps.add(k);
      } else if (!prefix) {
        deps.add(k);
      }
    });

    Object.keys(data.using).forEach((k: string) => {
      if (prefix && k.indexOf(prefix) === 0) {
        deps.add(k);
      } else if (!prefix) {
        deps.add(k);
      }
    });

    // clear array
    jsonPkg.dependencies = {};

    const sorted = [...deps].sort();
    sorted.forEach((v: string) => {
      jsonPkg.dependencies[v] = '*';
    });

    fs.writeFileSync('./package.json', JSON.stringify(jsonPkg, null, 2));
  } catch (e) {
    console.log(e);
  }
}

main();
