var fs = require('fs')
var path = require('path')
var request = require('request')
var _ = require('lodash')
var sizeOf = require('image-size')
var sqlite = require('sqlite3').verbose()

var db = new sqlite.Database(path.join(__dirname, './lookbanner.db'))
// 下载图片到本地
exports.downloadImagesFromAry = function (ary, web, dirname) {
  // 打开数据库
  
  ary.forEach(function (url) {
    var ary = url.split('/')
    var imgName = ary[ary.length -1]

    var date = new Date().toLocaleDateString()
    if(date.indexOf('/')) {
      // 如果在 ubuntu
      var ary = date.split('/')
      var now = ary[2] + '-' + (ary[0].length === 1 ? (0 + ary[0]) : ary[0]) + '-' + ary[1]
    }else {
      var now = date
    }

    var mainDir = path.join(dirname, 'banners')
    var dateDir = path.join(mainDir, now)
    var webDir = path.join(dateDir, web)
    // 
    if(!fs.existsSync(mainDir)) {
      fs.mkdirSync(mainDir, 0755)
    }
    if(!fs.existsSync(dateDir)) {
      fs.mkdirSync(dateDir, 0755)
    }
    if(!fs.existsSync(webDir)) {
      fs.mkdirSync(webDir, 0755)
    }
    // 判断该文件是否存在
    var fullName = path.join(webDir, imgName)

    db.get('select * from image where "img_name" = "' + imgName + '"', function (err, res) {
      //console.log(res)
      if(res) {
        // 如果 id 存在，就是表示这张图片已经存在
        console.log(fullName, '图片已存在')
      }else {
        // 否则就是不存在，所以要写入数据库
        db.run('INSERT INTO image VALUES ("'+url+'", "'+imgName+'", "'+now+'", "'+web+'") ')
        request.head(url, function (err, res, body) {
          request(url)
            .pipe(fs.createWriteStream(fullName))
            .on('close', function () {
              console.log(fullName, '图片下载成功')
            })
        })
      }
      
    })
  })
  //
  db.close()
}
exports.downloadImg = function(url, web, dirname) {
  // 将图片保存到本地
  var ary = url.split('/')
  var imgName = ary[ary.length -1]
  var date = new Date().toLocaleDateString()
  if(date.indexOf('/')) {
    // 如果在 ubuntu
    var ary = date.split('/')
    var now = ary[2] + '-' + (ary[0].length === 1 ? (0 + ary[0]) : ary[0]) + '-' + ary[1]
  }else {
    var now = date
  }

  var mainDir = path.join(dirname, 'banners')
  var dateDir = path.join(mainDir, now)
  var webDir = path.join(dateDir, web)
  // 
  if(!fs.existsSync(mainDir)) {
    fs.mkdirSync(mainDir, 0755)
  }
  if(!fs.existsSync(dateDir)) {
    fs.mkdirSync(dateDir, 0755)
  }
  if(!fs.existsSync(webDir)) {
    fs.mkdirSync(webDir, 0755)
  }
  // 判断该文件是否存在
  var fullName = path.join(webDir, imgName)

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
            let res = sizeOf(fullName)
            db.run('INSERT INTO image VALUES ("'+url+'", "'+imgName+'", "'+now+'", "'+web+'", "'+res.width+'", "'+res.height+'") ')
            console.log(fullName, '图片下载成功')
          })
      })
    }
    
  })
}

function addhttp(url) {
  if(url.indexOf('http') === -1) {
    // it mean not exists
    return 'http:' + url
  }else {
    return url
  }
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

function filterImg(arr) {
  return arr.filter(url => {
    var ary = url.split('/')
    var imgName = ary[ary.length -1]
    if(/(jpg|png)/i.test(imgName)) {
      return url;
    }
  })
}

exports.transform = transform
