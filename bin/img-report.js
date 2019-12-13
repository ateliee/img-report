#!/usr/bin/env node
'use strict';

const program = require('commander')
const pkg = require('../package.json')
const spawn = require('child_process').spawn;
const execSync = require('child_process').execSync;
const path = require('path');
const file = require('../lib/file');
const logger = require('../lib/logger');

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

        logger.info('with:');
        logger.info('  - source:', src_path);
        logger.info('  - dist:', dist_path);
        logger.info('  - force:', force);
        logger.info('  - report:', report);
        logger.info('  - config:', opts.config);

        let config = null;
        let resemble_config = null;
        if(config_path){
            config = require(config_path);
            logger.info('config with:');
            logger.info(config);

            if(config.Resemble !== undefined){
                resemble_config = config.Resemble;
            }
        }

        await file.genearteDiffImages(
            src_path,
            dist_path,
            force,
            resemble_config
        );
        if(report){
            const result =  execSync('node '+__filename+' build -s '+src_path+' -d '+dist_path).toString();
            logger.info(result);
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
        logger.info('with:');
        logger.info('  - options.source:', opts.source);
        logger.info('  - options.dist:', opts.dist);
        logger.info('  - webpack config:', config_path);

        let proc = spawn('webpack', ['--config', config_path, '--env.assets='+opts.source, '--env.diff='+opts.dist]);
        logger.info("child:" + proc.pid);
        proc.stdout.on('data', (data) => {
            logger.info(data.toString());
        });
        proc.stderr.on('data', (data) => {
            logger.info(data.toString());
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
        logger.info('with:');
        logger.info('  - options.source:', opts.source);
        logger.info('  - options.dist:', opts.dist);
        logger.info('  - webpack config:', config_path);

        let proc = spawn('webpack-dev-server', ['--config', config_path, '--env.assets='+opts.source, '--env.diff='+opts.dist]);
        logger.info("child:" + proc.pid);
        proc.stdout.on('data', (data) => {
            logger.info(data.toString());
        });
        proc.on('exit', function(){
            process.exit(0);
        });
    })
;
program.parse(process.argv);