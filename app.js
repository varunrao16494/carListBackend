const express = require("express");
var bodyParser = require('body-parser')
const cors = require('cors');
// require("./db/mongoose");


const userRoute = require("./routes/user-route");
const carsRoute = require("./routes/cars-route")

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// app.use(express.json);
app.use(cors())
app.use(userRoute);
app.use(carsRoute);
module.exports = app;

