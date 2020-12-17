const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: 10,
    host: "de1tmi3t63foh7fa.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "svwvjtxw27jdshva",
    password: "fdwslyjayg4pu6oo",
    database: "b5u5zeiyntiu2as3"
});

module.exports = pool;
