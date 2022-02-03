const express = require("express");
const http = require("http");
const cors = require("cors");
const apiToDosRouter = require("./controllers/api-todos.controller");
const apiAuthRouter = require("./controllers/api-auth.controller");
const apiUsersRouter = require("./controllers/api-users.controller");
const { notFound, errorHandler } = require("./middlewares/middlewares");
const { initDB } = require("./dataBase");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
initDB();

app.use((req, res, next) => {
  console.log("URL = ", req.url);
  console.log("Original URL = ", req.orogiaUrl);
  console.log("METHOD = ", req.method);
  console.log("HOST = ", req.headers.host);
  console.log("InSecure = ", req.secure);
  console.log("BODY", req.body);
  console.log("QUERY", req.query);

  next();
});

app.use("/api/todos", apiToDosRouter);
app.use("/api/auth", apiAuthRouter);
app.use("/api/users", apiUsersRouter);

app.use(notFound);
app.use(errorHandler);

http.createServer(app).listen(3000, () => {
  console.log("Server is working on port 3000");
});
