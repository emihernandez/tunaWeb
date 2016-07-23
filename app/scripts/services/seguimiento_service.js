
angular.module('sbAdminApp')
	.factory('Seguimiento', function($http,SERVER_CONSTANTS) {
    
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;
     

		return {
      cache: {},
			get : function() {
				return $http.get(serverUrl + '/api/places');
			},
			guardarSeguimiento : function(idAuditoria,medida,nuevoSeguimiento) {
        return $http.post(serverUrl + '/auditoria/guardarSeguimiento?id=' + idAuditoria, medida, nuevoSeguimiento);
			},
			actualizarSeguimiento : function(idAuditoria, seguimientoMedida, idMedida) {
        return $http.post(serverUrl + '/auditoria/actualizarSeguimiento?idAuditoria=' + idAuditoria + '&idMedida=' + idMedida, seguimientoMedida);
			},
			agregarSeguimiento : function(idAuditoria, seguimientoMedida, idMedida) {
        return $http.post(serverUrl + '/auditoria/agregarSeguimiento?idAuditoria=' + idAuditoria + '&idMedida=' + idMedida, seguimientoMedida);
			},
			actualizarMedida : function(idAuditoria, medida) {
        return $http.post(serverUrl + '/auditoria/actualizarMedida?idAuditoria=' + idAuditoria, medida);
			},
			finalizarSeguimiento : function(idAuditoria) {
        return $http.post(serverUrl + '/auditoria/finalizarSeguimiento?id=' + idAuditoria);
			},
			subirArchivo : function(form) {
        return  $http.post(serverUrl + '/auditoria/cargarComprobante', form, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
            });
			},
		}
	});