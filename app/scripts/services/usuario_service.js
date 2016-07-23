
angular.module('sbAdminApp')
	.factory('Usuario', function($http,SERVER_CONSTANTS) {
    
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;
     
		return {
      cache: {},
			create : function(usuarioData) {
				return $http.post(serverUrl + '/usuario', usuarioData);
			},
      update : function(usuarioData) {
        return $http.put(serverUrl + '/usuario', usuarioData);
      },
      listar : function() {
        return $http.get(serverUrl + '/usuario/lista');
      },
      buscarUsuario : function(username) {
        return $http.get(serverUrl + '/usuario?username=' + username);
      },
      deshabilitarUsuario : function(username) {
        return $http.delete(serverUrl + '/usuario?username=' + username);
      },
      activarUsuario : function(username) {
        return $http.put(serverUrl + '/usuario/activar?username=' + username);
      },
      restaurarContrasena : function(username) {
        return $http.put(serverUrl + '/usuario/contrasena?username=' + username);
      },
      cambiarContrasena : function(usuarioData) {
        return $http.post(serverUrl + '/usuario/cambiarContrasena', usuarioData);
      }
		}
	});