const fs = require('fs'),
    _exec = require('./lib/cli'),
    format = require('./lib/format'),
    version = require('./lib/version');


module.exports = {
    /*
        updateSvnLoad: (chaoshi, svnBranch) => {
            _exec('cd test && git clone git@gitlab.alibaba-inc.com:tm/' + chaoshi + '.git', 'clone ' + chaoshi + '仓库')
                .then((res) => {
                    return res;
                    // _exec('cd test/chaoshi-history','安装tnpm');
                })
                .then((res) => {
                    console.log(__dirname);
                    const data = fs.readFileSync("test/" + chaoshi + "/package.json", 'utf-8');
                    const pkg = JSON.parse(data);
                    var _version = version.updateVersion(pkg.version);
                    pkg.svnBranch = svnBranch;
                    fs.writeFile("test/" + chaoshi + "/package.json", format(JSON.stringify(pkg)));
                    return pkg;
                })
                .then((res) => {
                    _exec('cd test/' + chaoshi + ' && gulp svnload', '执行构建操作');
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }*/
}

function updateSvnLoad(chaoshi, svnBranch) {
    _exec('cd test && git clone git@gitlab.alibaba-inc.com:tm/' + chaoshi + '.git', 'clone ' + chaoshi + '仓库')
        .then((res) => {
           return _exec('cd test/'+chaoshi+' && tnpm i','安装tnpm');
        })
        .then((res) => {
            console.log(__dirname);
            const data = fs.readFileSync("test/" + chaoshi + "/package.json", 'utf-8');
            const pkg = JSON.parse(data);
            var _version = version.updateVersion(pkg.version);
            pkg.svnBranch = svnBranch;
            fs.writeFile("test/" + chaoshi + "/package.json", format(JSON.stringify(pkg)));
            return pkg;
        })
        .then((res) => {
            _exec('cd test/' + chaoshi + ' && gulp svnload', '执行构建操作');
        })
        .catch((e) => {
            console.log(e);
        });
}



updateSvnLoad('chaoshi-history', 'http://svn.app.taobao.net/repos/tmallwap/branches/20160606_695855_gulptest_1/');
