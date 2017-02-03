import fs from 'fs'
import path from 'path'
import request from 'request'
import _ from 'lodash'
import sizeOf from 'image-size'
import sqlite3 from 'sqlite3'

const sqlite = sqlite3.verbose()
const db = new sqlite.Database(path.join(__dirname, './lookbanner.db'))
// 下载图片到本地
exports.downloadImg = function(url, web, dirname) {
  // 将图片保存到本地
  const ary = url.split('/')
  const imgName = ary[ary.length -1]
  // 当前时间
  const date = new Date().toLocaleDateString()
  let now = date
  // 处理系统差异
  if(date.indexOf('/')) {
    // 如果在 ubuntu
    const _ary = date.split('/')
    now = `${_ary[2]}-${(_ary[0].length === 1 ? (0 + _ary[0]) : _ary[0])}-${_ary[1]}`
  }
  // 处理路径
  const mainDir = path.join(dirname, 'banners')
  const dateDir = path.join(mainDir, now)
  const webDir = path.join(dateDir, web)
  // 
  if(!fs.existsSync(mainDir)) {
    fs.mkdirSync(mainDir)
  }
  if(!fs.existsSync(dateDir)) {
    fs.mkdirSync(dateDir)
  }
  if(!fs.existsSync(webDir)) {
    fs.mkdirSync(webDir)
  }
  // 判断该文件是否存在
  const fullName = path.join(webDir, imgName)
  // 查询数据库该文件是否存在
  db.get('select * from image where "img_name" = "' + imgName + '"', function (err, res) {
    //console.log(res)
    if(res) {
      // 如果 id 存在，就是表示这张图片已经存在
      console.log(fullName, '图片已存在')
    }else {
      // 否则就是不存在，所以要写入数据库
      request.head(url, function (err, res, body) {
        request(url)
          .pipe(fs.createWriteStream(fullName))
          .on('close', function () {
            // 生成本地图片文件获取实际尺寸
            let res = sizeOf(fullName)
            db.run('INSERT INTO image VALUES ("'+url+'", "'+imgName+'", "'+now+'", "'+web+'", "'+res.width+'", "'+res.height+'") ')
            console.log(fullName, '图片下载成功')
          })
      })
    }
    
  })
}
// 添加 http 协议头
function addhttp(url) {
  if(url.indexOf('http') === -1) {
    // it mean not exists
    return 'http:' + url
  }else {
    return url
  }
}
// 过滤保证数组中的一定是图片
function filterImg(arr) {
  return arr.filter(url => {
    if(url) {
      var ary = url.split('/')
      var imgName = ary[ary.length -1]
      // 存在 jpg 或者 png 
      if(/(jpg|png)$/i.test(imgName)) {
        return url
      }
    }
  })
}

function transform(ary) {
  ary = _.uniq(ary)
  // 筛选
  ary = filterImg(ary)
  return ary.map(function (url) {
    //console.log(url)
    return addhttp(url)
  })
}



exports.transform = transform
