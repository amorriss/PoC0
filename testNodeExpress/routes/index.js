"use strict";
/*
 * GET home page.
 */
var express = require("express");
var router = express.Router();
router.get('/', function (req, res) {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/login.html");
    //res.sendfile("views/main.html");
});
router.get('/main', function (req, res) {
    //res.render('index', { title: 'Testing ....' });
    //res.sendfile("views/login.html");
    res.sendfile("views/main.html");
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=index.js.map