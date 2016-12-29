var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

var web = {
  url: 'https://www.amazon.cn',
  rule: function (body, cb) {
    //fs.writeFileSync('amazon.html', body, 'utf8')
    var $ = cheerio.load(body)
    var resultAry = []
    request.post({url:'https://www.amazon.cn/gp/atfauto/get-slides-auto.html', form: {
      pageName: 'ATF',
      rId: '886V1QZ9NMAYWZB54EX4',
      firstImg: 'kindle/2016/zhangr/Autumn/Autumn-Theme-PC-02-1500x300',
      reftag: 'asw1_',
      firstHref: '/dp/B0186FESGW'
    }}, function(err, httpResponse, body){
      if(err) throw err
      var contents = JSON.parse(body).contents 
      contents.forEach(function (node) {
        var $$ = cheerio.load(node)
        var img = $$('img')['0']
        if(img.attribs.srcdata) {
          // 如果存在 srcdata 属性
          resultAry.push(img.attribs.srcdata)
        }else if(img.attribs.src) {
          resultAry.push(img.attribs.src)
        }
      })
      cb(resultAry)
    })
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

exports.amazon = web
