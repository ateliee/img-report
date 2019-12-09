#!/usr/bin/env node
'use strict';

const program = require('commander')
const path = require('path');
const file = require('../lib/file');

program
    .usage('-s source_asset ')
    .requiredOption('-s, --source <value>', 'source assets directory path', String)
    .requiredOption('-d, --dist <value>', 'dist directory path', String)
    .option('-f, --force', 'Force Delete Dir', Boolean)
    .parse(process.argv)

let src = path.join(process.cwd(), program.source)
let dist = path.join(process.cwd(), program.dist)

console.log('with:');
console.log('  - source ', src);
console.log('  - dist ', dist);
if (program.force) console.log('  - force');

file.genearteDiffImages(
    src,
    dist,
    program.force
);