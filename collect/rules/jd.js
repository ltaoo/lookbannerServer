// third part
import request from 'request'
import cheerio from 'cheerio'
import _ from 'lodash'

function req(url) {
  return new Promise((resolve, reject)=> {
    request(url, function(err, res) {
      if(err) reject(err);
      resolve(res.body);
    })
  })
}

global.jsonpCallbackFocus = function(res) {
  return res
}

const web = {
    url: 'https://www.jd.com',
    rule(body) {
      return new Promise(async function (resolve, reject) {
        const $ = cheerio.load(body)
        // 从 html 中提取
        // 首先拿到前四个
        let first = $('body')['0'].children[0].next.children[0].data
        // 全局执行，就有了 pageConfig.focusData 这个变量，保存着数组
        global.eval('var pageConfig = {};')
        global.eval(first)
        // 再去拿后面四个
        let url = 'http://f.3.cn/index-floor?argv=focus&callback=jsonpCallbackFocus'
        try{
          var res = await req(url)
          let ary = global.eval(res)
          
          let resultAry = []
          ary.data.forEach(item=> {
            item.forEach(img=> {
              resultAry.push(img.src)
            })
          })

          pageConfig.focusData.forEach(item=> {
            resultAry.push(item.src)
          })
          resolve(resultAry)
        }catch(err) {
          reject(err)
        }
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
// get(web.url, web.rule)

exports.jd = web
