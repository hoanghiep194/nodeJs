var express = require("express");
var app = express();
var bodyParser = require('body-parser');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// create application/json parser
var jsonParser = bodyParser.json();

server.listen(3000);

var arrayUser = [];
var arrayRoom = [];
class User {
    constructor(){}
    setName(userName){
        this.name = userName;
        return this;
    }
    setAddress(address){
        this.address = address;
        return this;
    }
}
io.on("connection", function(socket){
    socket.on("client-send-user", function(data){
        if(arrayUser.indexOf(data) >= 0){
            // fails
            socket.emit("server-send-fails");
        } else {
            // success
            arrayUser.push(data);
            console.log(arrayUser);
            socket.UserName = data;
            socket.emit("server-send-success", data);
            io.sockets.emit("server-send-list-user", arrayUser);
        }
    });
    socket.on("logout", function(){
        arrayUser.splice(arrayUser.indexOf(socket.UserName), 1);
        console.log("remove user :" + socket.UserName);
        socket.broadcast.emit("server-send-list-user",arrayUser);
    })
    socket.on("user-send-data", function(data){
        //io.sockets.emit("server-send-message", {user:socket.UserName, message:data});
        console.log(data.msg);
        io.sockets.in(socket.NameRoom).emit("server-send-data",
            {
                user: socket.UserName,
                message: data.msg,
                fileImage: data.file
            }
        );
    });
    socket.on("user-typing", function(){
        console.log(socket.NameRoom);
        io.sockets.in(socket.NameRoom).emit("server-user-typing", socket.UserName);
    });
    socket.on("user-stop-typing", function(){
        io.sockets.emit("server-user-stop-typing" );
    });

    socket.on("create-room", function(data){

        socket.join(data);
        console.log(socket.adapter.rooms);
        socket.NameRoom = data;
        if(arrayRoom.length == 0){
            arrayRoom.push(data);
        } else {
            if(arrayRoom.indexOf(data) == -1){
                arrayRoom.push(data);
            }
        }
        io.sockets.emit("server-send-room", arrayRoom);
        socket.emit("server-send-name-room", socket.NameRoom);
    });
    socket.on("client-join-room", function(data){
        console.log(socket.NameRoom);
        socket.leave(socket.NameRoom);
        socket.join(data);
        console.log("------------");
        console.log(socket.adapter.rooms);
        socket.NameRoom = data;
        if(arrayRoom.length == 0){
            arrayRoom.push(data);
        } else {
            if(arrayRoom.indexOf(data) == -1){
                arrayRoom.push(data);
            }
        }

        io.sockets.emit("server-send-room", arrayRoom);
        socket.emit("server-send-name-room", socket.NameRoom);
    });
});

app.get("/login", function(req, res){
    res.render("login");
});
app.post("/login", jsonParser, function(req, res){
    console.log(req.body);
    var data = {
        pass : req.body.pass
    };
    res.send(JSON.stringify(data));
});
