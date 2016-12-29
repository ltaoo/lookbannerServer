var fs = require('fs')
// third part
var request = require('request')
var cheerio = require('cheerio')
var _ = require('lodash')

// 一个全局的函数，用来获取到 jsonp 返回的数据
global['jsonp_1735607'] = function (res) {
  return res
}
global['tanxCallback'] = function (res) {
  return res
}

var web= {
    url: 'https://www.tmall.com',
    rule: function (body, cb) {
      var obj = this
      // 用来保存最终的地址
      var resultAry = []
      // 用来保存 appId
      var idAry = []
      var tanxId = []
      var $ = cheerio.load(body)
      // 首先是获取到 appId
      // 还可以获取到 tanxId
      var defaultData = JSON.parse($('#J_defaultData')['0'].children[0].data)
      defaultData.page['100']['mainBannerSwitch'].forEach(function (obj) {
        if(obj.tanxId) {
          tanxId.push(obj.tanxId)
        }


        if(obj.appIds.length > 0) {
          // 如果有 appId
          obj.appIds.forEach(function (o) {
            if(o.appId.length !== 0) {
              idAry.push(o.appId)
            }
          })
        }
      })
      //defaultData.mockPage['100']['mainBannerSwitch'].forEach(function (obj) {
        //if(obj.tanxId) {
          //tanxId.push(obj.tanxId)
        //}
        //if(obj.appIds.length > 0) {
          // 如果有 appId
          //obj.appIds.forEach(function (o) {
            //if(o.appId.length !== 0) {
              //idAry.push(o.appId)
            //}
          //})
        //}
      //})
      //console.log(defaultData)
      idAry.push('07055')
      idAry.push('201602266')
      idAry = _.uniq(idAry)

      // 能不能将所有appId 都加到链接中？
      var dataUrl = 'https://aldh5.tmall.com/recommend2.htm?&appId=' + idAry.join(',') + '&callback=jsonp_1735607'
      //console.log(dataUrl)
      //var dataUrl = 'https://aldh5.tmall.com/recommend2.htm?&appId=201602265,201602267,07055,201602266,2016030118,09044,201605170,201606279,2016062710&callback=jsonp_1735607'
      //var data = null
      // 进行请求
      request(dataUrl, function (err, res, body) {
        if(!err && res.statusCode == 200) {
          // 如果获取页面成功
          //fs.writeFileSync(fullName, body)
          //rule.call(null, body)
          //console.log(body)
          var data = global.eval(body)
          //console.log(data)
          // 这里获取到了数据，根据 tmall 自己的 js 文件的规则来提取出正确的 banner
          // 其实这里应该要对保存着 appId 的数组做循环
          idAry.forEach(function(id) {
            // 首先判断这个 id 对应的 data 是否存在
            if(data[id] && data[id].data) {
              var bannerList = data[id].data
              // 提取出 mainBanner 
              bannerList.forEach(function(img) {
                //console.log(img.contentType)
                if(img.contentType === 'banner' || img.bgColor) {
                  // 这里应该可以提取出三张
                  resultAry.push(img.imgUrl)
                }
              })
            }
          })
          //console.log(data['07055'].data)
          // 还有一张在 201602266
        }
        //console.log(resultAry)

        // 完成了一种 banner 的提取，还有另一种banner
        var item = $('.j_tanxItem')['0'].attribs.id.replace(/tanx-a-/, '')
        //console.log(item)
        tanxId.push(item)
        tanxId = _.uniq(tanxId)
        var n = 0;
        tanxId.forEach(function(id, index) {
          // 带了后面的参数，返回的图片就是不同的
          // 需要了解后面的参数生成规则
          var url = 'https://ecpm.tanx.com/ex?i=' + id + '&cb=tanxCallback&cg=a97a12dbdeb0837763d3de68247c1440&pvid=f7a01e9ecd55d52e769b29b9dd014f04&u=https%3A%2F%2Fwww.tmall.com%2F&psl=1&nk=37%2C53%2C67%2C117%2C53%2C50%2C49%2C68%2C37%2C53%2C67%2C117%2C53%2C49%2C70%2C65%2C37%2C53%2C67%2C117%2C53%2C67%2C55%2C49%2C37%2C53%2C67%2C117%2C54%2C55%2C57%2C55&sk=&fp=1.Kdg2YSt2o6bTB_yLGK0M_233UjFU3pjbIB072fZRzgZIw5D2Ia0-xM.UTF-8.pSampnAuC2CGA2MHQGMD2EC0bBQcqQMP-EYdQfE1AwuSA.Q.1lff71'
          //console.log(url)
          request(url, function (err, res, body) {
            if(!err && res.statusCode == 200) {
              //console.log(body)
              // 如果获取页面成功
              var data = global.eval(body)
              // 将图片加入 resultAry
              resultAry.push(data.data)
            }
            //console.log(resultAry)
            n += 1
            if(n === 3) {
              //console.log(resultAry)
              //return resultAry
              cb(resultAry)
            }
          })
        })
      })
    }
}


function get(url, rule) {
  request(url, function (err, res, body) {
    if(!err && res.statusCode == 200) {
      // 如果获取页面成功
      //fs.writeFileSync(fullName, body)
      var ary = rule.call(null, body, function (ary) {
        console.log(ary)
      })
    }
  })
}

//get(web.url, web.rule)
exports.tmall = web

