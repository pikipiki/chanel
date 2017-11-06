'use strict';

import bodyParser   from 'body-parser';
import cookieParser from 'cookie-parser';
import express      from 'express';
import http         from 'http';
import logger       from 'morgan';

import apiRoutes    from './src/routes';
import db           from './src/models';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;




app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'twig');
app.use(express.static('statics'))
app.set('views', './src/views');

app.use('/api', apiRoutes);

app.close = () => {
    server.close();
    db.close();
}

app.listen(() => {
    server.listen(port, () => {
        console.log(`Express server listening on port ${port} in ${app.settings.env} mode`);
    });
});

////////////

export default app;