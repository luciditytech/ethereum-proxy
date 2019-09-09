import Express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import { errors } from 'celebrate';

import routes from './routes';

const { subscribe, unsubscribe } = require('./lastBlockHeader');

const app = new Express(),
  server = require('http').createServer(app);

app.use(compression());
app.use(bodyParser.json({limit:'2mb'}));
app.use(bodyParser.urlencoded({ limit:'2mb', extended: true }));
app.use('/', routes);
app.use(errors());

server.on('listening', () => {
  subscribe();
});

server.on('close', () => {
  unsubscribe();
});

export default server;
