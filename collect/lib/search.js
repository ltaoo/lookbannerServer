let path = require('path')
let sqlite = require('sqlite3').verbose()
// 这样就是打开了数据库，可以操作了
let db = new sqlite.Database(path.join(__dirname, './lookbanner.db'))

let name = '582475c6Na71e22be.jpg'

// 根据以上信息就可以得到这张图片在服务器上的路径
db.run('SELECT * FROM image where img_name = "'+name+'"', (err, res)=> {
  if(err) throw err;
  console.log(err);
})
db.close()