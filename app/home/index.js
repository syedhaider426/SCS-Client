//Index controller - Default controller for home section, getting current user and displaying name

(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService) {
        var cd = this;

        cd.user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user)){
                cd.user = user;
            });
        }
    }
    module.exports.respond = function (socket_io) {
        socket_io.on('chat message', function (msg) {
            io.emit('chat message', msg);
    });
});