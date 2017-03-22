/*
 * GET home page.
 */
import express = require('express');

const router = express.Router();


router.get('/', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/login.html");
    //res.sendfile("views/main.html");
});

router.get('/main', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    //res.sendfile("views/login.html");
    res.sendfile("views/main.html");
});

export default router;
