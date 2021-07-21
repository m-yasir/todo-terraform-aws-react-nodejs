const app = require("express")();
const bodyParser = require("body-parser");

// Environment Vars
const PORT = process.env.PORT || 8000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse Request Body (JSON)
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200);
    res.send("Express App");
})

app.listen(PORT, () => {
    console.log("Listening on PORT: " + PORT);
});
