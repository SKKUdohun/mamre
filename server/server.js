'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import configure from './configure';
import { mysql } from './modules';

import api from './routes';

//server setting
const app = express();
const port = configure.PORT;

mysql.makeConnection({
    host     : configure.DB_HOSTNAME,
    user     : configure.DB_USER,
    password : configure.DB_PASSWORD,
    database : configure.DB_NAME
});

/*
배포판이 아니면 HTTP 접근 제어 (CORS)를 허용한다.
 */
if(configure.NODE_ENV !== 'production')
    app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('trust proxy', true);

//routes api
app.use('/api', api);

//index 라우팅
app.get('/', (req,res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

//
app.use('/', express.static(path.join(__dirname, './../public')));

//
app.use((req,res) => {
    res.status(404).send('NOT FOUND');
});

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err);
    // If our routes specified a specific response, then send that. Otherwise,
    // send a generic message so as not to leak anything.
    res.status(500).send(err.response || 'Something broke!');
});

app.listen(port, () => {
    console.log('SERVER PORT', port);
});

export default app;
//for testing






















