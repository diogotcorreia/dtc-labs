import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

app.disable('x-powered-by');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// App routes
routes(app);

var port = process.env.PORT || 5000;
app.listen(port);
console.log('Listening on port ' + port);
