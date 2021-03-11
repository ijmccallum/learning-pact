// I am API!

const Koa = require('koa');
const app = new Koa();

// response
app.use(ctx => {
    console.log('Provider API: I have been called!');
    ctx.body = { a: "thing" };
});

if (!module.parent) app.listen(3000);

module.exports = app;
