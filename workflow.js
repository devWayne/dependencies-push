'use strict';


const fs = require('fs'),
    _exec = require('./lib/cli'),
    format = require('./lib/format'),
    version = require('./lib/version'),
    series = require('./lib/series');


module.exports = {

    updateSvnload: function(chaoshi, muiInfo, svnBranch) {
        var chaoshiVersion, chaoshiName, chaoshiInfo;
        if (typeof chaoshi == 'string') {
            chaoshiName = chaoshi;
        } else {
            chaoshiInfo = chaoshi;
            chaoshiName = chaoshiInfo.name;
        }
        return _exec('git clone git@gitlab.alibaba-inc.com:tm/' + chaoshiName + '.git', 'clone ' + chaoshiName + '仓库')
            .then((res) => {
                return _exec('cd ' + chaoshiName + ' && tnpm i', '安装tnpm');
            })
            .then((res) => {
                const data = fs.readFileSync(chaoshiName + "/package.json", 'utf-8');
                const pkg = JSON.parse(data);
                if (typeof chaoshi == 'string') {
                    chaoshiVersion = pkg.version = version.updateVersion(pkg.version);
                } else {
                    chaoshiVersion = pkg.version = chaoshiInfo.version;
                }
                pkg.svnBranch = svnBranch;
                pkg.feDependencies[muiInfo.name] = muiInfo.version;
                fs.writeFile(chaoshiName + "/package.json", format(JSON.stringify(pkg)));
                return pkg;
            })
            .then((res) => {
                return _exec('cd ' + chaoshiName + ' && git checkout -b daily/' + chaoshiVersion, '新建分支');
            })
            .then((res) => {
                return _exec('cd ' + chaoshiName + ' && gulp svnload', '执行构建操作');
            })
            .then((res) => {
                return _exec('cd ' + chaoshiName + ' && git add --a && git commit -m updateVersion', '提交git commit');
            })
            .then((res) => {
                return _exec('cd ' + chaoshiName + ' && git push origin daily/' + chaoshiVersion, '提交git commit');
            })
            .catch((e) => {
                console.log(e);
            });
    },

    updateAllSvn: function(gitList, muiInfo, svnBranch) {
        const _pList = gitList.map((chaoshi, index) => {
            return this.updateSvnload(chaoshi, muiInfo, svnBranch)
        });
        series(_pList).then((res) => {
            console.log('－－－－－－－－－流程结束－－－－－－－－');
        });
    }

}
