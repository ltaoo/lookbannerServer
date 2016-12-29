var request = require('request');
var fs = require('fs');
var util = require('./lib/createfile.js');
// 修改成自动扫描添加require

function get(url, web, rule) {
  request(url, function (err, res, body) {
    if(!err && res.statusCode == 200) {
      var ary = rule.call(null, body, function (ary) {
        ary = util.transform(ary)
        ary.forEach(function (url) {
          console.log(web, url)
          //util.downloadImg(url, web, __dirname)
        })
      })
    }
  })
}

fs.readdir('./rules', (err, files)=> {
  if(err) return;
  files.forEach(file=> {
    var module = require('./rules/'+file);
    for(key in module) {
      get(module[key]['url'], key, module[key]['rule'])
    }
  })
})


