
const express = require("express");
const app = express();
const pool = require("./dbPools.js");
const fetch = require("node-fetch");
const session = require('express-session');
const bcrypt = require("bcrypt");
const mysql = require('mysql');

app.engine('html', require('ejs').renderFile);
app.use(express.static("public"));

app.use(session({
    secret: "top Secret!",
    resave: true,
    saveUninitialized: true
}))

function createDBConnection() {
    var conn = mysql.createPool({
        connectionLimit: 10,
        host: "de1tmi3t63foh7fa.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "svwvjtxw27jdshva",
        password: "fdwslyjayg4pu6oo",
        database: "b5u5zeiyntiu2as3"
    });
    return conn;
};

app.use(express.urlencoded({extended: true}));



//Routing
app.get("/", function(req, res){
	res.render("index.ejs");
});

//contact page
app.get("/contact", async function(req, res)
{
    res.render("contact.html");
});

//Score Page
app.get("/schedules", async function(req, res){

    let url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`;


    let response = await fetch(url);

    let data = await response.json();

    console.log(data);

    let scheduleArray = [];
    let nameArray = [];
    let dateArray = [];
    let venueArray = [];
    let homeTeamLogo = [];
    let awayTeamLogo = [];
    let homeTeamRecord = []
    let awayTeamRecord = [];

    let currentWeek = data.week.number;

    for( let i = 0; i < 16; i++) {
        scheduleArray.push(data.events[i].shortName)
        nameArray.push(data.events[i].name);
         dateArray.push(data.events[i].date);
         venueArray.push(data.events[i].competitions[0].venue.fullName);
        homeTeamLogo.push(data.events[i].competitions[0].competitors[0].team.logo);
        awayTeamLogo.push(data.events[i].competitions[0].competitors[1].team.logo);
        homeTeamRecord.push(data.events[i].competitions[0].competitors[0].records[0].summary);
        awayTeamRecord.push(data.events[i].competitions[0].competitors[1].records[0].summary);
    }


    res.render("schedules.ejs",{"currentWeek":currentWeek,"scheduleArray":scheduleArray, 
    "nameArray":nameArray, "dateArray":dateArray, "venueArray":venueArray, "homeTeamLogo":homeTeamLogo, 
    "awayTeamLogo":awayTeamLogo, "awayTeamRecord":awayTeamRecord, "homeTeamRecord":homeTeamRecord});
});

//Ticket Page
app.get("/tickets", function(req, res){
    if(req.session.authenticated) {
	    res.render("tickets.ejs");
    }else {
        res.render("login.ejs", {"loginError":true, "message":"You need to login to access that page, please login"})
    }
    
});


app.get("/store", function (req, res, next)
{
    if(req.session.authenticated) {
        res.render("store.ejs");
    }else {
        res.render("login.ejs", {"loginError":true, "message":"You need to login to access that page, please login"});
    }
});

app.get("/api/updateTicketDatabase", function (req, res)
{
    let sql;

    let sqlParams;
    
    switch (req.query.action) {
    case "add": sql = "INSERT INTO ticket (price, teams) VALUES (?,?)";
                sqlParams = [req.query.price, req.query.teams];
                break;
    }

  
pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows.affectedRows.toString());
    
});

});

app.get("/api/updateDatabase", function (req, res)
{
    let sql;

    let sqlParams;
    
    switch (req.query.action) {
    case "add": sql = "INSERT INTO merchandise (total, value) VALUES (?,?)";
                sqlParams = [req.query.total, req.query.value];
                break;
    }

  
pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows.affectedRows.toString());
  });

});


//Store
app.get("/store-results", function(req, res){
    
    res.render("store-results.ejs");
});

//Login
app.get("/login", function(req,res){
    
    let sql = "SELECT * FROM users";
	pool.query(sql, function (err, rows, fields) {
        if (err) throw err;
	
    
    if(req.session.authenticated) {
   //Get Login Table
        res.render("login.ejs", {"currentLogin":true, "rows":rows});
   } else {
        res.render("login.ejs",{"currentLogin":false, "rows":rows});
   }
	});
});

app.post("/login", async function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    let checkbox = req.body.checkbox;
    
    let result = await checkUsername(username);
    
    let hashedPwd = "";
    if (result.length > 0){
        hashedPwd = result[0].pass;
    }
    
    let passwordMatch = await checkPassword(password,hashedPwd);

    if (checkbox == undefined) {
        res.render("login.ejs", {"loginError":true, "message":"You did not agree to the terms before logging in."})    
    } else if (username == "user1" && passwordMatch) {
        req.session.authenticated = true;
        res.render("index.ejs", {"loginError":true, "message": "You have succesfully logged in!"});
    } else {
        res.render("login.ejs", {"loginError":true, "message":"Wrong Credentials entered, please try again!"});
    }
})

app.get("/logout", function(req, res){
    req.session.destroy();
    res.render("index.ejs");
})

app.post("/updateTeam", function(req, res){
    
    let teamName = req.body.teamName;
    console.log(teamName);
    var sql = "UPDATE users SET team = ? WHERE userId = 1";
    let conn = createDBConnection();
    conn.query(sql, [teamName], function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  res.render("index.ejs", {"loginError":true, "message": "You have updated your favorite team to " + teamName});
});

app.get("/api/updateContact", function (req, res)
{
    let sql;

    let sqlParams;
    
    switch (req.query.action) {
    case "add": sql = "INSERT INTO contact (firstname, lastname,country,subject) VALUES (?,?,?,?)";
                sqlParams = [req.query.firstname, req.query.lastname, req.query.country, req.query.subject];
                break;
    }

  
pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows.affectedRows.toString());
  });

});
function checkUsername(username) {
    let sql = "SELECT * FROM users WHERE username = ?";
    return new Promise(function(resolve, reject) {
        let conn = createDBConnection();
        conn.query(sql, [username], function(err, rows, fields) {
            if (err) throw err;
            console.log("Rows found: " + rows.length);
            resolve(rows);
        })
    })
}

function checkPassword(password, hashedValue) {
    
    return new Promise( function(resolve,reject){
        bcrypt.compare(password, hashedValue, function(err,result){
            console.log("Result: " + result);
            resolve(result);
        })
    })
}


//Starting Server
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Express server is running");
});