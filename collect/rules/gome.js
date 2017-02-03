var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

var fullName = 'page.html'

var web = {
  url: 'http://www.gome.com.cn/',
  rule: function (body, cb) {
    return new Promise((resolve, reject) => {

      //fs.writeFileSync('gome.html', body, 'utf8')
      var $ = cheerio.load(body)
      var resultAry = []
      var data = $('a', '.slide-ul')
      //console.log(data)
      //console.log(data.length)
      var i = 0
      while(i < data.length) {
        // 有一个 script 标签的情况

        // li 标签上有颜色
        var img = data[i].children[0]
        if(img && img.attribs['data-src']) {
          resultAry.push(img.attribs['data-src'])
        }else if(img && img.attribs['src']) {
          resultAry.push(img.attribs['src'])
        }
        i += 1
      }
      // 还有两张在 script标签里
      var script = $('script', '.slide-ul', body)
      if(script.length) {
        var code = script['0'].children[0].data
        global.eval(code)
        fcous_data['data'].forEach(function (obj) {
          resultAry.push(obj.src)
        })
      }

      resolve(resultAry)
    })
  }
}


function get(url, rule) {
  request(url, function (err, res, body) {
    if(!err && res.statusCode == 200) {
      // 如果获取页面成功
      //fs.writeFileSync(fullName, body)
      rule.call(null, body, function (ary) {
        //console.log(ary)
      })
    }
  })
}

// 最好是能够只运行一次函数，而不需要多次添加，所以需要用到数组
  // web 是有 url 和 rule 属性的对象
//get(web.url, web.rule)

exports.gome = web
