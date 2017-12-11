//App.js is entry point for angular application
//Uses config to define application routes using Angular UI

(function () {
    'use strict';

    //uses app module, requires ui.router
    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run)

    //defines routes with ui.router (stateprovider)
    function config($stateProvider, $urlRouterProvider) {
        //default route
        $urlRouterProvider.otherwise("/");

        //Instead of "routers" angular uses $stateProvider

        //two states are default 'home' state and 'account' state
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'cd',
                data: { activeTab: 'home' }
            });
    }

    //adds jwt as default auth header
    function run($http, $rootScope, $window) {
        //jwt as auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        /*update active tab on state change - listens for state change success using following function,
        sets active tab to following active tab*/
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after jwt is retrieved from the server
    $(function () {
        //get JWT from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            //bootstraps with array of application module(s) to be loaded
            angular.bootstrap(document, ['app']);
        });
    });
})();
