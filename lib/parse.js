'use strict';
const fs = require('fs');
const path = require('path');

/**
 * @param {varType} file Description
 * @return {void} description
 */
module.exports = (file) => {
    const configPath = path.resolve(process.cwd(), file);
    const config = JSON.parse(fs.readFileSync(configPath));


    return {
        gitList : config.gitList,
        muiInfo : config.muiInfo,
        svnBranch: config.svnBranch
    }
}

