const express = require("express");
const cors = require("cors");

const v1Routes = require("./routes/v1");
const setupSwagger = require("./docs/swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", v1Routes);
setupSwagger(app);
module.exports = app;