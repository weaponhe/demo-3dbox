var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var GitHubStrategy = require('passport-github2').Strategy;

var GITHUB_CLIENT_ID = "b21159b60dc743233a34";
var GITHUB_CLIENT_SECRET = "d75300f9e1f44e245a53e03fbf8400aeb713da85";

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

var app = express();
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.render('index', {user: req.user});
});

app.get('/account', function (req, res) {
    res.render('account', {user: req.user});
});

app.get('/login', function (req, res) {
    res.render('login', {user: req.user});
});

app.get('/logout', ensureAuthenticated, function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/auth/github',
    passport.authenticate('github'),
    function (req, res) {
    }
);

app.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('/');
    }
);

app.listen(3000);


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}