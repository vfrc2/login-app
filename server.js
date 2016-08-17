var express     = require('express');
var passport    = require('passport');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var args = initArgs();

var app      = express();
var port     = process.env.PORT || args.port || 8080;

require('./config/passport')(passport, args.passwd); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: args.secret || 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);


function initArgs() {
    return require('yargs')
    .option('port', {
        alias: 'p',
        describe: 'Listen port',
        default: 8080
    })
    .option('passwd', {
        describe:'File with passwords',
        default:'.passwd.json'
    })
    .option('secret', {
        describe:'session secret',
        default:''
    })
    .help()
    .argv
}