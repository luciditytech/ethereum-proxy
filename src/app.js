import Express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import { errors } from 'celebrate';

import routes from './routes';

const app = new Express();

app.use(compression());
app.use(bodyParser.json({limit:'2mb'}));
app.use(bodyParser.urlencoded({ limit:'2mb', extended: true }));
app.use('/', routes);
app.use(errors());

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (!err) {
    console.log(`Server is running on port: ${port}`);
  }
});

export default app;

