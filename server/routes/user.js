const router = require('express').Router();

// Break into controller and routes if needed for cleaner code
router.post('/login', (req, res) => {
    res.status(200);
    res.send('Login');
});

router.post('/signup', (req, res) => {
    res.status(200);
    res.send('Signup');
});

module.exports = router;
