/*
 * GET home page.
 */
import express = require('express');

const router = express.Router();


router.get('/', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Testing ....' });
    res.sendfile("views/Page1.html");
    //res.sendFile("views/Page1.html");
});

export default router;
