'use strict';
const fetch = require('node-fetch');
const Parse = require('./parse');

const Data = Parse('pushConfig.json');

module.exports = {
    updateVersion: function(version, tag) {
        var tag = tag || 'z';
        var verList = version.split('.');
        tag == 'z' ? verList[2]++ : tag == 'y' ? verList[1]++ : tag == 'z' ? verList[0]++ : verList[2]++;
        var _version = verList.join('.');
        return _version;
    },

    compareVersion: function(v1, v2) {
        var patchPattern = /-([\w-.]+)/;

        function split(v) {
            var temp = v.split('.');
            var arr = temp.splice(0, 2);
            arr.push(temp.join('.'));
            return arr;
        }
        var s1 = split(v1);
        var s2 = split(v2);

        for (var i = 0; i < 3; i++) {
            var n1 = parseInt(s1[i] || 0, 10);
            var n2 = parseInt(s2[i] || 0, 10);

            if (n1 > n2) return 1;
            if (n2 > n1) return -1;
        }

        if ((s1[2] + s2[2] + '').indexOf('-') > -1) {
            var p1 = (patchPattern.exec(s1[2]) || [''])[0];
            var p2 = (patchPattern.exec(s2[2]) || [''])[0];

            if (p1 === '') return 1;
            if (p2 === '') return -1;
            if (p1 > p2) return 1;
            if (p2 > p1) return -1;
        }

        return 0;
    },

    
    getVersion: function(masterVersion, projectName) {
        return getTag(projectName)
            .then(res => {
                res = res.map(item => {
                    var arr = item.split('.'),
                        num = parseInt(item.replace(/\./g, ''));
                    return {
                        version: item,
                        arr: arr,
                        num: num
                    }
                })
                var mv = masterVersion.split('.');
                res = res.filter(item => {
                    return (mv[0] == item.arr[0]) && (mv[1] == item.arr[1])
                });
                return sortList('num', res)[0].version;
            })
    }

}


function getTag(projectName) {
    projectName = encodeURIComponent(projectName)
    return fetch('http://'+Data.gitlab+'/api/v3/projects/' + projectName + '/repository/branches?private_token='+Data.privateKey)
        .then(res => res.json())
        .then(res => {
            res = res.map(item => {
                //console.log(item.name);
                if (item.name.match(/daily\/(.+)/))
                    return item.name.match(/daily\/(.+)/)[1];
            });
            return res.filter(item => {
                return item;
            });
        })
        .catch(e => {
            console.log(e);
        })

}

function sortList(sortBy, list) {
    return list.sort(function(a, b) {
        var valueA, valueB;

        // 取出对应属性的值
        valueA = a[sortBy];
        valueB = b[sortBy];

        // 降序，若需要升序则互换两者位置
        return valueB - valueA;
    })
}
