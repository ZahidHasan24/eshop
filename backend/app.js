const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const productsRouter = require("./routers/products");
const categoriesRouter = require("./routers/categories");
const usersRouter = require("./routers/users");
const authJWT = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
require("dotenv/config");

const app = express();

const api = process.env.API_URL;

// middleware
app.use(cors());
app.options("*", cors());

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJWT());
app.use(errorHandler);

// Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);

//Database
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
