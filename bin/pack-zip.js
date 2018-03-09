#!/usr/bin/env node

'use strict';

const console = require('console');
const { pack } = require('../index');

const argv = require('yargs')
    .usage('Usage: $0 --src [source] --dst [destination]')
    .option('source', {
        alias: 'src',
        default: '',
    })
    .option('destination', {
        alias: 'dst',
        default: '',
    })
    .option('info', {
        alias: 'i',
        default: false,
    })
    .argv;

const source = argv.source;
const destination = argv.destination;
const info = argv.info;
pack({ source, destination, info })
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
