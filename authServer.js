//this will allow us to pull params from .env file
require("dotenv").config();

const express = require('express');

//This middleware will allow us to pull req.body.<params>
const app = express();
app.use(express.json());

const port = process.env.TOKEN_SERVER_PORT;

//get the port number from .env file
app.listen(port, () => { 
    console.log(`Authorization Server running on ${port}...`);
})

const bcrypt = require ('bcrypt');
const users = [];

//create 2 demo CTF users 
async function asyncCreateUsers() {
    let hashedPassword = await bcrypt.hash('password1', 10);    
    users.push ({user: 'user1', password: hashedPassword, redirectUrl: 'url1'});
    hashedPassword = await bcrypt.hash('password2', 10);
    users.push ({user: 'user2', password: hashedPassword, redirectUrl: 'url2'});
    console.log('Users created: ', users);
}

asyncCreateUsers();

//AUTHENTICATE LOGIN AND RETURN JWT TOKEN
const jwt = require("jsonwebtoken");

app.post("/login", async (req,res) => {

    const user = users.find( (c) => c.user == req.body.name);

    //check to see if the user exists in the list of registered users
    if (user == null) res.status(404).send ("User does not exist!");

    //if user does not exist, send a 400 response
    if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = generateAccessToken ({user: req.body.name});
        res.json ({accessToken: accessToken, redirectUrl: user.redirectUrl})
    } 
    else {
        res.status(401).send("Password Incorrect!")
    }
});

// accessTokens
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) ;
}

