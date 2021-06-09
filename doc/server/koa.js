const Koa = require("koa");
const static = require("koa-static");

const app = new Koa();

app.use(static("dist"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening up at ${port}`);
});
