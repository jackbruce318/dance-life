const express = require('express');
const router = express.Router(); 
const controller = require('../controllers/userController.js');
const { login, verify } = require('../auth/auth');



router.get('/signIn', controller.signIn);

router.post('/signIn', login, controller.post_signIn); 

router.get('/logout', controller.logout);

router.get("/createUser", verify, controller.createUser);
router.post("/createUser", verify, controller.createUserPost);

router.get('/deleteUser/:user', verify, controller.deleteUser);
router.post('/deleteUser/:user', verify, controller.deleteUserPost);

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
    console.log('404 error in userRoutes')
})

router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
    console.log('500 error in userRoutes')
})

module.exports = router;