const express = require('express');
const bodyParser = require('body-parser'); 
const config =require('config');
const methodOverride = require('method-override');
const routes = require('./routes');

const app = express();

app.set('port', config.get('port') || process.env.PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

// declaring routes
routes(app);

app.listen(app.get('port'), () => console.log(`The server is running on the port ${app.get('port')}`));
