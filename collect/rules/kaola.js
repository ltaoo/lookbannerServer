var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

var web = {
  url: 'http://www.kaola.com/getPCBannerList.html',
  rule: function (body, cb) {
    var resultAry = [];
    var result = JSON.parse(body);
    result.body.bannerList.forEach((item, index)=> {
      resultAry.push(item.imageUrl);
    })
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

// 最好是能够只运行一次函数，而不需要多次添加，所以需要用到数组
  // web 是有 url 和 rule 属性的对象
//get(web.url, web.rule)

exports.kaola = web;
