//The express user service encapsulates all data access and business logic for users behind a simple interface. It exposes methods for CRUD operations and user authentication.

//All of the service methods use promises in order to keep the users api controller simple and consistent, so all service methods can be called with the pattern [service method].then(...).catch(...);

//Mongoskin is the MongoDB driver used to access to the database, it provides a thin layer over the native mongodb driver that makes it a bit simpler to perform CRUD operations.

var config = require('config.json');

//Useful for Iterating arrays, objects, & strings, Manipulating & testing values, and Creating composite functions
var _ = require('lodash');
var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');
//Essentialy a 'step-by-step' process
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
 
var service = {};
 
//Dictionary of methods (login, retrieve info, create/update/delete user)

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
 
module.exports = service;

function authenticate(username, password) {
    //Returns a task which will be finished in the future
    var deferred = Q.defer();
 
    //Finds one specific user in the database of users
    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err);
 
        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });
 
    return deferred.promise;
}
 
//Gets the user based off their id
function getById(_id) {
    var deferred = Q.defer();
 
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err);
 
        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });
 
    return deferred.promise;
}
 
//Creates the user 
function create(userParam) {
    var deferred = Q.defer();
 
    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err);
 
            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });
 
    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');
 
        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
 
        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err);
 
                deferred.resolve();
            });
    }
 
    return deferred.promise;
}
 
//Updates username, firstname,lastname
function update(_id, userParam) {
    var deferred = Q.defer();
 
    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err);
 
        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err);
 
                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });
 
    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };
 
        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }
 
        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);
 
                deferred.resolve();
            });
    }
 
    return deferred.promise;
}
 
// prefixed function name with underscore because 'delete' is a reserved word in javascript
function _delete(_id) {
    var deferred = Q.defer();
 
    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err);
 
            deferred.resolve();
        });
 
    return deferred.promise;
}
