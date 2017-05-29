
var socketIo = require('socket.io');
var mySocket;
var loginToken;
let serverURL = "http://bcserver.uksouth.cloudapp.azure.com:8080/";    // http://rapley.ukwest.cloudapp.azure.com      // http://51.140.86.87:8080/   //bcserver.uksouth
var serverAvailable = true;

function myTimer() {
    var d = new Date();
    // document.getElementById("demo").innerHTML = d.toLocaleTimeString();
    //console.log("time is " + d.toDateString());
    var formatDateTime = d.toDateString() + " " + d.getHours().toPrecision(2).toString() + ":" + d.getMinutes().toPrecision(2).toString();
    mySocket.emit('timesignal', { 'data': formatDateTime });
}

module.exports = {
    startService: function (server) {
        var io = socketIo(server);

        io.on('connection', function (socket) {

            socket.emit('message', { 'message': 'This is Project X' });
            console.log("connection server function called from browser");

            // send time to client
            // timer used to send time to client via an emit
            mySocket = socket;
            var myVar = setInterval(myTimer, 1000);

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

                validatelogin(data.data, socket);

            });

            socket.on('getServices', function (data) {
                console.log(data);
                console.log("Get services server function called from browser");

                if (serverAvailable) {
                    var request = require('request');
                    var options = {
                        url: serverURL + 'api/services',
                        headers: {
                            'x-access-token': loginToken
                        }
                    };

                    request.get(
                        options,
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var services = JSON.parse(body);
                                console.log("services are " + body);
                                socket.broadcast.emit('getServicesRet', { data: services });
                            } else {
                                console.log("get services error ...");
                                socket.broadcast.emit('getServicesRet', { data: "Failed to get services" });
                            };
                        }
                    );
                } else {
                    var body = '[{"serviceName": "Land Registry","authorisedUsers": ["Hugues","Tommi"],"rightTypes": ["Right Of Ownership","Mining Rights"]}, {"serviceName": "Tea Service","authorisedUsers": ["Earl Grey","Dee Caff"],"rightTypes": ["Clean Cups"]}]';

                    var services = JSON.parse(body);
                    console.log("services are " + body);
                    socket.broadcast.emit('getServicesRet', { data: services });
                }
            });


            socket.on('createNewService', function (dataObj) {
                console.log("Create new service server function called from browser");

                if (serverAvailable) {

                    // get passed data
                    console.log("service data " + dataObj.data.name);
                    var serviceData = dataObj.data;

                    var request = require("request");

                    var options = {
                        method: 'POST',
                        url: 'http://bcserver.uksouth.cloudapp.azure.com:8080/api/services/',
                        headers:
                        {
                            'cache-control': 'no-cache',
                            'content-type': 'application/json',
                            'x-access-token': loginToken
                        },
                        body:
                        {
                            serviceName: serviceData.name,
                            authorisedUsers: serviceData.users,
                            rightTypes: serviceData.rights
                        },
                        json: true
                    };
                    
                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {

                            console.log("created new service " + response);
                            socket.broadcast.emit('createNewServiceRet', { data: "success" });
                        } else {
                            console.log("create new service error ..." + response.statusCode);
                            socket.broadcast.emit('createNewServiceRet', { data: "Failed to create service" });
                        };
                    });
                } 
            });


            socket.on('createRight', function (data) {
                console.log(data);
                console.log("Create right server function called from browser");
                socket.broadcast.emit('createRightRet', { 'message': 'Created Right' });
            });

            socket.on('amendService', function (dataObj) {
                console.log(dataObj);
                console.log("Amend service server function called from browser");

                if (serverAvailable) {

                    // get passed data
                    console.log("service data " + dataObj.data.name);
                    var serviceData = dataObj.data;

                    var request = require("request");

                    var options = {
                        method: 'PUT',
                            serviceName: serviceData.name,
                            url: 'http://bcserver.uksouth.cloudapp.azure.com:8080/api/services/' + serviceData.name,
                        headers:
                        {
                            'cache-control': 'no-cache',
                            'content-type': 'application/json',
                            'x-access-token': loginToken
                        },
                        body:
                        {
                            serviceName: serviceData.name,
                            authorisedUsers: serviceData.users,
                            rightTypes: serviceData.rights
                        },
                        json: true
                    };

                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {

                            console.log("Amended service " + response);
                            socket.broadcast.emit('amendServiceRet', { data: "success" });
                        } else {
                            console.log("Amend service error ..." + response.statusCode);
                            socket.broadcast.emit('amendServiceRet', { data: "Failed to create service" });
                        };
                    });
                } 
            });

            socket.on('createService', function (data) {
                console.log(data);
                console.log("Create new service server function called from browser");
                socket.broadcast.emit('createServiceRet', { data: data.data });
            });

            socket.on('logout', function (data) {
                console.log(data);
                console.log("logout server function called from browser");
                socket.broadcast.emit('logoutRet', { 'message': 'Logged Out' });
            });

            // HC ------------------------------------------------------------------

            socket.on('createHouse', function (data) {
                console.log(data);
                console.log("Create house server function called from browser");
                socket.broadcast.emit('createHouseRet', { data: data.data });
            });

            socket.on('saveHouse', function (data) {
                console.log(data);
                console.log("Save house server function called from browser");
                socket.broadcast.emit('saveHouseRet', { data: data.data });
            });

            socket.on('sendHouse', function (data) {
                console.log(data);
                console.log("Send house server function called from browser");
                socket.broadcast.emit('sendHouseRet', { data: data.data });
            });

        });
        return io;
    }
};

function validatelogin(data: string, socket) {

    var loggedIn: boolean = false;
    var credentials = data.split(":");

    if (serverAvailable) {
        var request = require('request');

        request.post(
            serverURL + 'auth/login',
            { json: { username: credentials[0], password: credentials[1] } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("success " + body.authenticated);

                    if (body.authenticated == true) {
                        //let token = JSON.stringify({ body });
                        loginToken = body.token;

                        //console.log("logged in user is " + success);
                        console.log("logged in token is " + loginToken);

                        console.log("login successful ...");
                        socket.broadcast.emit('loginRet', { data: "success" });
                    }
                    else {
                        console.log("login failed ...");
                        socket.broadcast.emit('loginRet', { data: "failed" });
                    };
                } else {
                    console.log("login error ...");
                    socket.broadcast.emit('loginRet', { data: "failed" });
                };
            }
        );
    } else {

        if ((credentials[0] == "Païvi") && (credentials[1] == "secret")) {
            console.log("login successful ...");
            socket.broadcast.emit('loginRet', { data: "success" });
        } 
        if ((credentials[0] == "Tommi") && (credentials[1] == "password")) {
            console.log("login successful ...");
            socket.broadcast.emit('loginRet', { data: "success" });
        }
        
    }
    

    //return loggedIn;
};




