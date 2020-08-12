const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
const cookieparser = require('cookie-parser');
const connect = require('./module/connection.js');

const port = 8080;
if(http.listen(port)){console.log("Listening at "+"localhost:"+port);}else{console.log("Something Went Worng");}

/* Serving Static Files */
app.use(express.static(__dirname+"/public"));

app.get("/", (request,response) =>  {
	response.sendFile(__dirname+"/index.html");
});
/* Page Handling When User not get Page Throw 404 Error This method must be after declaring all the pages */
app.get("*", (request,response) => {
	response.sendFile(__dirname+"/public/error/404.html");
});