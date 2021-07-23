const router    = require("express").Router();
const { Todo }  = require("../models");

// Break into controller and routes if needed for cleaner code
router.get("/", async (req, res) => {
	try {
		const todos = await Todo.findAll({
			attributes: ['id', 'content', 'completed', 'createdAt']
		});
		res.status(200);
		res.send(todos);
	} catch (err) {
		res.status(404);
		res.send(err);
	}
});


router.patch("/:id", async (req, res) => {
	try {
		const { content, completed } = req.body;
		if (req.body.content == null || req.body.completed == null) {
			throw new Error("Body is missing details.");
		}
		const todos = await Todo.update(
			{
				content,
				completed
			},
			{ where: { id: req.params.id } }
		);
		res.status(200);
		res.send({ id: req.params.id });
	} catch (err) {
		res.status(400);
		res.send(err);
	}
});

router.post("/", async (req, res) => {
	try {
		const { content, completed } = req.body;
		if (req.body.content == null || req.body.completed == null) {
			throw new Error("Body is missing details.");
		}
		const todo = await Todo.create({
			content,
			completed
		});
		res.status(200);
		res.send(todo);
	} catch (err) {
		res.status(400);
		res.send({ message: err.message });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const todos = await Todo.destroy({ where: { id: req.params.id } });
		res.status(200);
		res.send({ id: req.params.id });
	} catch (err) {
		res.status(400);
		res.send(err);
	}
});

module.exports = router;
