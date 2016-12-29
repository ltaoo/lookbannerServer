var sqlite = require('sqlite3').verbose()
// 打开数据库
var db = new sqlite.Database('./lookbanner.db')

// 首先是写数据
var ary = [ 'http://gfs10.gomein.net.cn/T1C.xTBQYT1RCvBVdK.jpg',
  'http://gfs13.gomein.net.cn/T1N6DTByZT1RCvBVdK.jpg',
  'http://gfs13.gomein.net.cn/T17CLTB5KT1RCvBVdK.jpg',
  'http://gfs12.gomein.net.cn/T1oV_TB_ZT1RCvBVdK.jpg' ]

// 默认没有数据的情况
// 下载图片到本地
function download(url, web, dirname) {
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
  }/*

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
  var fullName = path.join(webDir, imgName)*/

  // 这个地方需要进行修改
  // 先判断是否存在数据库中



  /*fs.exists(fullName, function (exists) {
    if(exists) {
      console.log(fullName, '图片已存在')
    }else {
      request.head(url, function (err, res, body) {
        request(url)
          .pipe(fs.createWriteStream(fullName))
          .on('close', function () {
            console.log(fullName, '图片下载成功')
          })
      })
    }
  })*/
}

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
  var web = 'tmall'
  db.get('select * from image where "img_name" = "' + imgName + '"', function (err, res) {
    console.log(res)
    if(res) {
      // 如果 id 存在，就是表示这张图片已经存在
      console.log('图片已存在')
    }else {
      // 否则就是不存在，所以要写入数据库
      db.run('INSERT INTO image VALUES ("'+url+'", "'+imgName+'", "'+now+'", "'+web+'") ')
      //db.run('INSERT INTO image VALUES ('+url+', '+imgName+', '+date+', '+web+') ')
      //db.run('INSERT INTO image VALUES ("url", "imgName", "date", "web") ')
      console.log('写入数据库')
    }
    
  })
})


// 有一个数组，在遍历时，判断 name 是否存在于数据库中
