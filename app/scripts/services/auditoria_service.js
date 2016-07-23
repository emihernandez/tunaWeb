
angular.module('sbAdminApp')
	.factory('Auditoria', function($http,SERVER_CONSTANTS) {
    
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;
     
    var idProductor = '0';

		return {
      cache: {},
          
			get : function() {
				return $http.get(serverUrl + '/api/places');
			},
			getAuditoria : function(idAuditoria) {
				return $http.get(serverUrl + '/auditoria/?id=' + idAuditoria);
			},   
			getAuditoriaLista : function() {
				return $http.get(serverUrl + '/auditoria/lista');
			},   
			obtenerPrecio : function(remision, conRegistro) {
				return $http.get(serverUrl + '/auditoria/listaPrecios?remision=' + remision + '&conRegistro=' + conRegistro);
			},
			//CON DATOS DE PRODUCTOR
			getAuditoriaListado : function() { 						
				return $http.get(serverUrl + '/auditoria/listado');
			},			
      		getAuditoriaHistoricoListado : function(idAuditoria) { 						
				return $http.get(serverUrl + '/auditoria/historico/?id=' + idAuditoria);
			},
			create : function(auditoriaData, crearIgual) {
				return $http.post(serverUrl + '/auditoria/?crearIgual=' + crearIgual, auditoriaData);
			},
			verificarCondiciones : function(idAuditoria) {
				return $http.post(serverUrl + '/auditoria/verificar?id=' + idAuditoria);
			},
			noVerificarCondiciones : function(idAuditoria) {
				return $http.post(serverUrl + '/auditoria/noVerificar?id=' + idAuditoria);
			},
			cancelarAuditoria : function(auditoriaData) {
				return $http.post(serverUrl + '/auditoria/cancelar', auditoriaData);
			},
			aprobarAuditoria : function(idAuditoria, aprobacion) {
				return $http.post(serverUrl + '/auditoria/aprobarInforme?id=' + idAuditoria, aprobacion);
			},
			delete : function(id) {
				return $http.delete(serverUrl + '/api/places/' + id);
			},
			update: function (placeData){
			  return $http.put(serverUrl + '/api/places/', placeData);
			},
			finalizarObtenerDocumentacion: function (idAuditoria){
			  return $http.post(serverUrl + '/auditoria/finalizarObtenerDocumentacion?id=' + idAuditoria);
			},
			getAuditoriasAuditor : function(username) {
				return $http.get(serverUrl + '/auditoria/listaAuditor?username=' + username);
			},
			getFechaAuditoria : function(idAuditoria) {
				return $http.get(serverUrl + '/auditoria/fechaAuditoria?idAuditoria=' + idAuditoria);
			},
			guardarSeguimiento : function(idAuditoria,medida,nuevoSeguimiento) {
				return $http.post(serverUrl + '/auditoria/guardarSeguimiento?id=' + idAuditoria, medida, nuevoSeguimiento);
			},
			finalizarDevolucion : function(idAuditoria, devolucion) {
				return $http.post(serverUrl + '/auditoria/finalizarDevolucion?id=' + idAuditoria, devolucion);
			},
			getCantInformes: function (idAuditoria){
			  return $http.post(serverUrl + '/auditoria/cantInformes?id=' + idAuditoria);
			},
			descargarInforme: function (idAuditoria){
	          return $http({
	              url: serverUrl + '/auditoria/descargarInforme?id=' + idAuditoria,
	              method: "GET",
	              //data: queryObject, 
	               headers: {
	                  'Content-type': 'application/json'
	               },
	             responseType: 'blob'
	          })
			},
			generarInforme : function(form) {
				return $http.post( serverUrl + '/auditoria/generarInforme', form, {
			        transformRequest: angular.identity,
			        headers: {
			            "Content-Type": undefined
			        }
            	});
            },
            guardarFirma : function(form) {
				return $http.post( serverUrl + '/auditoria/guardarFirma', form, {
			        transformRequest: angular.identity,
			        headers: {
			            "Content-Type": undefined
			        }
            	});
            },
			idProductor: idProductor
		}
	});