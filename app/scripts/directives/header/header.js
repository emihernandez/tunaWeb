'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
// angular.module('sbAdminApp')
	// .directive('header',function(){
    
    // var hambClick = function(){
        // console.log('click');
    // }
		// return {
        // templateUrl:'scripts/directives/header/header.html',
        // restrict: 'E',
        // replace: true,
        // hambClick:hambClick
    	// }
	// });
  

  'use strict';
  angular.module('sbAdminApp')
  .directive('header', header);
  /* @ngInject */
  function header() {

    var directive = {
      bindToController: true,
      controller: SearchBoxController,
      controllerAs: 'vm',
      restrict: 'E',
      scope: { 'navline': '=' },
      templateUrl:'scripts/directives/header/header.html'
    };

    /* @ngInject */
    /*jshint maxparams:17*/
    function SearchBoxController($q, $scope, $rootScope, $localStorage) {
      /*global $:false */
      var vm = this;
      
      var strCollapsed = 'hold-transition skin-blue sidebar-mini sidebar-collapse';
      var strOpen = 'hold-transition skin-blue sidebar-mini  sidebar-open';
      
      function isBreakpoint( alias ) {
          return $('.device-' + alias).is(':visible');
      }
    
      if( isBreakpoint('xs') ||  isBreakpoint('sm')) {
          //$rootScope.bodylayout  = strCollapsed;//'hold-transition skin-blue sidebar-mini';
          if ( $localStorage.hambStatus !== undefined ) {
              $scope.collapsed = $localStorage.hambStatus;
          } else {
            $scope.collapsed = true;
          }
      } else {
        if ( $localStorage.hambStatus !== undefined ) {
            $scope.collapsed = $localStorage.hambStatus;
        } else {
          $scope.collapsed = false;
        }
      }
      $rootScope.bodylayout  = ($scope.collapsed)?strCollapsed:strOpen;
      $localStorage.hambStatus = $scope.collapsed;
      vm.hambClick = function() {

       $scope.collapsed = !$scope.collapsed;
       $localStorage.hambStatus = $scope.collapsed;
       if ( $scope.collapsed ) {
          $rootScope.bodylayout  = strCollapsed;
       } else {
          $rootScope.bodylayout  = strOpen;
       }
      };

      
    }
    return directive;
  }



