"use strict";
/*
 * GET home page.
 */
var express = require("express");
var router = express.Router();
var name = "none";
router.get('/', function (req, res) {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/createright.html");
});
router.get('/createright', function (req, res) {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/createright.html");
});
router.get('/createservice', function (req, res) {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/createservice.html");
});
router.get('/services', function (req, res) {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/services.html");
});
router.get('/loginfail', function (req, res) {
    //read form data
    console.log("in index.loginfail");
    console.log(req.param("name"));
    name = req.param("name");
    res.render('loginfail', { name: name.toString() });
});
router.get('/error', function (req, res) {
    res.render('error', { title: 'There was an ERROR !' });
});
router.post('/', function (req, res) {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/login.html");
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=index.js.map