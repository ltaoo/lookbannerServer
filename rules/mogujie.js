var fs = require('fs');
var co = require('co');
var request = require('request');
var cheerio = require('cheerio');

// jsonp 函数
global.jsonp = function(res) {
  return res;
}

function get(val) {
  return new Promise((resolve, reject)=> {
    request(val, (err, res, body)=> {
      if(err) reject(err);
      resolve(body);
    })
  })
}

var web = {
  url: 'http://www.mogujie.com/',
  rule: function (body, cb) {
    co(function*() {
      //先拿到 html 中的 pid 
      var $ = cheerio.load(body);
      var pids = $('.schema_config');
      var jsCode = pids['0'].children[0];
      var pid = JSON.parse(jsCode.data).mSlider.sourceKey;
      // 拿到 pid 后，就可以发jsonp 请求获取图片地址

      var jsonpFun = yield get('http://mce.mogucdn.com/jsonp/multiget/3?callback=jsonp&pids='+pid);

      var res = global.eval(jsonpFun);

      // 获取图片地址
      var resultAry = [];
      res.data[pid].list.forEach(item=> {
        resultAry.push(item.image);
      })

      cb(resultAry);
    })
  }
}

function test(url, rule) {
  request(url, function (err, res, body) {
    if(!err && res.statusCode == 200) {
      // 如果获取页面成功
      //fs.writeFileSync(fullName, body)
      rule.call(null, body, function (ary) {
        console.log(ary)
      })
    }
  })
}

// test(web.url, web.rule);

exports.mogujie = web;