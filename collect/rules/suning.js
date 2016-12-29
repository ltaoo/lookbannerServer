var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

var fullName = 'page.html'

var web = {
  url: 'http://www.suning.com/',
  rule: function (body, cb) {
    var $ = cheerio.load(body)
    var resultAry = []
    //console.log($('script', '.first-screen'))
    var data = $('script', '.first-screen')['0'].children[0].data
    //console.log(data)
    // 从字符串中使用正则提取出图片地址
    // 可以这么做，但是就没有一些图片信息了，比如图片文档，图片背景色等
    //var resultAry = data.match(/^(https|http)\\s(jpg|png)$/g, )
    // 因为内容是一个赋值语句，考虑将window.Gbanners = 修改成其他的
    data = data.replace(/(var bannerhtml = '';)(\d|\D)+/, '')
    // 然后执行这个字符串代码
    //console.log(data)
    global.eval(data)
    // 现在就有了 banners 这个数组变量保存着banner
    // 提取出正确的 banner url 
    //console.log(bannerImg)
    bannerImg.forEach(function (ary) {
      if(ary.length) {
        ary.forEach(function (obj) {
          resultAry.push(obj.imgUrl)
        })
      }
    })

    cb(resultAry)

    //console.log(resultAry)
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


exports.suning = web

