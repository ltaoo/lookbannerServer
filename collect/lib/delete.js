let path = require('path')
let sqlite = require('sqlite3').verbose()
// 这样就是打开了数据库，可以操作了
let db = new sqlite.Database(path.join(__dirname, './lookbanner.db'))

let name = '92ed2d80-06c5-11e6-9c41-9b82468daefd.html?st_type=15_18&name=smad&adgrid=715335580&clk1info=56247076,56,R63KCDcgK3ZsqeFP%2FSIQ4b%2B2inQHky8%2FCnvGp0cIDedO2dSjs9JlbQ%3D%3D&sbid=4013&p4p_size=520x280&pvid=8c90b40b424e29405821d80a22721bd5'

// 根据以上信息就可以得到这张图片在服务器上的路径
db.run('DELETE FROM image where img_name = "'+name+'"')
db.close()