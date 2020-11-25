const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const helmet = require("helmet");
const cors = require('cors');
const connectDB = require('./config/db');

const errorHandler = require('./middleware/error');


//Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();
//Enable CORS
app.use(cors());
// Connect to database
connectDB();

// Sanitize data
app.use(mongoSanitize());

//Set security header
app.use(helmet());
//Prevents XSS Attack
app.use(xss());

//Prevent http param pollution
app.use(hpp());

//Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
//Routes definition
const review = require("./routes/review");
const auth = require("./routes/auth");


//Mount routes
app.use("/api/v1/reviews", review);
app.use("/api/v1/auth", auth);
//Port definition

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);