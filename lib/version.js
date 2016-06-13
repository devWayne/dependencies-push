'use strict';


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
  
  getHighestVersion: function(versionList) {
    highestVersion = versionList.reduce(function(previous, current, index, array) {
      var flag = utils.compareVersion(previous, current);
      //console.log(previous + ' vs ' + current);

      if (flag < 0) {
        return current
      } else {
        return previous;
      }
    });
	return highestVersion;
  }
}



