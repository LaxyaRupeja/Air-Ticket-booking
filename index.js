const express = require('express');
const { connectionToAtlas } = require('./Configs/db');
const app = express();
app.use(express.json())
const router = require("./Routes/server.routes");
app.use("/api", router);

app.listen(8080, connectionToAtlas());