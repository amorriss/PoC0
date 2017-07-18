
var socketIo = require('socket.io');
var mysql = require("mysql");
let dbURL = "51.140.59.244";
var mySocket;
var dbConnection;
var loginToken;
var loggedIn: boolean = false;
let serverURL = "http://bcserver.uksouth.cloudapp.azure.com:8080/";    // http://rapley.ukwest.cloudapp.azure.com:8080/      // http://bcserver.uksouth.cloudapp.azure.com:8080/   //https://dn-server.eu-gb.mybluemix.net/
var serverAvailable = true;
var retryCount = 3;

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

            // -------------------- DN query
            socket.on('queryBC', function (data) {
                console.log("Query BC function called from browser");

                if (serverAvailable) {

                    var userID = data.data;
                    console.log("ID " + userID);
                    var request = require('request');
                    var options = {
                        url: serverURL + 'api/certificates/' + userID,
                        headers: {
                            'x-access-token': loginToken
                        }
                    };

                    request.get(
                        options,
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var certs = JSON.parse(body);
                                console.log("certs returned are " + body);

                                setTimeout(function () { socket.emit('queryBCRet', { data: body }) }, 500);
                               // socket.broadcast.emit('queryBCRet', { data: body });
                                
                                console.log("after broadcast ");
                            } else {
                                console.log("get cert error ...");
                                socket.broadcast.emit('queryBCRet', { data: "Failed to get query BC" });
                            };
                        }
                    );
                }

                

            });


            // ----------------- services

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
                    console.log("service data name" + dataObj.data.name);
                    var serviceData = dataObj.data;

                    var request = require("request");

                    var options = {
                        method: 'POST',
                        url: serverURL + 'api/services/',
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



            socket.on('retrieveService', function (data) {
                console.log(data);
                console.log("Create new service server function called from browser");
                socket.broadcast.emit('createServiceRet', { data: data.data });
            });

            socket.on('amendService', function (dataObj) {
                console.log("Amend service server function called from browser");

                if (serverAvailable) {

                    // get passed data
                    console.log("service data " + dataObj.data.name);
                    var serviceData = dataObj.data;

                    var request = require("request");

                    var options = {
                        method: 'PUT',
                        url: serverURL + 'api/services/' + dataObj.data.name,
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
                            console.log("Amended service error ..." + response.statusCode);
                            socket.broadcast.emit('amendServiceRet', { data: "Failed to amend service" });
                        };
                    });
                }
            });


            socket.on('createService', function (data) {
                console.log(data);
                console.log("Create new service server function called from browser");
                socket.broadcast.emit('createServiceRet', { data: data.data });
            });

            // --------------- rights 

            //socket.on('createRight', function (data) {
            //    console.log(data);
            //    console.log("Create right server function called from browser");
            //    socket.broadcast.emit('createRightRet', { 'message': 'Created Right' });
            //});

            socket.on('getRight', function (dataObj) {
                console.log(dataObj.data);
                console.log("Get right server function called from browser");

                if (serverAvailable) {
                    var rightName = dataObj.data;
                    var request = require('request');
                    var options = {
                        url: serverURL + 'api/rightTypes/' + rightName,
                        headers: {
                            'x-access-token': loginToken
                        }
                    };

                    request.get(
                        options,
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var right = JSON.parse(body);
                                console.log("right is " + body);
                                socket.broadcast.emit('getRightRet', { data: right });
                            } else {
                                console.log("get right error ...");
                                socket.broadcast.emit('getRightRet', { data: "Failed to get right" });
                            };
                        }
                    );
                }
            });

            socket.on('createNewRight', function (dataObj) {
                console.log("Create new right server function called from browser");

                if (serverAvailable) {

                    // get passed data
                    console.log("right data " + dataObj.data.rightTypeName);
                    var rightData = dataObj.data;

                    var request = require("request");

                    var options = {
                        method: 'POST',
                        url: serverURL + 'api/righttypes/',
                        headers:
                        {
                            'cache-control': 'no-cache',
                            'content-type': 'application/json',
                            'x-access-token': loginToken
                        },
                        body:
                        {
                            rightTypeName: rightData.rightTypeName,
                            valueLimit: rightData.valueLimit,
                            idVerification: rightData.idVerification,
                            timeLimit: rightData.timeLimit,
                            divisibility: rightData.divisibility,
                            tax: rightData.tax
                        },
                        json: true
                    };

                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {

                            console.log("created new right " + response);
                            socket.broadcast.emit('createNewRightRet', { data: "success" });
                        } else {
                            console.log("create new service error ..." + response.statusCode);
                            socket.broadcast.emit('createNewRightRet', { data: "Failed to create right" });
                        };
                    });
                }
            });


            socket.on('amendRight', function (dataObj) {
                console.log("Amend right server function called from browser");

                if (serverAvailable) {

                    // get passed data
                    console.log("right data " + dataObj.data.name);
                    var rightData = dataObj.data;

                    var request = require("request");

                    var options = {
                        method: 'PUT',
                        url: serverURL + 'api/righttypes/' + rightData.rightTypeName,
                        headers:
                        {
                            'cache-control': 'no-cache',
                            'content-type': 'application/json',
                            'x-access-token': loginToken
                        },
                        body:
                        {
                            rightTypeName: rightData.rightTypeName,
                            valueLimit: rightData.valueLimit,
                            idVerification: rightData.idVerification,
                            timeLimit: rightData.timeLimit,
                            divisibility: rightData.divisibility,
                            tax: rightData.tax
                        },
                        json: true
                    };

                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {

                            console.log("Amended right " + response);
                            socket.broadcast.emit('amendRightRet', { data: "success" });
                        } else {
                            console.log("Amended right error ..." + response.statusCode);
                            socket.broadcast.emit('amendRightRet', { data: "Failed to amend right" });
                        };
                    });
                }
            });

            socket.on('logout', function (data) {
                console.log(data);
                console.log("logout server function called from browser");
                socket.broadcast.emit('logoutRet', { 'message': 'Logged Out' });
                retryCount = 3;
            });

            socket.on('logoutHC', function (data) {
                console.log(data);
                console.log("logout HC server function called from browser");
                socket.broadcast.emit('logoutRet', { 'message': 'Logged Out' });
                // disconnect from database
                dbConnection.release();
                retryCount = 3;
            });

            // -------------------------- HOUSING APP socket methods -------------------------------------
            // -----------------------------------------------------

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


            socket.on('createNewCertBC', function (dataObj) {
                console.log("Create new certificate on BC server function called from browser");

                if (serverAvailable) {

                    // get passed data
                    var certBCData = dataObj.data;

                    if (certBCData.tax_paid == "Y") {
                        certBCData.tax_paid = "true";
                    } else {
                        certBCData.tax_paid = "false";
                    }

                    var request = require("request");

                    var options = {
                        method: 'POST',
                        url: serverURL + 'api/certificates',
                        headers:
                        {
                            'cache-control': 'no-cache',
                            'content-type': 'application/json',
                            'x-access-token': loginToken
                        },
                        body:
                        {
                            rightTypeName: "Freehold",
                            propertyID: certBCData.property_id,
                            ownerID: certBCData.owner_id.toString(),
                            taxPaid: certBCData.tax_paid
                        },
                        json: true
                    };

                    request(options, function (error, response, body) {
                        console.log("response status code is " + response.statusCode);
                        if (!error && response.statusCode == 200) {

                            console.log("created new certificate " + response);
                            socket.broadcast.emit('createNewCertRet', { data: "success" });
                        } else {
                            var responseStr = JSON.stringify(response.body);
                            if (responseStr.indexOf("has not been validated") > 1) {
                                console.log("Owner not validated ..." + response.statusCode);
                                socket.broadcast.emit('createNewCertRet', { data: "User not validated" });
                            } else {
                                console.log("create new certificate error ..." + response.statusCode);
                                socket.broadcast.emit('createNewCertRet', { data: "Failed to create certificate" });
                            }
                        };
                    });
                }
            });


            socket.on('amendCert', function (dataObj) {
                console.log("Amend certificate server function called from browser");

                if (serverAvailable) {

                    // get passed data
                    var certData = dataObj.data;
                    console.log("cert data " + certData.owner);
                    console.log("cert data " + certData.propertyID);
                    console.log("cert data " + certData.price);
                    console.log("cert data " + certData.taxPaid);

                    var request = require("request");

                    var options = {
                        method: 'PUT',
                        url: serverURL + 'api/certificates/' + certData.propertyID,
                        headers:
                        {
                            'cache-control': 'no-cache',
                            'content-type': 'application/json',
                            'x-access-token': loginToken
                        },
                        body:
                        {
                            description: certData.description,
                            propertyID: certData.propertyID,
                            owner: certData.owner,
                            authenticationDate: certData.authenticationDate,
                            registrationDate: certData.registrationDate,
                            price: certData.price,
                            taxPaid: certData.taxPaid
                        },
                        json: true
                    };

                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {

                            console.log("amended certificate " + response);
                            socket.broadcast.emit('amendCertRet', { data: "success" });
                        } else {
                            var responseStr = JSON.stringify(response.body);

                            if (responseStr.indexOf("has not been validated") > 1) {
                                console.log("Owner not validated ..." + response.statusCode);
                                socket.broadcast.emit('amendCertRet', { data: "User not validated" });
                            } else {
                                console.log("amended certificate error ..." + response.statusCode);
                                socket.broadcast.emit('amendCertRet', { data: "Failed to amend certificate" });
                            }
                        };
                    });
                }
            });


            socket.on('getCerts', function (dataObj) {

                console.log("Get certs server function called from browser");

                if (serverAvailable) {
                    var certPropertyID = dataObj.toString();
                    certPropertyID = certPropertyID.replace(/-/g, '');
                    console.log("ID" + certPropertyID);
                    var request = require('request');
                    var options = {
                        url: serverURL + 'api/certificates/',
                        headers: {
                            'x-access-token': loginToken
                        }
                    };

                    request.get(
                        options,
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var certs = JSON.parse(body);
                                console.log("certs are " + body);
                                socket.broadcast.emit('getCertsRet', { data: certs });
                            } else {
                                console.log("get cert error ...");
                                socket.broadcast.emit('getCertsRet', { data: "Failed to get certs" });
                            };
                        }
                    );
                }
            });

            // mySQL database functions

            // connect to remote mySQL db
            socket.on('connecttodb', function (data) {
                var pool = mysql.createPool({
                    connectionLimit: 100,
                    host: dbURL,
                    port: 3306,
                    user: 'root',
                    password: 'Innovation3182',
                    database: 'HCtest',
                });
                pool.getConnection(function (err, conn) {
                    if (err) {
                        dbConnection = null;
                        console.log("db connect error " + err);
                    } else {
                        dbConnection = conn;
                        console.log("db connect success");
                    }
                });
            });

            // get housing data from mySQL db
            socket.on('getCertsDB', function (data) {
                if (dbConnection != null) {
                    dbConnection.query('SELECT * FROM housing', function (err, rows) {
                        if (err) {
                            console.log("getCertsDB failed : " + err);
                            socket.broadcast.emit('getCertsRet', { data: "Failed to get certs" });
                        } else {
                            console.log('Data received from Db:\n');
                            //  console.log(rows);
                            socket.broadcast.emit('getCertsRet', { data: rows });
                        }
                    });
                } else {
                    retryCount--;
                    if (retryCount > 0) {
                        socket.broadcast.emit('retryGetCertsDB');
                    } else {
                        console.log("No database connection");
                    }
                }
            });


            // get housing data from mySQL db
            socket.on('createNewCertDB', function (dataObj) {
                if (dbConnection != null) {
                    var certData = dataObj.data;
                    console.log("createNewCertDB auth date " + certData.authentication_date);

                    dbConnection.query('INSERT INTO housing SET ?', certData, function (err, res) {
                        if (err) {
                            console.log("createNewCertDB failed : " + err);
                            socket.broadcast.emit('createNewCertRet', { data: "Failed to create new cert" });
                            //} else if (res.indexOf("has not been validated") > 1) {
                            //    console.log("Owner not validated ..." + res.statusCode);
                            //    socket.broadcast.emit('createNewCertRet', { data: "User not validated" });
                        } else {
                            console.log('Last insert ID:', res.insertId);
                            //  console.log(rows);
                            socket.broadcast.emit('createNewCertRet', { data: "success" });
                        }
                    });
                } else {
                    console.log("No database connection");
                }
            });

            // get housing data from mySQL db
            socket.on('amendCertDB', function (dataObj) {
                if (dbConnection != null) {
                    var certData = dataObj.data;
                    console.log("amendCertDB ID to update is " + certData.owner_id);

                    //var certData = {
                    //    id: 0,
                    //    description: "",
                    //    property_id: "",
                    //    owner: "None",
                    //    owner_id: 0,
                    //    authentication_date: 0,
                    //    registration_date: 0,
                    //    price: 0,
                    //    tax_paid: "N"

                    dbConnection.query('UPDATE housing SET ? WHERE ID = ?', [certData, certData.id], function (err, res) {
                        if (err) {
                            console.log("amendCertDB failed : " + err);
                            socket.broadcast.emit('amendCertDBRet', { data: "Failed to amend cert" });
                        } else {
                            console.log('Updated:', res.message);
                            //  console.log(rows);
                            socket.broadcast.emit('amendCertDBRet', { data: "success" });
                        }
                    });
                } else {
                    console.log("No database connection");
                }
            });

            socket.on('deleteCert', function (dataObj) {
                if (dbConnection != null) {
                    var dbID = dataObj.data;
                    console.log("deleteCert ID " + dbID);

                    dbConnection.query('DELETE FROM housing where ID = ?', dbID, function (err, res) {
                        if (err) {
                            console.log("deleteCert failed : " + err);
                            socket.broadcast.emit('deleteCertRet', { data: "Failed to delete cert" });
                        } else {
                            console.log('Deleted ID:', dbID);
                            //  console.log(rows);
                            socket.broadcast.emit('deleteCertRet', { data: "success" });
                        }
                    });
                } else {
                    console.log("No database connection");
                }

            });
        });
        return io;
    }
};


function validatelogin(data: string, socket) {

    var credentials = data.split(":");

    if (!loggedIn) {
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
                            loggedIn = true;
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
            if ((credentials[0] == "Tommi") && (credentials[1] == "passw0rd")) {
                console.log("login successful ...");
                socket.broadcast.emit('loginRet', { data: "success" });
            }

        } 
    } else {
        console.log("already logged in ...");
        socket.broadcast.emit('loginRet', { data: "success" });
    }


    //return loggedIn;
};




