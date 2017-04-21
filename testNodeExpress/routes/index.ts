/*
 * GET home page.
 */
import express = require('express');

const router = express.Router();
var name = "none";

// ---------------------- Housing co. routing ------------------

router.get('/HC', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/HClogin.html");
});

router.get('/createhouse', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/createhouse.html");
});

router.get('/houses', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/houses.html");
});

router.get('/HCloginfail', (req: express.Request, res: express.Response) => {
    //read form data
    console.log("in index.HCloginfail");
    console.log(req.param("name"));
    name = req.param("name");
    res.render('HCloginfail', { name: name.toString() });
});


// ------------------- Housing reg routing --------------------

router.get('/', (req: express.Request, res: express.Response) => {
  //  res.render('index', { title: 'Testing ....' });
    res.sendfile("views/login.html");
});

router.get('/createright', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/createright.html");
});

router.get('/createservice', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/createservice.html");
});
  router.get('/services', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/services_grid.html");
});

router.get('/loginfail', (req: express.Request, res: express.Response) => {
    //read form data
    console.log("in index.loginfail");
    console.log(req.param("name"));
    name = req.param("name");
    res.render('loginfail', { name: name.toString() });
});

router.get('/error', (req: express.Request, res: express.Response) => {
    res.render('error', { title: 'There was an ERROR !' });
});

router.post('/', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/login.html");
});

export default router;





