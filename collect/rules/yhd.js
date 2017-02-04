import cheerio from 'cheerio'

export const yhd = {
  url: 'http://www.yhd.com/',
  rule (body) {
    return new Promise((resolve, reject) => {
      const $ = cheerio.load(body)
      const resultAry = []
      const data = $('img', '#slider')
      //console.log(data)
      //console.log(data.length)
      let i = 0
      while(i < data.length) {
        // li 标签上有颜色
        const img = data[i]
        resultAry.push(img.attribs['wi'])
        i++
      }
      resolve(resultAry)
    })
  }
}
