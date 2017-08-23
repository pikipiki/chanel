"use strict";
import express      from 'express';
import logger       from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser   from 'body-parser';
import http         from 'http'

import { routeIndex }   from './routes/index';
import routeFlush       from './routes/flush';
import DB from './lib/db';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

DB(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', routeIndex);
app.use('/flush', routeFlush);

app.close = function() {
    server.close();
};

app.listen(() => {
    server.listen(port, () => {
        console.log("Express server listening on port " + port + " in " + app.settings.env + " mode");
    });
});

export default app;