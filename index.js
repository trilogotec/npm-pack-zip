'use strict';

const archiver = require('archiver');
const fs = require('fs-extra');
const packlist = require('npm-packlist');
const path = require('path');

function getPackageInfo(packageFile) {
    return fs.readFile(packageFile, 'utf-8')
        .then(content => JSON.parse(content))
        .catch(error => {
            console.error(`Failed to read ${packageFile}`);
            return Promise.reject(error);
        });
};

function getDefaultOuputFilename({ cwd }) {
    const packageFile = path.join(cwd, 'package.json');
    return getPackageInfo(packageFile).then(packageInfo => `${packageInfo.name}.zip`);
};

function zipFiles(files, filename, destination, info, verbose) {
    const target = path.join(destination, filename);
    if (info)
        console.log(`Archive: ${target}`);

    let archive = archiver.create('zip');
    archive.on('error', error => { throw error; });
    archive.pipe(fs.createWriteStream(target)).on('end', () => resolve());
    files.forEach(file => {
        if (verbose)
            console.log(file);
        archive.file(file, { name: file });
    });

    archive.finalize();
};

function pack({ source, destination, info, verbose }) {
    return packlist({ path: source })
        .then(files => {
            return getDefaultOuputFilename({ cwd: source })
                .then(filename => {
                    zipFiles(files, filename, destination, info, verbose);
                });
        });
};

module.exports = {
    pack
};
