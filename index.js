const _exec = require('./lib/cli'),
      format = require('./lib/format');




_exec('cd test && git clone git@gitlab.alibaba-inc.com:tm/chaoshi-history.git','clone chaoshi-history仓库')
    .then((res)=>{
        return res;
        //_exec('cd test/chaoshi-history && tnpm i','安装tnpm');
    })
    .then((res)=>{
        console.log(__dirname);
        const pkg = fs.readFileSync("package.json", 'utf-8');
        console.log(pkg);
        //fs.writeFile("package.json", format(JSON.stringify(pkg))
    });
