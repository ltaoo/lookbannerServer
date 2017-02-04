import request from 'request'
import cheerio from 'cheerio'

export const suning = {
  url: 'http://www.suning.com/',
  rule (body) {
    return new Promise((resolve, reject) => {

      const $ = cheerio.load(body)
      //console.log($('script', '.first-screen'))
      let data = $('script', '.first-screen')['0'].children[0].data
      //console.log(data)
      // 从字符串中使用正则提取出图片地址
      // 可以这么做，但是就没有一些图片信息了，比如图片文档，图片背景色等
      //var resultAry = data.match(/^(https|http)\\s(jpg|png)$/g, )
      // 因为内容是一个赋值语句，考虑将window.Gbanners = 修改成其他的
      data = data.replace(/(var bannerhtml = '';)(\d|\D)+/, '')
      // 然后执行这个字符串代码
      //console.log(data)
      global.eval(data)
      // 现在就有了 bannerImg 这个数组变量保存着banner
      //console.log(bannerImg)
      const resultAry = []
      bannerImg.forEach(function (ary) {
        if(ary.length) {
          ary.forEach(function (obj) {
            resultAry.push(obj.imgUrl)
          })
        }
      })

      resolve(resultAry)
    })
  }
}
