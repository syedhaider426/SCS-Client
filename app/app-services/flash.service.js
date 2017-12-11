// Flash Service to show the user both success and error messages in angular app
//Flashes messages to /app/index.html where code for displaying flash messages is located
//Cleared on location change so only displays once

(function () {
    'use strict';

    angular
        .module('app')
        .factory('FlashService', Service)

    //Uses $rootScope so it may access /app/index.html
    function Service($rootScope) {
        var service = {};

        service.Success = Success;
        service.Error = Error;

        initService();

        return service;

        /*-----------Initialization and Deletion for Flash messages--------------*/
        function initService() {
            //Clears flash message on location change
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });
            //Function that deletes the flash message 
            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    }
                    //only keeps for one location change, next run-through deletes
                    else {
                        flash / keepAfterLocationChange = false;
                    }
                }
            }
        }
        /*----------------------------------------------------------------------*/


        /*--------------------Flash Message Success/Errors----------------------*/
        function Success(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'success',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }
        function Error(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'danger',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }
        /*------------------------------------------------------------------------*/
    }
})();