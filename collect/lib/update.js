let path = require('path') 
let sizeOf = require('image-size')
let fs = require('fs')
let co = require('co')
let sqlite = require('sqlite3').verbose()
// 这样就是打开了数据库，可以操作了
let db = new sqlite.Database(path.join(__dirname, './lookbanner.db'))

// 封装
function all() {
  return new Promise((resolve, reject)=> {
    db.all('select * from image', function (err, ary) {
      if(err) reject(err)
      resolve(ary)
      // index += 1;
      // console.log(row)
    })
  })
}
// let start = 1000;
// co(function*() {
//   let ary = yield all()
//   // 获取到图片数组后，就可以更新了
//   let resultAry = [];
//   for(let i = 0, len = 1000; i < 1000; i++) {
//     let imgPath = path.join(__dirname, '../banners/', row.create_time, row.web_name, row.img_name);
//     let res = sizeOf(imgPath)
//     resultAry.push({
//       name: row.img_name,
//       width: res.width,
//       height: res.height
//     });
//   }
//   fs.writeFileSync('result.json', JSON.stringify(resultAry), 'utf8');
//   console.log(resultAry.length)
//   // return resultAry;
//   // 获取到更新了宽高的数组后，写入数据库
//   // console.log(resultAry.length);
// })
// .then(res=> {
//   console.log(res.length)
// })

let resultAry = fs.readFileSync('all.json', 'utf8');
resultAry = JSON.parse(resultAry)
// console.log('resultAry length is:', resultAry.length)
db.serialize(function () {
  // each item
  var stmt = db.prepare('UPDATE image SET width = (?), height = (?) where img_name = (?) and width is ""')
  for(var i = 0, len = resultAry.length; i < len; i++) {
    var img_name = resultAry[i].name;
    var width = resultAry[i].width;
    var height = resultAry[i].height;
    console.log(resultAry[i].name, resultAry[i].width, resultAry[i].height)
    stmt.run(resultAry[i].width, resultAry[i].height, img_name)
    // console.log('更新', resultAry[i].name)
  }
  stmt.finalize()
})
// db.run('update image set width = ?, height = ? where img_name = ?', '423', '342', 'ChEiBVfp5CeAB5rTAAG85fS9RTg71500.jpg');
// console.log(resultAry[10])
db.close()