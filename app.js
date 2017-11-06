"use strict";
var express = require('express');
import logger       from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser   from 'body-parser';
import http         from 'http'

import routeProducts       from './routes/products';
import routeIndex       from './routes/index';

var app = express();
const server = http.createServer(app);
let port = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view engine","twig");
app.use(express.static('views'));

// app.get('/', routeIndex);
app.use('/products', routeProducts);
app.get('/products/list', function(req, res) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('database.sqlite');

    db.all("SELECT * FROM products", function(err, rows) {
        res.render('list', {products: rows});
    });

    db.close();
})

app.close = function() {
    server.close();
}

app.listen(() => {
    server.listen(port, () => {
        console.log("Express server listening on port " + port + " in " + app.settings.env + " mode");
    });
});

export default app;