var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

var web = {
  url: 'http://e.youku.com/',
  rule: function (body, cb) {
    // fs.writeFileSync('youku.html', body, 'utf8')
    var $ = cheerio.load(body)
    let imgs = $('img', '.pic-box', body)
    var resultAry = []
    for(let i = 0, len = imgs.length; i < len; i++) {
      resultAry.push(imgs[i].attribs.src + '.jpg')
    }
    cb(resultAry)
  }
}


function get(url, rule) {
  request(url, function (err, res, body) {
    if(!err && res.statusCode == 200) {
      rule.call(null, body, function (ary) {
        console.log(ary)
      })
    }
  })
}

// get(web.url, web.rule)

exports.youku = web
