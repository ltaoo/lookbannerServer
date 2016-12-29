var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')


global['cb'] = function (data) {
  return data
}
var web = {
  url: 'https://www.taobao.com/',
  rule: function (body, cb) {
    //fs.writeFileSync('taobao.html', body, 'utf8')
    var $ = cheerio.load(body)
    var resultAry = []
    var data = $('.mod', '.promo-bd')
    //console.log(data)
    //console.log(data.length)
    //var reqUrl = 'https://ecpm.tanx.com/ex?i=mm_12852562_1778064_13672849&cb=jsonp_callback_21951&r=&cg=a1268884a59e6184e801da1e3d9f4e94&pvid=c16865ef94b23219e287e289d56c73cb&u=https%3A%2F%2Fwww.taobao.com%2F&psl=1&nk=37%2C53%2C67%2C117%2C53%2C50%2C49%2C68%2C37%2C53%2C67%2C117%2C53%2C49%2C70%2C65%2C37%2C53%2C67%2C117%2C53%2C67%2C55%2C49%2C37%2C53%2C67%2C117%2C54%2C55%2C57%2C55&sk=&fp=1.Hav1F6jcqsp241eOwh8UaTovubSKb8F6W1hROESuR~Wasog7Gf8XiN.UTF-8.hu2lztSK_gBAtByID_hEI0DmqgiayA.Q.do4jn3'
    var mmAry = []
    var i = 0
    while(i < data.length) {
      // 获取到 data id
      //console.log(data[i])
      var appId = data[i].attribs['data-id']
      //console.log(appId)
      if(appId.indexOf('m') == -1) {
        // 如果不存在 m ，就是 直接 id 的形式，这种数据存在 data-src 上
        var img = data[i].children[1].children[1]
        // console.log(img)
        if(img.attribs['data-src']) {
          resultAry.push(img.attribs['data-src'])
        }else if(img.attribs['src']) {
          resultAry.push(img.attribs['src'])
        }
      }else {
        mmAry.push(appId)
      }
      // li 标签上有颜色
      i += 1
    }
    // 在 while 循环外请求
    // 要发 get 请求返回图片地址
    var j = 0
    mmAry.forEach(function (appId) {
      var url = 'https://ecpm.tanx.com/ex?i=' + appId + '&cb=cb&r=&cg=a1268884a59e6184e801da1e3d9f4e94&pvid=c16865ef94b23219e287e289d56c73cb&u=https%3A%2F%2Fwww.taobao.com%2F&psl=1&nk=37%2C53%2C67%2C117%2C53%2C50%2C49%2C68%2C37%2C53%2C67%2C117%2C53%2C49%2C70%2C65%2C37%2C53%2C67%2C117%2C53%2C67%2C55%2C49%2C37%2C53%2C67%2C117%2C54%2C55%2C57%2C55&sk=&fp=1.Hav1F6jcqsp241eOwh8UaTovubSKb8F6W1hROESuR~Wasog7Gf8XiN.UTF-8.hu2lztSK_gBAtByID_hEI0DmqgiayA.Q.do4jn3'
      request(url, function (err, res, body) {
        var img = global.eval(body)
        resultAry.push(img.data)
        j += 1

        if(j === mmAry.length) {
          cb(resultAry)
        }
      })
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

exports.taobao = web
