const mysql = require('mysql');

const con = mysql.createConnection({
	host: 	  'localhost',
	user: 	  'root',
	password: '',
	database: 'chattest'
});

const connect = con.connect( (err) => {
	if(!err){console.log("Connected Sucessfully From Database");}else{console.log("Something Went Worng");throw err;}
});

exports.con = con;
exports.connect = connect;