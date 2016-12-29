var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

var web = {
  url: 'http://www.yhd.com/',
  rule: function (body, cb) {
    //fs.writeFileSync('yhd.html', body, 'utf8')
    var $ = cheerio.load(body)
    var resultAry = []
    var data = $('img', '#slider')
    //console.log(data)
    //console.log(data.length)
    var i = 0
    while(i < data.length) {
      // li 标签上有颜色
      var img = data[i]
      resultAry.push(img.attribs['wi'])
      i += 1
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

// 最好是能够只运行一次函数，而不需要多次添加，所以需要用到数组
  // web 是有 url 和 rule 属性的对象
//get(web.url, web.rule)

exports.yhd = web
