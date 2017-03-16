var socketIo = require('socket.io');
module.exports = {
    startService: function (server) {
        var io = socketIo(server);
        io.on('connection', function (socket) {
            socket.emit('message', { 'message': 'This is Project X' });
            console.log("connection function called from browser");
            //  socket.emit('dd_data', { 'data': 'DATA HERE' });
            socket.on('speak', function (data) {
                console.log(data);
                socket.emit('message', { 'message': 'This is Project X again' });
            });
            socket.on('ddselect', function (data) {
                socket.broadcast.emit('dd_data', {
                    data: data.data
                });
                //socket.emit('dd_data', { 'data': 'DATA HERE' });
                console.log("ddselect called with ..");
                console.log(data);
            });
        });
        return io;
    }
};
//# sourceMappingURL=socketServer.js.map