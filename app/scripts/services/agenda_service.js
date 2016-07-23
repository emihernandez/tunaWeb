
angular.module('sbAdminApp')
	.factory('Agenda', function($http,SERVER_CONSTANTS) {
    
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;
     

		return {
      cache: {},
			crearEvento : function(idAuditoria, evento) {
        return $http.post(serverUrl + '/agenda/crearEvento?idAuditoria=' + idAuditoria, evento);
			},
			modificarEvento : function(evento) {
        return $http.put(serverUrl + '/agenda/modificarEvento', evento);
			},
			eliminarEvento : function(idEvento) {
        return $http.delete(serverUrl + '/agenda/eliminarEvento?idEvento=' + idEvento);
			},
			completarEvento : function(idEvento) {
        return $http.post(serverUrl + '/agenda/completarEvento?idEvento=' + idEvento);
			},
			eventosUsuario : function(username) {
        return $http.get(serverUrl + '/agenda/eventosUsuario?username=' + username);
			},
			eventosMes : function(fecha) {
        return $http.get(serverUrl + '/agenda/eventosMes?fecha=' + fecha);
			}
		}
	});