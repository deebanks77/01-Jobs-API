require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// Security packages
const helmet = require("helmet");
const cors = require("cors");
const xss_clean = require("xss-clean");
const limiter = require("express-rate-limit");

// Swagger => Api documentation
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// Routes
const auth = require("./routes/auth");
const jobs = require("./routes/jobs");
const authentication = require("./middleware/authentication");

// connect DB
const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// security packages
app.set("trust proxy", 1);
app.use(
  limiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
  })
);
app.use(helmet());
app.use(cors());
app.use(xss_clean());

app.use(express.json());

// testing route
// app.get("/", (req, res) => {
//   res.send("Application successfully deployed");
// });

// API documentation route
app.get("/", (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/jobs", authentication, jobs);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
