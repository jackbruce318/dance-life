const express = require('express');
const app = express();
require('dotenv').config() // loads data from .env file

const cookieParser = require('cookie-parser')
app.use(cookieParser())


app.use(express.urlencoded({
    extended: true
  }))

const path = require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); 

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const userRouter = require('./routes/userRoutes');
const customerSideRouter = require('./routes/dancelifeRoutes');

app.use('/user', userRouter);  // Mount userRoutes at the '/user' path
app.use('/', customerSideRouter);


app.listen(process.env.PORT ||3000, () => {
    console.log('Server started. Ctrl^c to quit.');
})  
