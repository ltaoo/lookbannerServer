import fs from 'fs'
import request from 'request'
import cheerio from 'cheerio'

// jsonp 函数
global.jsonp = function(res) {
  return res;
}

function get(val) {
  return new Promise((resolve, reject)=> {
    request(val, (err, res, body)=> {
      if(err) reject(err);
      resolve(body);
    })
  })
}

export const mogujie = {
  url: 'http://www.mogujie.com/',
  rule(body) {
    return new Promise(async function (resolve, reject) {
      //先拿到 html 中的 pid 
      const $ = cheerio.load(body)
      const pids = $('.schema_config')
      const jsCode = pids['0'].children[0]
      const pid = JSON.parse(jsCode.data).mSlider.sourceKey

      // 拿到 pid 后，就可以发jsonp 请求获取图片地址
      const jsonpFun = await get(`http://mce.mogucdn.com/jsonp/multiget/3?callback=jsonp&pids=${pid}`)
      const res = global.eval(jsonpFun)

      // 获取图片地址
      const resultAry = []
      res.data[pid].list.forEach(item=> {
        resultAry.push(item.image)
      })

      resolve(resultAry)
    })
  }
}
