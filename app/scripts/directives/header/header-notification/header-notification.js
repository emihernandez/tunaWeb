'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('headerNotification',function(){
		return {
        templateUrl:'scripts/directives/header/header-notification/header-notification.html',
        restrict: 'E',
        replace: true,
        controller:function($scope, AuthService){
          $scope.userInfo = {};
          $scope.userInfo.username = '';
          $scope.userInfo.roles = '';
          
          $scope.getUserInfo = function(){
            $scope.userInfo.username = AuthService.authData.tokenData.username;
            $scope.userInfo.roles = AuthService.authData.tokenData.roles;
          }
          
          $scope.getUserInfo();
        }
    	}
	});


