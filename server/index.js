const express		    = require("express");
const app 			    = express();
const bodyParser 	  = require("body-parser");
const cors 			    = require("cors");
const { sequelize }	= require("./models");
require('dotenv').config();

// Routers
const todo = require("./routes/todo");
const user = require("./routes/user");

// Environment Vars
const PORT 		= process.env.PORT || 8000;
const BASE_URL 	= process.env.BASE_URL || '/api';

app.disable("x-powered-by");

// Enable cors for S3 (cross origin) access in an EC2 instance
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": true,
  "optionsSuccessStatus": 204
}));

// Enable cors for S3 (cross origin) access in an EC2 instance
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", 'DELETE, GET, HEAD,,PATCH, POST, PUT, UPDATE');
//   res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
//   next()
// });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse Request Body (JSON)
app.use(bodyParser.json());

// BASE_URL router
const baseRouter = express.Router();

// Routes
baseRouter.use('/todo', todo);
baseRouter.use('/user', user);

app.use(BASE_URL, baseRouter);

// Wildcard - For Invalid Routes
app.get("*", (req, res) => {
	res.status(404);
	res.send("");
});

// Listener

app.listen(PORT, () => {
	console.log("Listening on PORT: " + PORT);
  sequelize.authenticate()
    .then( async (success) => {
      console.log('Connection with DB Successful!');
      sequelize.sync().then( () => {
        console.log("Sync successful!");
      }).catch((err) => {
        console.log("Sync Unsuccessful!");
        console.error(err);
      });
    })
    .catch(err => console.error(err));
});
