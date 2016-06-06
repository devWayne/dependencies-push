const exec = require('child_process').exec,
      msg = require('nl-clilog');


module.exports = (cliStr, comment) => {
    return new Promise((resolve, reject) => {
        exec(cliStr, function(error, stdout, stderr) {
            msg.debug('执行:'+cliStr);
            if (error) {
                msg.error(error);
                msg.error(comment+'失败，请人工操作');
                reject(error);
            } else {
                msg.info('stderr:'+stderr);
                msg.info('stdout:'+stdout);
                resolve(stdout);
            }
        });
    });
}
