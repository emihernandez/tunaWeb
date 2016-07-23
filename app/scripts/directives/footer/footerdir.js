'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('footerdir',function(){
		return {
        templateUrl:'scripts/directives/footer/footer.html',
        restrict: 'E',
        replace: true,
    	}
	});


