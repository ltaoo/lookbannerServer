var cheerio = require('cheerio');
var request = require('request');

var web = {
  url: 'http://emart.ssg.com/',
  rule: function (body, cb) {
    var $ = cheerio.load(body);
    var imgs = $('img', '#_main_banner');
    // 获取图片地址
    var resultAry = [];
    for(let i = 0, len = imgs.length; i < len; i++) {
      // 遍历
      resultAry.push(imgs[i].attribs.src);
    }
    cb(resultAry)
  }
}

function get(url, rule) {
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

// get(web.url, web.rule)

exports.emart = web;
