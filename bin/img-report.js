#!/usr/bin/env node
'use strict';

const program = require('commander')
const pkg = require('../package.json')
const spawn = require('child_process').spawn;
const execSync = require('child_process').execSync;
const path = require('path');
const file = require('../lib/file');

// process.on('unhandledRejection', console.dir);
program
    .version(pkg.version || '0.1.0');
// diff image create
program
    .command('diff <src> <dist>')
    .description('create image diff.')
    .option('-c, --config <value>', 'Resemble.js Config File Path.', String)
    .option('-f, --force', 'Force Delete Dir', Boolean)
    .option('-r, --report', 'Create report file.', Boolean)
    .action(async function (src, dist, opts) {
        let force = (opts.force !== undefined)
        let report = (opts.report !== undefined)
        let src_path = path.resolve(process.cwd(), src)
        let dist_path = path.resolve(process.cwd(), dist)
        let config_path = (opts.config !== undefined) ? path.resolve(process.cwd(), opts.config) : ''

        console.log(opts)
        console.log('with:');
        console.log('  - source:', src_path);
        console.log('  - dist:', dist_path);
        console.log('  - force:', force);
        console.log('  - report:', report);
        console.log('  - config:', opts.config);

        let config = null;
        if(config_path){
            config = require(config_path);
            console.log(config);
        }

        await file.genearteDiffImages(
            src_path,
            dist_path,
            force,
            config_path
        );
        if(report){
            const result =  execSync('node '+__filename+' build -s '+src_path+' -d '+dist_path).toString();
            console.log(result);
        }
    })
;
// build
program
    .command('build')
    .description('build report.')
    .requiredOption('-s, --source <value>', 'source assets directory path', String)
    .requiredOption('-d, --dist <value>', 'dist directory path', String)
    .action(async function (opts) {
        let config_path = path.resolve(__dirname, '../webpack.config.js')
        console.log('with:');
        console.log('  - options.source:', opts.source);
        console.log('  - options.dist:', opts.dist);
        console.log('  - webpack config:', config_path);

        let proc = spawn('webpack', ['--config', config_path, '--env.assets='+opts.source, '--env.diff='+opts.dist]);
        console.log("child:" + proc.pid);
        proc.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        proc.stderr.on('data', (data) => {
            console.log(data.toString());
        });
        proc.on('exit', function(){
            process.exit(0);
        });
    })
;
// serve
program
    .command('serve')
    .description('local server run.')
    .requiredOption('-s, --source <value>', 'source assets directory path', String)
    .requiredOption('-d, --dist <value>', 'dist directory path', String)
    .action(async function (opts) {
        let config_path = path.resolve(__dirname, '../webpack.config.js')
        console.log('with:');
        console.log('  - options.source:', opts.source);
        console.log('  - options.dist:', opts.dist);
        console.log('  - webpack config:', config_path);

        let proc = spawn('webpack-dev-server', ['--config', config_path, '--env.assets='+opts.source, '--env.diff='+opts.dist]);
        console.log("child:" + proc.pid);
        proc.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        proc.on('exit', function(){
            process.exit(0);
        });
    })
;
program.parse(process.argv);