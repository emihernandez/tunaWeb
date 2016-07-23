
angular.module('sbAdminApp')
	.factory('RelevamientoAuditoria', function($http,SERVER_CONSTANTS) {
    
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;
     

		return {
      cache: {},
			create : function(relevamiento, finalizado) {
				return $http.post(serverUrl + '/relevamientoAuditoria?finalizado=' + finalizado, relevamiento);
        
        //form.append('relevamiento', relevamiento);
        // return $http.post(serverUrl + '/relevamientoAuditoria', form, {
                // transformRequest: angular.identity,
                // headers: {
                    // "Content-Type": undefined
                // }
                // });
			},
			uploadFiles : function(form) {
				// return $http.post(serverUrl + '/relevamientoAuditoria', relevamiento);
        
        //form.append('relevamiento', relevamiento);
        return $http.post(serverUrl + '/relevamientoAuditoriaFiles', form, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
                });
			},
      generarExcel : function(idAuditoria) {
        //serverUrl + '/relevamientoAuditoria/generarExcel?idAuditoria=' + idAuditoria
        //return $http.get();
        var queryObject = {path: '/Relevamiento'};
         // $http.get(fileManagerConfig.getContentUrl, {params: queryObject}).success(function(data) {
        return $http({
              url: serverUrl + '/relevamientoAuditoria/generarExcel?idAuditoria=' + idAuditoria,
              method: "GET", 
              headers: {
                 'Content-type': 'application/json'
              },
             responseType: 'blob'
          })
      },
      descargarArchivos : function(idAuditoria) {
        var queryObject = {path: '/Relevamiento'};
         // $http.get(fileManagerConfig.getContentUrl, {params: queryObject}).success(function(data) {
        return $http({
              url: serverUrl + '/relevamientoAuditoria/descargarRelevamientoZip?id=' + idAuditoria,
              method: "POST",
              data: queryObject, 
              headers: {
                 'Content-type': 'application/json'
              },
             responseType: 'blob'
          })
          //return $http.get(serverUrl + '/relevamientoAuditoria/archivosZip?idAuditoria=' + idAuditoria);
      }
		}
	});