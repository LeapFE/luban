const express = require("express");

const app = express();

app.use((request, _, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${request.method} ${request.originalUrl}`);

  next();
});

app.use(express.static(__dirname + "/dist"));

app.use([
  function(err, _, res, _next) {
    console.log(err.stack);
    error("Something broke!");

    res.status(500);
  },
]);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening up at ${port}`);
});
