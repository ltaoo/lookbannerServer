// import fs from 'fs'
const fs = require('fs')

// import request from 'request'
const request = require('request')
// import cheerio from 'cheerio'
const cheerio = require('cheerio')

const web = {
  url: 'https://www.amazon.cn',
  rule: function (body) {
    return new Promise((resolve, reject) => {
      const $ = cheerio.load(body)
      let resultAry = []
      // 抓取页面
      request.post({
        url: 'https://www.amazon.cn/gp/atfauto/get-slides-auto.html', 
        form: {
          pageName: 'ATF',
          rId: '886V1QZ9NMAYWZB54EX4',
          firstImg: 'kindle/2016/zhangr/Autumn/Autumn-Theme-PC-02-1500x300',
          reftag: 'asw1_',
          firstHref: '/dp/B0186FESGW'
        }
      }, function(err, httpResponse, body){
        if(err) reject(err)
        // 获取到内容
        let contents = JSON.parse(body).contents 
        contents.forEach(function (node) {
          const $$ = cheerio.load(node)
          // 图片节点
          const img = $$('img')['0']
          if(img.attribs.srcdata) {
            // 如果存在 srcdata 属性
            resultAry.push(img.attribs.srcdata)
          }else if(img.attribs.src) {
            resultAry.push(img.attribs.src)
          }
        })
        resolve(resultAry)
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


exports.amazon = web
