
var socketIo = require('socket.io');

module.exports = {
    startService: function (server) {
        var io = socketIo(server);

        io.on('connection', function (socket) {

            socket.emit('message', { 'message': 'This is Project X' });
            console.log("connection server function called from browser");

            socket.on('speak', function (data) {
                console.log(data);
                console.log("speak server function called from browser");
                socket.emit('message', { 'message': 'This is Project X again' });
            });

            socket.on('ddselect', function (data) {
                socket.broadcast.emit('dd_data', {
                    data: data.data
                });
                console.log("ddselect server function called from browser");
                console.log(data);
            });

            socket.on('login', function (data) {
                console.log("login server function called from browser");

                if (validatelogin(data.data)) {
                    console.log("login successful ...");
                    socket.broadcast.emit('loginRet', { data: "success" });

                    console.log("exiting login server function ...");
                } else {
                    console.log("login failed ...");
                    socket.broadcast.emit('loginRet', { data: "failed" });
                }
            });
        });

        return io;
    }
};

function validatelogin(data: string) {

    var loggedIn: boolean = false;

    if (data.substr(5, 10) == "secret") {
        loggedIn = true;
    }

    return loggedIn;
};




