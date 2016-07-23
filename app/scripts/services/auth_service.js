// angular.module('sgdae.authService', [])
// Check here: http://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543

angular.module('sbAdminApp')
  .factory('AuthService', function($http, $location, $rootScope, $localStorage, $q, SERVER_CONSTANTS) {
      
      var serverUrl = SERVER_CONSTANTS.SERVER_URL; 
          
      var authData = {
        signedIn: false, 
        tokenData: {}
      };
      authData.tokenData.token = null;
      authData.tokenData.rol = {};
      authData.tokenData.username = {};
      
      // Check current token
      // TODO: Check expiration
      if (typeof $localStorage.tokenData != 'undefined' && $localStorage.tokenData !== null){
        if (typeof $localStorage.tokenData.token != 'undefined' && $localStorage.tokenData.token !== null && typeof $localStorage.tokenData.token != 'undefined'){
          authData.signedIn = true;
        }
        authData.tokenData.token    = $localStorage.tokenData.token;
        authData.tokenData.rol    = $localStorage.tokenData.rol;
        authData.tokenData.username = $localStorage.tokenData.username;
      }
    
      return {
        // Cached data
        authData: authData,

        signIn : function($scope, user, pass) {
          var deferred = $q.defer();
          var loginData = {
            "username": user,  "clave": pass
          }; 
          $http.post(serverUrl + '/login', loginData, {headers: {'Content-Type': 'application/json'}})
            .success(function(responseData,status, headers, request) {
              //console.log(" resData:" + JSON.stringify(responseData));
              authData.signedIn   = true;
              authData.tokenData.token      = responseData.token;
              authData.tokenData.rol      = responseData.role;
              authData.tokenData.username   = user;
              //console.log('auth_services ' + user + ', ' + authData.tokenData.rol);
              $localStorage.tokenData = {};
              $localStorage.tokenData.token = authData.tokenData.token;
              $localStorage.tokenData.rol = authData.tokenData.rol;
              $localStorage.tokenData.username = user;
              $localStorage.filtroVerContrato = null;
              $localStorage.filtroVerRemito = null;
              $localStorage.filtroModificarContrato = null;
              $localStorage.filtroModificarRemito = null;
              $localStorage.filtroGenerarContrato = null;
              $localStorage.filtroGenerarRemito = null;
               // Notify all
               $rootScope.$emit('auth.changed', {signedIn: true});
               deferred.resolve(responseData);
            })
            .error(function(responseData) {
              console.log( "resData:" + responseData);
              authData.signedIn = false;
              authData.tokenData.token = '';
              authData.tokenData.rol = '';
              $localStorage.tokenData.token = null;
              $localStorage.tokenData.rol = null;
              $localStorage.tokenData.username = null;
              deferred.reject(responseData);
            });

          return deferred.promise;
        },
        
        signOut : function() {
          this.authData.signedIn = false;
          $localStorage.tokenData.token = null;
          $localStorage.tokenData.rol = null;
          $localStorage.tokenData.username = null;
          $localStorage.filtroVerContrato = null;
          $localStorage.filtroVerRemito = null;
          $localStorage.filtroModificarContrato = null;
          $localStorage.filtroModificarRemito = null;
          $localStorage.filtroGenerarContrato = null;
          $localStorage.filtroGenerarRemito = null;
          localStorage.clear();
          $rootScope.$emit('auth.changed', {signedIn: false});
          $location.url('/login');

        }, 
        checkRol : function(accion, VIEW_CONSTANTS) {
          if (authData.tokenData.rol === undefined || authData.tokenData.rol === null){
            return false;
          }
          var rol = authData.tokenData.rol;
            switch (rol){
              case "ADMIN": 
                return true;
              case "OPERADOR": //CORREGIR ROLES CUANDO ESTE TODO PRONTO
                switch(accion){
                  case 2:
                    return false;
                    break;
                  case 3:
                    return false;
                    break;
                  case 4:
                    return false;
                    break;
                  case 5:
                    return false;
                    break;
                  default:
                    return true;
                } 
              case "SUPERVISOR": //CORREGIR ROLES CUANDO ESTE TODO PRONTO
                switch(accion){
                  case 2:
                    return false;
                    break;
                  case 3:
                    return true;
                    break;
                  case 4:
                    return true;
                    break;
                  case 6:
                    return false;
                    break;
                  case 5:
                    return false;
                    break;
                  default:
                    return true;
                }
                break; 
            }
          return false;
        }
        
      }
  });