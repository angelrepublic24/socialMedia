const connection = require('./database/connection');
const express = require('express');
const cors = require('cors');

connection();
console.log('Databae server started')

const app = express();
const port = 3900

// Set up Cors
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Routes
let user_route = require('./routes/user');
let post_route = require('./routes/post');
let follow_route = require('./routes/follow');

app.use('/api/user', user_route)
app.use('/api/post', post_route)
app.use('/api/follow', follow_route)

app .listen(port, () => {
    console.log('server listening on port: ' + port);
});