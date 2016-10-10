var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function (username, password, done) {
    if (username != 'foo') {
        return done(null, false);
    }
    if (password != '123456') {
        return done(null, false);
    }
    return done(null, {username: username});
}));

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.render('index', {user: req.user});
});

app.get('/login', function (req, res) {
    res.render('login', {user: req.user});
});
app.post('/login',
    passport.authenticate('local', {failureRedirect: '/login'}),
    function (req, res) {
        console.log(req.user);
        res.redirect('/');
    }
);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(3000);