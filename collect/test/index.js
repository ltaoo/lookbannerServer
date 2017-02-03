// native module
import fs from 'fs'
import path from 'path'
// 3th
import request from 'request'
// custom lib
import util from '../lib/createfile'

function fetch(url, web, rule) {
    request(url, function (err, res, body) {
      if(err) return console.log(err)

      rule.call(null, body, function (ary) {
        console.log(ary)
        // ary = util.transform(ary)
        // ary.forEach(function (url) {
        //   //console.log(url)
        //   console.log(url, web, __dirname)
        //   // util.downloadImg(url, web, __dirname)
        // })
      })
    })
}

// 扫描添加 require
// fs.readdir(path.join(__dirname, './rules'), (err, files)=> {
//   if(err) return console.log(err)
//   files.forEach(file => {
//     const module = require(path.join(__dirname, './rules/', file))
//     for(let key in module) {
//       // 请求地址
//       fetch(module[key]['url'], key, module[key]['rule'])
//     }
//   })
// })

// 测试指定文件
const files = [
  // 'amazon.js',
  // 'cloudmusic.js',
  // 'dangdang.js',
  // 'emart.js',
  // 
  // 'gmarket.js',
  // 空数组
  // 'gome.js',
  // 'jd.js',
  // haitao
  // 'kaola.js',
  // 'mogujie.js',
  // 'suning.js',
  // 'taobao.js',
  // 'tmall.js',
  // 空数组
  // 'yhd.js'
]
files.forEach(file => {
  const module = require(path.join(__dirname, '../rules/', file))
  for(let key in module) {
    // 请求地址
    fetch(module[key]['url'], key, module[key]['rule'])
  }
})
