var fs = require('fs')
// third part
var request = require('request')
var cheerio = require('cheerio')
var _ = require('lodash')

var web = {
    url: 'http://music.163.com/discover',
    rule: function (body) {
      return new Promise((resolve, reject) => {
        var $ = cheerio.load(body)
        var data = $('#g_backtop')['0'].next.next.children[0].data
        //console.log(data)
        // 从字符串中使用正则提取出图片地址
        //var resultAry = data.match(/^(https|http)\\s(jpg|png)$/g, )
        // 因为内容是一个赋值语句，考虑将window.Gbanners = 修改成其他的
        data = data.replace(/window\.Gbanners/, 'var banners')
        // 然后执行这个字符串代码
        global.eval(data)
        // 现在就有了 banners 这个数组变量保存着banner
        // 提取出正确的 banner url 
        var resultAry = banners.map(function (obj) {
          return obj.picUrl
        })
        //console.log(resultAry)
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
        console.log(ary)
      })
    }
  })
}

// 遍历规则数据
//get(web.url, web.rule)

exports.cloudmusic = web
