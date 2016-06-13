'use strict';

const exec = require('child_process').exec,
      msg = require('nl-clilog'),
      log4js = require('log4js'); 

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('stdout.log'), 'stdout');
const logger = log4js.getLogger('stdout');

module.exports = (cliStr, comment) => {
    return new Promise((resolve, reject) => {
        exec(cliStr, function(error, stdout, stderr) {
            logger.trace('执行:'+cliStr);
            if (error) {
                logger.error(error);
                logger.error(comment+'失败，请人工操作');
                reject(error);
            } else {
                logger.info(stdout);
                resolve(stdout);
            }
        });
    });
}
