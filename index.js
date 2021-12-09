'use strict';

const archiver = require('archiver-promise');
const fs = require('fs-extra');
const packlist = require('npm-packlist');
const path = require('path');
const sanitize = require('sanitize-filename');

function getPackageInfo(packageFile) {
    return fs.readFile(packageFile, 'utf-8')
        .then(content => JSON.parse(content))
        .catch(error => {
            console.error(`Failed to read ${packageFile}`);
            return Promise.reject(error);
        });
};

function getDefaultOutputFilename({ cwd, addVersion }) {
    const packageFile = path.join(cwd, 'package.json');
    return getPackageInfo(packageFile).then(packageInfo => `${sanitize(packageInfo.name)}${(addVersion) ? '-'+sanitize(packageInfo.version) : ''}.zip`);
};

function zipFiles(files, filename, source, destination, info, verbose) {
    const target = path.join(destination, filename);
    if (info)
        console.log(`Archive: ${target}`);

    let archive = archiver(target);
    files.forEach(file => {
        const filePath = path.join(source, file);
        if (verbose)
            console.log(file);
        archive.file(filePath, { name: file });
    });

    return archive.finalize();
};

function pack({ source, destination, info, verbose, addVersion, filename }) {
    return packlist({ path: source })
        .then(files => {
            return getDefaultOutputFilename({ cwd: source, addVersion })
                .then(packageName => {
                    if (destination && !fs.existsSync(destination)){
                        fs.mkdirSync(destination);
                    }
                    
                    filename = filename || packageName
                    
                    return zipFiles(files, filename, source, destination, info, verbose);
                });
        });
};

module.exports = {
    pack
};
