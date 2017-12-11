//The express login controller defines routes for displaying the login view and authenticating user credentials. It uses the api to authenticate rather than using the user service directly, this is to keep the api and database layers cleanly separated from the rest of the application so they could easily be split if necessary and run on separate servers.

//On successful authentication the jwt token returned from the api is stored in the user session so it can be made available to the angular application when it loads (via the '/token' route defined in the express app controller above).

var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
 
//Logout
router.get('/', function (req, res) {
    delete req.session.token;
 
    // move success message into local variable so it only appears once (single read)
    var viewData = { success: req.session.success };
    delete req.session.success;
 
    res.render('login', viewData);
});
 
//Login using api
router.post('/', function (req, res) {

    request.post({
        url: config.apiUrl + '/users/authenticate',
        form: req.body,
        json: true
	
	//Login = false
    }, function (error, response, body) {
        if (error) {
            return res.render('login', { error: 'An error occurred' });
        }

	//Username/password = incorrect 
        if (!body.token) {
            return res.render('login', { error: 'Username or password is incorrect', username: req.body.username });
        }
 
        // save JWT token in the session to make it available to the angular app
	// The token is used to prove login credentials
        req.session.token = body.token;
 
        // redirect to returnUrl
        var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
        res.redirect(returnUrl);
    });
});
 
module.exports = router;
