const express = require('express');
const router = express.Router(); 
const controller = require('../controllers/staffController.js');

const { login, verify } = require('../auth/auth');

router.get("/home", verify, controller.home);
router.get("/loggedInHome", verify, controller.loggedInHome);

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
    console.log('404 error in staffroutes')
})

router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
    console.log('500 error in staffroutes')
})


module.exports = router;