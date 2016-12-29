var request = require('request');
var fs = require('fs');
var path = require('path');
var util = require(path.join(__dirname, './lib/createfile.js'));

function get(url, web, rule) {
  request(url, function (err, res, body) {
    if(!err && res.statusCode == 200) {
      var ary = rule.call(null, body, function (ary) {
        ary = util.transform(ary)
        ary.forEach(function (url) {
          //console.log(url)
          util.downloadImg(url, web, __dirname)
        })
      })
    }
  })
}

// 修改成自动扫描添加require
fs.readdir(path.join(__dirname, './rules'), (err, files)=> {
  if(err) return;
  files.forEach(file=> {
    var module = require(path.join(__dirname, './rules/', file));
    for(key in module) {
      get(module[key]['url'], key, module[key]['rule'])
    }
  })
})

