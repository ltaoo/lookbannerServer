import request from 'request'
import cheerio from 'cheerio'
import fs from 'fs'

export const kaola = {
  url: 'http://www.kaola.com/getPCBannerList.html',
  rule(body) {
    return new Promise((resolve, reject) => {

      let resultAry = []
      const result = JSON.parse(body)

      result.body.bannerList.forEach((item, index)=> {
        resultAry.push(item.imageUrl)
      })

      resolve(resultAry)
    })
  }
}
