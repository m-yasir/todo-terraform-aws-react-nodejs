const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200);
    res.send([]);
})

module.exports = router;
