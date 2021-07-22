const app = require("express")();
const bodyParser = require("body-parser");

// Routers
const todo = require("./routes/todo");
const user = require("./routes/user");

// Environment Vars
const PORT = process.env.PORT || 8000;

app.disable("x-powered-by");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse Request Body (JSON)
app.use(bodyParser.json());

// Routes
app.use('/todo', todo);
app.use('/user', user);

// Wildcard - For Invalid Routes
app.get("*", (req, res) => {
	res.status(404);
	res.send("");
});

// Listener

app.listen(PORT, () => {
	console.log("Listening on PORT: " + PORT);
});
