/*
 * GET home page.
 */
import express = require('express');

const router = express.Router();
var name = "none";


router.get('/', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/login.html");
});

router.get('/main', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/main.html");
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





