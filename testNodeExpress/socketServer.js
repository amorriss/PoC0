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
                }
                else {
                    console.log("login failed ...");
                    socket.broadcast.emit('loginRet', { data: "failed" });
                }
            });
            socket.on('createRight', function (data) {
                console.log(data);
                console.log("Create right server function called from browser");
                socket.broadcast.emit('createRightRet', { 'message': 'Created Right' });
            });
            socket.on('createService', function (data) {
                console.log(data);
                console.log("Create service server function called from browser");
                socket.broadcast.emit('createServiceRet', { data: data.data });
            });
            socket.on('createNewService', function (data) {
                console.log(data);
                console.log("Create new service server function called from browser");
                socket.broadcast.emit('createNewServiceRet', { 'message': 'Created New Service' });
            });
            socket.on('logout', function (data) {
                console.log(data);
                console.log("logout server function called from browser");
                socket.broadcast.emit('logoutRet', { 'message': 'Logged Out' });
            });
        });
        return io;
    }
};
function validatelogin(data) {
    var loggedIn = false;
    var credentials = data.split(":");
    if (credentials[1] == "secret") {
        loggedIn = true;
    }
    return loggedIn;
}
;
//# sourceMappingURL=socketServer.js.map