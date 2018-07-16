var express = require("express");
var app = express();
var bodyParser = require('body-parser');

// Connect to sql
var mysql = require('mysql');
var connection = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db_java'
});

// Check connect
// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }

//     console.log('connected as id ' + connection.threadId);
// });

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
    constructor() { }
    setName(userName) {
        this.name = userName;
        return this;
    }
    setAddress(address) {
        this.address = address;
        return this;
    }
}
io.on("connection", function (socket) {
    socket.on("client-send-user", function (data) {
        if (arrayUser.indexOf(data) >= 0) {
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
    socket.on("logout", function () {
        arrayUser.splice(arrayUser.indexOf(socket.UserName), 1);
        console.log("remove user :" + socket.UserName);
        socket.broadcast.emit("server-send-list-user", arrayUser);
    })
    socket.on("user-send-data", function (data) {
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
    socket.on("user-typing", function () {
        console.log(socket.NameRoom);
        io.sockets.in(socket.NameRoom).emit("server-user-typing", socket.UserName);
    });
    socket.on("user-stop-typing", function () {
        io.sockets.emit("server-user-stop-typing");
    });

    socket.on("create-room", function (data) {

        socket.join(data);
        console.log(socket.adapter.rooms);
        socket.NameRoom = data;
        if (arrayRoom.length == 0) {
            arrayRoom.push(data);
        } else {
            if (arrayRoom.indexOf(data) == -1) {
                arrayRoom.push(data);
            }
        }
        io.sockets.emit("server-send-room", arrayRoom);
        socket.emit("server-send-name-room", socket.NameRoom);
    });
    socket.on("client-join-room", function (data) {
        console.log(socket.NameRoom);
        socket.leave(socket.NameRoom);
        socket.join(data);
        console.log("------------");
        console.log(socket.adapter.rooms);
        socket.NameRoom = data;
        if (arrayRoom.length == 0) {
            arrayRoom.push(data);
        } else {
            if (arrayRoom.indexOf(data) == -1) {
                arrayRoom.push(data);
            }
        }

        io.sockets.emit("server-send-room", arrayRoom);
        socket.emit("server-send-name-room", socket.NameRoom);
    });
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login-user", jsonParser, function (req, res) {
    console.log(req.body);
    connection.getConnection(function (errs, tempCont) {
        if (errs) {
            // When done with the connection, release it.
            tempCont.release();
            console.error('error connecting: ');
        } else {
            var userName = req.body.username;
            var pass = req.body.password;
            var sql = "Select count(*) as count from tb_user Where userName='" + userName + "' and password='" + pass + "'";
            // Use the connection
            tempCont.query(sql, function (error, rows) {
                // When done with the connection, release it.
                tempCont.release();
                // Handle error after the release.
                if (error) {
                    console.log("Errors");
                } else {
                    var response = {
                        status: 200,
                        message: "",
                        result: rows[0].count
                    };
                    res.end(JSON.stringify(response));
                }
            });
        }
    });
});

app.get("/home", function (req, res) {
    res.render("home.ejs");
});

app.post("/register-user", jsonParser, function (req, res) {
    console.log(req.body);
    connection.getConnection(function (errs, tempCont) {
        if (errs) {
            // When done with the connection, release it.
            tempCont.release();
            console.error('error connecting: ');
        } else {
            var response = {};
            var userName = req.body.username;
            var pass = req.body.password;
            var dataInsert = {
                userName : userName,
                password : pass,
                roles : 1
            }
            var sqlSelect = "Select count(*) as count from tb_user Where userName='" + userName + "'";
           // var sqlInsert = "INSERT INTO tb_user (userName, password, roles) VALUES ('" + userName + "', '" + pass + "', 1)";
            var sqlInsert = "INSERT INTO tb_user SET ?";
            // Use the connection
            tempCont.query(sqlSelect, function (error, rows) {
                // When done with the connection, release it.
                tempCont.release();
                // Handle error after the release.
                if (error) {
                    console.log("Errors");
                } else {
                    if (rows[0].count > 0) {
                        response = {
                            status: 409,
                            message: "UserName " + userName + " is already exists",
                            result: rows[0].count
                        };
                        // Send response to client
                        res.end(JSON.stringify(response));
                    } else {
                        var query = tempCont.query(sqlInsert, dataInsert, function (error, rows) {
                            // Handle error after the release.
                            if (error) {
                                console.log("Errors");
                            } else {
                                response = {
                                    status: 200,
                                    message: "Register Success.",
                                    result: rows.affectedRows
                                }
                                // Send response to client
                                res.end(JSON.stringify(response));
                            }
                        });
                        console.log(query.sql);
                    }
                }
            });
        }
    });
});
