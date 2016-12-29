const Koa = require('koa');
// require('koa-router') 返回的是 函数？所以调用一次就返回了一个对象？
const router = require('koa-router')();
const staticServer = require('koa-static');
//
const db = require('./model/index');

const app = new Koa();

// 日志中间件
app.use(async (ctx, next)=> {
  console.log(`${ctx.request.method} - ${ctx.request.url}`);
  // 调用下一个中间件
  await next();
})
// 静态资源
app.use(staticServer(__dirname+'/client/'));
// 记录处理时间
app.use(async (ctx, next)=> {
  const start = new Date().getTime();

  await next();

  const ms = new Date().getTime() - start;

  console.log(`Time cost :${ms} ms`);
})

// 先定义好路由
router.get('/hello/:name', (ctx, next)=> {
  let name = ctx.params.name;
  ctx.body = `<h1>Hello, ${name}</h1>`;
})
router.get('/', (ctx, next)=> {
  ctx.body = '<h1>Index page</h1>';
})
// 真正有用的
router.get('/pages/:index', (ctx, next)=> {
  // 在这里调用函数从数据库中获取数据
  let index = ctx.params.index;
  // ctx.status = 200;
  // ctx.body = `<h1>${index}</h1>`;
  return db.fetchAll(10, index).then(res=> {
    ctx.body = res;
  })
})
router.get('/web/:web/:index', (ctx, next)=> {
  let web = ctx.params.web;
  let index = ctx.params.index;
  return db.fetchByWebName(web, 10, index).then(res=> {
    ctx.body = res;
  })
})
// 获取已收录的网站名称
router.get('/webs', (ctx, next) => {
  return db.fetchWebs().then(res => {
    ctx.body = res;
  })
})

// 加入路由中间件
app.use(router.routes());




// 输出中间件
// app.use(async (ctx, next)=> {
//   await next();
//   ctx.response.type = 'text/html';
//   ctx.response.body = '<h2>hell</h2>';
// })

app.listen(3000);
console.log('app started at port 3000');
