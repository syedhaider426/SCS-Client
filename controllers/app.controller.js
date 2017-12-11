// Controls access to angular app client files
// Uses session/cookie authentication to secure the angular files and also exposes JWT token to be used by the angular app to make authenticated api requests

var express = require('express');
var router = express.Router();
 
// use session auth to secure the angular app files
// '/' indicates file hierarchy
router.use('/', function (req, res, next) {
    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));
    }
 
    next();
});
 
// make JWT token available to angular app (meaning that Angular can utilize the token)
router.get('/token', function (req, res) {
    res.send(req.session.token); 
});
 
// serve angular app files from the '/app' route
// Views and indexes
router.use('/', express.static('app'));
 
module.exports = router;


// Route #1: Redirects the login
// Route #2: Send the JWT token
// Route #3: Makes views and indexes static/default (so it doesn't change) in the app folder
