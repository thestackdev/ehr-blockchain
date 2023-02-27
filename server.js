const { createServer } = require("http");
const next = require("next");

const app = next({
  dev: process.env.NODE_ENV !== "production",
});

const routes = require("./routes");
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const port = process.env.PORT || 3000;
  createServer(handler).listen(port, (err) => {
    if (err) throw err;
    console.log("ready on localhost:3000");
  });
});
