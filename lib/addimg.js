var fs = require('fs')
var path = require('path')
var request = require('request')
var _ = require('lodash')
var sqlite = require('sqlite3').verbose()
let co = require('co')

var db = new sqlite.Database(path.join(__dirname, './lookbanner.db'))

function all() {
  return new Promise((resolve, reject)=> {
    db.all('select * from image', function (err, ary) {
      if(err) reject(err)
      resolve(ary)
    })
  })
}

co(function*() {
  try {
    let ary = yield all()
    fs.writeFileSync('all.json', JSON.stringify(ary), 'utf8')
    ary.forEach(row=> {
      // 判断图片是否存在
      let imgPath = path.join(__dirname, '../banners/', row.create_time, row.web_name, row.img_name);
      if(!fs.existsSync(imgPath)) {
        // 如果不存在
        console.log(row.img_name, '不存在，创建')
        request.head(row.original_url, function (err, res, body) {
          request(row.original_url)
            .pipe(fs.createWriteStream(imgPath))
            .on('close', function () {
              console.log(imgPath, '图片下载成功')
            })
        })
      }
    })
  } catch(err) {
    console.log(err)
  }
})

// 传入url判断文件名是否在数据库
// exports.downloadImg = function(url, web, dirname) {
//   // 将图片保存到本地
//   var ary = url.split('/')
//   var imgName = ary[ary.length -1]

//   var date = new Date().toLocaleDateString()
//   if(date.indexOf('/')) {
//     // 如果在 ubuntu
//     var ary = date.split('/')
//     var now = ary[2] + '-' + (ary[0].length === 1 ? (0 + ary[0]) : ary[0]) + '-' + ary[1]
//   }else {
//     var now = date
//   }

//   var mainDir = path.join(dirname, 'banners')
//   var dateDir = path.join(mainDir, now)
//   var webDir = path.join(dateDir, web)
//   // 
//   if(!fs.existsSync(mainDir)) {
//     fs.mkdirSync(mainDir, 0755)
//   }
//   if(!fs.existsSync(dateDir)) {
//     fs.mkdirSync(dateDir, 0755)
//   }
//   if(!fs.existsSync(webDir)) {
//     fs.mkdirSync(webDir, 0755)
//   }
//   // 判断该文件是否存在
//   var fullName = path.join(webDir, imgName)

//   db.get('select * from image where "img_name" = "' + imgName + '"', function (err, res) {
//     //console.log(res)
//     if(res) {
//       // 如果 id 存在，就是表示这张图片已经存在
//       console.log(fullName, '图片已存在')
//     }else {
//       // 否则就是不存在，所以要写入数据库
//       request.head(url, function (err, res, body) {
//         request(url)
//           .pipe(fs.createWriteStream(fullName))
//           .on('close', function () {
//             db.run('INSERT INTO image VALUES ("'+url+'", "'+imgName+'", "'+now+'", "'+web+'", "", "") ')
//             console.log(fullName, '图片下载成功')
//           })
//       })
//     }
    
//   })
// }

// function addhttp(url) {
//   if(url.indexOf('http') === -1) {
//     // it mean not exists
//     return 'http:' + url
//   }else {
//     return url
//   }
// }

// function transform(ary) {
//   ary = _.uniq(ary)
//   return ary.map(function (url) {
//     //console.log(url)
//     return addhttp(url)
//   })
// }

// exports.transform = transform
