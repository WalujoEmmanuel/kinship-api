require('dotenv-safe').config({path: require('path').resolve(__dirname, '..') + '/.env'});

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');


const passport = require('./middlewares/passport-config');
const { authenticate, isAuthenticated } = require('./middlewares/authentication');

const schema = require('./schemas/index');
const config = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use(passport.initialize());

app.use(authenticate);
app.use(isAuthenticated);

app.use('/api', graphqlHTTP({
    schema,
    graphiql: true
}));

var server = app.listen(config.app.port, function () {
    var port = server.address().port
    console.log("POS API Listening to %s", port);
});

