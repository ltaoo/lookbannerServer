var sqlite = require('sqlite3').verbose()
// 初始化数据库及表
// 字段
// 
// original_url
// img_name
// bg_color
// img_description
// create_time
// 

// 暂时先完成能够保存唯一图片，不要隔天的无法判断
var db = new sqlite.Database('./lookbanner.db')

db.run(`CREATE TABLE image (
  original_url TEXT,
  img_name TEXT,
  create_time TEXT,
  web_name
)`)

db.close()
