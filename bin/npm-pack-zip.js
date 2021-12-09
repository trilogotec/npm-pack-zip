#!/usr/bin/env node

'use strict';

const console = require('console');
const {pack} = require('../index');

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
  .option('filename', {
    alias: 'f',
    default: '',
  })
  .option('add-version', {
    alias: 'ver',
    default: false,
  })
  .option('info', {
    alias: 'i',
    default: false,
  })
  .option('verbose', {
    alias: 'v',
    default: false,
  })
  .argv;

const source = argv.source;
const destination = argv.destination;
const filename = argv.filename;
const info = argv.info;
const verbose = argv.verbose;
const addVersion = argv.addVersion;
pack({source, destination, info, verbose, addVersion, filename})
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
