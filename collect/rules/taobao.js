import request from 'request'
import cheerio from 'cheerio'

import fetch from '../lib/syncFetch'

global.cb = function (data) {
  return data
}
export const taobao = {
  url: 'https://www.taobao.com/',
  rule (body) {
    return new Promise(async function (resolve, reject) {
      const $ = cheerio.load(body)
      const data = $('.mod', '.promo-bd')

      //var reqUrl = 'https://ecpm.tanx.com/ex?i=mm_12852562_1778064_13672849&cb=jsonp_callback_21951&r=&cg=a1268884a59e6184e801da1e3d9f4e94&pvid=c16865ef94b23219e287e289d56c73cb&u=https%3A%2F%2Fwww.taobao.com%2F&psl=1&nk=37%2C53%2C67%2C117%2C53%2C50%2C49%2C68%2C37%2C53%2C67%2C117%2C53%2C49%2C70%2C65%2C37%2C53%2C67%2C117%2C53%2C67%2C55%2C49%2C37%2C53%2C67%2C117%2C54%2C55%2C57%2C55&sk=&fp=1.Hav1F6jcqsp241eOwh8UaTovubSKb8F6W1hROESuR~Wasog7Gf8XiN.UTF-8.hu2lztSK_gBAtByID_hEI0DmqgiayA.Q.do4jn3'
      const resultAry = []
      const mmAry = []
      let i = 0
      while(i < data.length) {
        // 获取到 data id
        //console.log(data[i])
        const appId = data[i].attribs['data-id']
        //console.log(appId)
        if(appId.indexOf('m') == -1) {
          // 如果不存在 m ，就是 直接 id 的形式，这种数据存在 data-src 上
          const img = data[i].children[1].children[1]
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
        i++
      }
      // 在 while 循环外请求
      // 要发 get 请求返回图片地址
      for(let j = 0, len = mmAry.length; j < len; j++) {
        const appId = mmAry[j]
        const url = `https://ecpm.tanx.com/ex?i=${appId}&cb=cb&r=&cg=a1268884a59e6184e801da1e3d9f4e94&pvid=c16865ef94b23219e287e289d56c73cb&u=https%3A%2F%2Fwww.taobao.com%2F&psl=1&nk=37%2C53%2C67%2C117%2C53%2C50%2C49%2C68%2C37%2C53%2C67%2C117%2C53%2C49%2C70%2C65%2C37%2C53%2C67%2C117%2C53%2C67%2C55%2C49%2C37%2C53%2C67%2C117%2C54%2C55%2C57%2C55&sk=&fp=1.Hav1F6jcqsp241eOwh8UaTovubSKb8F6W1hROESuR~Wasog7Gf8XiN.UTF-8.hu2lztSK_gBAtByID_hEI0DmqgiayA.Q.do4jn3`
        try {
          let body = await fetch(url)
          const img = global.eval(body)
          resultAry.push(img.data)
        }catch(err) {
          console.log(err)
        }
      }

      resolve(resultAry)
    })
  }
}

