'use strict';

const exec = require('child_process').exec,
      msg = require('nl-clilog'),
      log4js = require('log4js'); 

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('stdout.log'), 'stdout');
const logger = log4js.getLogger('stdout');

module.exports = (cliStr, opt) => {
    return new Promise((resolve, reject) => {
        exec(cliStr, opt,function(error, stdout, stderr) {
            logger.trace('执行:'+cliStr);
            if (error) {
                logger.error(error);
                if(opt.comment){
                logger.error(opt.comment+'失败，请人工操作');
                }else{
                logger.error('异常退出');
                }
                reject(error);
            } else {
                logger.info(stdout);
                resolve(stdout);
            }
        });
    });
}
