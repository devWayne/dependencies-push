'use strict';


const fs = require('fs'),
    _exec = require('./lib/cli'),
    format = require('./lib/format'),
    version = require('./lib/version');


const Map = require('promise.map');

module.exports = {

    pushPublish: function(chaoshi) {
        var chaoshiVersion, chaoshiName, chaoshiInfo;
        if (typeof chaoshi == 'string') {
            chaoshiName = chaoshi;
        } else {
            chaoshiInfo = chaoshi;
            chaoshiName = chaoshiInfo.name;
        }


        const data = fs.readFileSync(chaoshiName + "/package.json", 'utf-8');
        const pkg = JSON.parse(data);

        if (typeof chaoshi == 'string') {
            chaoshiVersion = pkg.version;
        } else {
            chaoshiVersion = pkg.version = chaoshiInfo.version;
        }

        return _exec('git tag publish/' + chaoshiVersion, {
                cwd: chaoshiName,
                comment: '生成tag'
            })
            .then((res) => {
                return _exec('git push origin publish/' + chaoshiVersion, {
                    cwd: chaoshiName,
                    comment: '发布tag'
                });
            })

    },


    updateSvnload: function(chaoshi, muiInfo, svnBranch) {
        var chaoshiVersion, chaoshiName, chaoshiInfo;
        if (typeof chaoshi == 'string') {
            chaoshiName = chaoshi;
        } else {
            chaoshiInfo = chaoshi;
            chaoshiName = chaoshiInfo.name;
        }
        return _exec('git clone git@gitlab.alibaba-inc.com:tm/' + chaoshiName + '.git', {
                comment: 'clone ' + chaoshiName + '仓库'
            })
            .then((res) => {
                return _exec('tnpm i --cache-min 99', {
                    cwd: chaoshiName,
                    comment: '安装依赖'
                });
            })
            .then((res) => {
                const data = fs.readFileSync(chaoshiName + "/package.json", 'utf-8');
                const pkg = JSON.parse(data);

                /**
                 * 修改频道页版本号和svn路径
                 */
                return version.getVersion(pkg.version, 'tm/' + chaoshiName)
                    .then(resVersion => {
                        if (typeof chaoshi == 'string') {

                            chaoshiVersion = pkg.version = version.updateVersion(resVersion);
                            console.log('升级版本: '+chaoshiVersion);
                        } else {
                            chaoshiVersion = pkg.version = chaoshiInfo.version;
                        }

                        pkg.svnBranch = svnBranch;

                        /**
                         * 判断修改的mui组件是否是一个数组列表
                         */
                        if (muiInfo.length) {
                            muiInfo.forEach((muiItem, idx) => {
                                if (pkg.feDependencies[muiItem.name]) {
                                    pkg.feDependencies[muiItem.name] = muiItem.version;
                                }
                            });
                        } else {
                            if (pkg.feDependencies[muiInfo.name]) {
                                pkg.feDependencies[muiInfo.name] = muiInfo.version;
                            }
                        }
                        fs.writeFile(chaoshiName + "/package.json", format(JSON.stringify(pkg)));
                        return pkg;
                    })
            })
           .then((res) => {
                return _exec('git checkout -b daily/' + chaoshiVersion, {
                    cwd: chaoshiName,
                    comment: '新建分支'
                })
            })
            .then((res) => {
                return _exec('gulp svnload', {
                    cwd: chaoshiName,
                    comment: '执行构建操作'
                });
            })
            .then((res) => {
                return _exec('git add --a && git commit -m updateVersion', {
                    cwd: chaoshiName,
                    comment: '提交git commit'
                });
            })
            .then((res) => {
                return _exec('git push origin daily/' + chaoshiVersion, {
                    cwd: chaoshiName,
                    comment: '提交git commit'
                });
            })
            .catch((e) => {
                console.log(e);
            });
    },

    updateAllSvn: function(gitList, muiInfo, svnBranch, concurrency) {
        var concurrency = concurrency || 3;

        return Map(gitList, (chaoshi, index) => {
            return this.updateSvnload(chaoshi, muiInfo, svnBranch)
        }, concurrency).then((res) => {
            console.log('－－－－－－－－－推送流程结束－－－－－－－－');
        });

    },

    publishAll: function(gitList, concurrency) {
        var concurrency = concurrency || 3;
        return Map(gitList, (chaoshi, index) => {
            return this.pushPublish(chaoshi);
        }, concurrency).then((res) => {
            console.log('－－－－－－－－－发布流程结束－－－－－－－－');
        });

    }

}
