// let uri = 'http://img14.360buyimg.com/da/jfs/t3601/313/1399825250/93240/61a0b6fe/582475c6Na71e22be.jpg'
// let name = '5822ed15Na193eef9.jpg'
// let time = '2016-11-10'
// let web = 'jd'

let path = require('path') 
let sizeOf = require('image-size')
let sqlite = require('sqlite3').verbose()
let fs = require('fs') 
let co = require('co')
// 这样就是打开了数据库，可以操作了
let db = new sqlite.Database(path.join(__dirname, './lookbanner.db'))
// 根据以上信息就可以得到这张图片在服务器上的路径
let ary = [];
  // each item
db.each('SELECT rowid AS id, img_name, create_time, web_name FROM image', function (err, row) {
  if(err) throw err;
  let imgPath = path.join(__dirname, '../banners/', row.create_time, row.web_name, row.img_name);
  let res = sizeOf(imgPath)
  console.log(row.create_time, res);
  ary.push({
    name: row.img_name,
    width: res.width,
    height: res.height
  });
  if(ary.length >= 9577) {
    console.log(ary);
    fs.writeFileSync('all.json', JSON.stringify(ary), 'utf8');
  }
})
db.close()


