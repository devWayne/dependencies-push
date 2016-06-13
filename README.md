## 安装方式：

```
$sudo tnpm i -g dppush
```


## 使用方式

- 新建一个目录，用于存放升级过程中的仓库，配置和日志文件
- 编写配置文件，并保存为`pushConfig.json`

  - 配置文件实例如下：
  
```
{
    "gitList": ["chaoshi-history", 
    {
        "name": "chaoshi-liangfan",
        "version": "3.0.1"
    }],
    "muiInfo": {
        "name": "mui/chaoshi-base",
        "version": "4.2.34"
    },
    "svnBranch": "http://svn.app.taobao.net/repos/tmallwap/branches/20160606_695855_gulptest_1/"
}
```

- 执行`dppush`,在执行`tnpm i`等待时间较长，可能会误以为进程停止执行
- 验证方式：
  - 直接打开配置文件中的`svnBranch`，找到对应的seed文件进行验证
  - 打开当前目录下的`stdout.log`查看结构结果
  
## 配置文件详解

- `gitList`里存放`业务仓库`
  - 对象类型可以是2种，如果是`String`类型的，默认升级一个小版本，如`4.0.3=>4.0.4`.
  - 如果是`Object`类型，必须包含`name`和`version`
- `muiInfo`里存放`需要同步版本的组件`,必须包含`name`和`version`


## TodoList
- `muiInfo`支持数组，同时可升级多个组件
- 纵向依赖分析，组件升级
