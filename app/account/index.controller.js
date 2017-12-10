//Default controller for account - makes "user" object available to view, creates methods 
//for update/delete user accounts

(function(){
	'use strict';
	
	angular
		.module('app')
		.controller('Account.IndexController', Controller);

	function Controller($window, UserService, FlashService) {
		var dc = this;
		
		dc.user = null;
		dc.saveUser = saveUser;
		dc.deleteUser = deleteUser;
		
		initController();
	
	
		function initController() {
			// ges current user (overrides null init)
			UserService.GetCurrent().then(function (user) {
				dc.user = user;
			});
		}
		
		function saveUser() {
			UserService.Update(dc.user)
				.then(function() {
					FlashService.Success('user updated');
				})
				.catch(function (error) {
					FlashService.Error(error);
				});
		}
		
		function deleteUser() {
			UserService.Delete(dc.user._id)
				.then(function () {
					// log user out
					$window.location = '/login';
				})
				.catch(function (error) {
					FlashService.Error(error);
				});
		}
	}
})();
