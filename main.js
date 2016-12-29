const Koa = require('koa');
const logger = require('koa-logger2');
let log_middleware = logger('ip [day/month/year:time zone] "method url protoclo/httpVer" status size "referer" "userAgent" duration ms custom[unpacked]')

const route = require('koa-route');
const staticServer = require('koa-static');
//const staticServer = require('koa-static-server');

// database
const sqlite = require('sqlite3').verbose();

//
const path = require('path');

const db = new sqlite.Database('./lib/lookbanner.db');

const app = new Koa();
// 开启log
app.use(log_middleware.gen)
// 设置静态服务器路径
// app.use(staticServer({
//   rootDir: 'static',
//   rootPath: './banners'
// }));
app.use(staticServer(__dirname+'/banners/'))

const render = require('koa-swig');
app.context.render = render({
  root: path.join(__dirname, 'views'),
  autoescape: true,
  cache: false,
  ext: 'html',
  filters: {
    formatVersion: function (version) {
      return '@v' + version;
    }
  }
});

// app.use(route.get('/', function *() {
//   // 要在这个地方获取到数据
//   yield this.render('index');
//   console.log(this)
//   db.all('select * from image limit 10', function (err, ary) {
//     if(err) console.log(err)
//     console.log(ary);
//   })
// }))

app.use(async (ctx, next)=> {
  await next()
  ctx.response.type = 'text/html'
  ctx.response.body = '<h1>Hello</h1>'
})

// app.use(route.get('/:user', function *(user){
//   yield this.render('user', {user: user})
// }));
// 这里查询数据库
//db.each('select rowid, original_url from image', function (err, data) {
  //if(err) console.log(err);

  // 这里是回调，头疼
  //console.log(data.rowid, data.original_url);
//})
// 获取前十条记录

app.listen(3000, function () {
  console.log('started at %s: -port:%s', new Date, 3000);
})
