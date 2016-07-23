'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('LoginCtrl', function($scope, $location, $localStorage, AuthService,$rootScope, ngToast) {
   
    //localStorage.clear();
  
    $scope.login = function(){

      ngToast.settings.verticalPosition = 'bottom';
      ngToast.settings.horizontalPosition = 'right';
      ngToast.settings.maxNumber = 3;

      if(($scope.user !== null && $scope.user !== undefined)){
              
        AuthService.signIn($scope, $scope.user.name, $scope.user.pass).then(
          function (data){
            $location.url("/dashboard/home");
            $rootScope.$emit('auth.changed', {signedIn: true});
          },
          function (data){
             ngToast.danger('Usuario/contraseña invalido');
             console.log("login error " + data);
           // $scope.errorMessage = "Invalid user or password";
            //$mdToast.show($mdToast.simple().content("Usuario o contraseña invalida"));
          });
      } else {
        ngToast.danger('Debe ingresar el usuario y contraseña');
      }
      console.log("login LoginCntr");
  }
  
  $scope.logout = function(){    
    AuthService.signOut();//.then();    
    //$rootScope.$emit('auth.changed', {signedIn: true});
  }
});