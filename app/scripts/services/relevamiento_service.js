
angular.module('sbAdminApp')
	.factory('Relevamiento', function($http, SERVER_CONSTANTS) {
    
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;

		return {
      cache: {},
          
			get : function(idAuditoria) {
				return $http.get(serverUrl + '/relevamientoTel/?id='+ idAuditoria);
			},
			create : function(relevamientoData) {
				return $http.post(serverUrl + '/relevamientoTel/', relevamientoData);
			},
			delete : function(id) {
				return $http.delete(serverUrl + '/api/places/' + id);
			},
      		update: function (relevamientoData){
        		return $http.put(serverUrl + '/relevamientoTel/', relevamientoData);
      		},
      		crearTanque: function (matricula, tanque){
          		return $http.post(serverUrl + '/relevamientoTel/tanque?auditoriaId=' + idAuditoria, tanque);
		    },
		    actualizarTanque: function (tanque){
		        return $http.put(serverUrl + '/relevamientoTel/tanque', tanque);
		    },
		    getAuditores: function (){
		        return $http.get(serverUrl + '/auditores');
		    },
		    borrarTanque: function (tanqueId){
		        return $http.delete(serverUrl + '/relevamientoTel/tanque?tanqueId=' + tanqueId);
		    },
		}
	});
