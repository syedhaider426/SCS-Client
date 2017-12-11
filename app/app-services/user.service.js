// User Service: interaction with web API for create, read, update, delete
// To be integrated with mongoskin

(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);


    function Service($http, $q) {
        var service = {};

        //Declaring CRUD operations for service function
        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        /*CRUD functions, then using success/fail */

        //Get current user
        function GetCurrent() {
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        //Gets list of all users
        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError);
        } 

        //Gets User from user table by ID
        function GetByID(_id) {
            return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
        }

        //Gets User from user table by username
        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError);
        }

        //CREATE user by $http.post
        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        //UPDATE user with $http.put
        function Update(user) {
            return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
        }
        //DELETE user with $http.delete
        function Delete(_id) {
            return $http.delete('/api/users/' + _id).then(handleSuccess, handleError);
        }

        //private functs
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res){
            return $q.reject(res.data);
        }

    }
})();