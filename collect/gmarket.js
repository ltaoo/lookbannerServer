var request = require('request');
var cheerio = require('cheerio');

var web = {
  url: 'http://www.gmarket.co.kr/',
  rule: function(body, cb) {
      var $ = cheerio.load(body);
      var script = $('script')['23'];
      // console.log(script);
      var str = script.children[0].data;

      // 使用正则提取出图片地址
      var ary = str.match(/[a-zA-z]+:\/\/[^\s]*.JPG/g);
      cb(ary);
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
    else {
      console.log(err);
    }
  })
}

test(web.url, web.rule);

exports.gmarket = web;