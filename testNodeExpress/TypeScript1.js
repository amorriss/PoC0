var socketIo = require('socket.io');
module.exports = {
    startService: function (server) {
        var io = socketIo(server);
        io.on('connection', function (socket) {
            socket.on('receive message', function (question) {
                io.emit('send message', question);
            });
        });
        return io;
    }
};
//# sourceMappingURL=TypeScript1.js.map