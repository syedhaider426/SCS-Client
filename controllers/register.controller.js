

//The express register controller defines routes for displaying the register view and registering a new user. As with the login controller (above) it uses the api to register new users in order to maintain clean separation from the api and database layers

var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

//Returns the register view
router.get('/', function (req, res) {
    res.render('register');
});
 
router.post('/', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/register',
        form: req.body,
        json: true
	//If the user does not register properly, return an error message
    }, function (error, response, body) {
        if (error) {
            return res.render('register', { error: 'An error occurred' });
        }
 
	//If the user does not register properly, return an error message
        if (response.statusCode !== 200) {
            return res.render('register', {
                error: response.body,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username
            });
        }
 
        // return to login page with success message
        req.session.success = 'Registration successful';
        return res.redirect('/login');
    });
});
 
module.exports = router;
