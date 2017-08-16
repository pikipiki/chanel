"use strict";
import express      from 'express';
import logger       from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser   from 'body-parser';
import http         from 'http'

import { routeIndex }       from './routes/index';
import DB from './lib/db';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const db = DB(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routeIndex);

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

app.close = function() {
    server.close();
};

app.listen(() => {
    server.listen(port, () => {
        console.log("Express server listening on port " + port + " in " + app.settings.env + " mode");
    });
});

export default app;