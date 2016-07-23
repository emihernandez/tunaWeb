
angular.module('sbAdminApp')
	.factory('Contrato', function($http,SERVER_CONSTANTS) {
    
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;
     
		return {
      cache: {},
      
      crearContratos : function(contratosData) {
        return $http.post(serverUrl + '/contratos/doscontratos',contratosData);
      },
      crearContrato : function(contratoData) {
        return $http.post(serverUrl + '/contratos',contratoData);
      },
      getContrato : function(idContrato) {
        return $http.get(serverUrl + '/contratos/contrato_por_id/' + idContrato);
      }, 
      getRemito : function(idContrato) {
        return $http.get(serverUrl + '/contratos/ver_remito/' + idContrato);
      }, 
      modificarContrato : function(idContrato, contratoNuevo) {
        return $http.put(serverUrl + '/contratos/' + idContrato, contratoNuevo);
      }, 
      modificarRemito : function(idContrato, remitoNuevo) {
        return $http.put(serverUrl + '/contratos/modificar_remito/' + idContrato, remitoNuevo);
      }, 
      delete : function(idContrato) {
        return $http.delete(serverUrl + '/contratos/' + idContrato);
      },
      modificarEstadoContrato : function(idContrato, estadoNuevo) {
        return $http.put(serverUrl + '/contratos/modificar_estado/' + idContrato, estadoNuevo);
      },
      modificarEstadoContrato : function(idContrato, estadoNuevo) {
        return $http.put(serverUrl + '/contratos/modificar_estado/' + idContrato, estadoNuevo);
      },
      recoordinarContrato : function(idContrato, contratoRecoordinado) {
        return $http.post(serverUrl + '/contratos/recoordinar_contrato/' + idContrato, contratoRecoordinado);
      },
      generarContrato: function (idContrato,numContrato){
            return $http({
                url: serverUrl + '/contratos/generar_contrato/' + idContrato,
                method: "POST",
                data: numContrato, 
                 headers: {
                    'Content-type': 'application/json'
                 },
               responseType: 'blob'
            })
      },
      obtenerNumContratos : function() {
        return $http.get(serverUrl + '/contratos/obtener_num_contratos/');
      },
      obtenerServicios : function() {
        return $http.get(serverUrl + '/servicios/');
      },
      generarRemito: function (idContrato){
            return $http({
                url: serverUrl + '/contratos/generar_remito/' + idContrato,
                method: "GET",
                 headers: {
                    'Content-type': 'application/json'
                 },
               responseType: 'blob'
            })
      },
      exportarContratos: function (){
            return $http({
                url: serverUrl + '/contratos/exportar_base_contratos/',
                method: "GET", 
                 headers: {
                    'Content-type': 'application/json'
                 },
               responseType: 'blob'
            })
      },
      exportarRemitos: function (fechasFiltro){
            return $http({
              url: serverUrl + '/contratos/exportar_base_remitos/',
              method: "POST",
              data: fechasFiltro,
              headers: {
                'Content-type': 'application/json'
              },
              responseType: 'blob'
            })
      },
      cargarCambioEstados : function(form) {
        // return $http({
            // url: serverUrl + '/productor/cargarUTE',
            // method: "POST",
            // data: form, 
            // headers: {
               // 'Content-type': undefined
            // }
        // })
        return $http.post(serverUrl + '/contratos/cargar_cambio_estados/',form, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
                });
      },
      obtenerCambiosMasivosCargados : function(){
        return $http.get(serverUrl + '/contratos/obtener_cambio_estados/');
      },
      confirmarCambiosMasivoCargados : function(cambiosConfirmados) {
        return $http.post(serverUrl + '/contratos/confirmar_cambio_estados/', cambiosConfirmados);
      },
      asignarNuevoNumeroContrato : function(idContrato,nuevoNum){
        return $http.post(serverUrl + '/contratos/asignar_nuevo_numero/' + idContrato, nuevoNum);
      },








			get : function() {
				return $http.get(serverUrl + '/');
			},
      getZonas : function() {
				return $http.get(serverUrl + '/zonas');
			},     
      getProductor : function(matricula) {
        return $http.get(serverUrl + '/productor?matricula=' + matricula);
      },  
      getAuditorias : function(idProductor) {
        return $http.get(serverUrl + '/productor/listaAuditorias?idProductor=' + idProductor);
      },    
      getProductorLista : function() {
				return $http.get(serverUrl + '/productor/lista');
			},
			crearProductor : function(productorData) {
				return $http.post(serverUrl + '/productor', productorData);
			},
      actualizarProductor: function (productorData){
          return $http.put(serverUrl + '/productor', productorData);
      },
      eliminarObservacion : function(idObservacion) {
        return $http.delete(serverUrl + '/productor/eliminarObservacion?idObservacion=' + idObservacion);
      },
      crearContacto: function (matricula, contacto){
          return $http.post(serverUrl + '/productor/contacto?matricula=' + matricula, contacto);
      },
      actualizarContacto: function (contacto){
          return $http.put(serverUrl + '/productor/contacto', contacto);
      },
      borrarContacto: function (contactoId){
          return $http.delete(serverUrl + '/productor/contacto?contactoId=' + contactoId);
      },
      crearRemision: function (matricula, remision){
          return $http.post(serverUrl + '/productor/remision?matricula=' + matricula, remision);
      },
      crearObservacion: function (matricula, observacion){
          return $http.post(serverUrl + '/productor/crearObservacion?matricula=' + matricula, observacion);
      },
      modificarObservacion: function (idObservacion, observacion){
          return $http.put(serverUrl + '/productor/modificarObservacion?idObservacion=' + idObservacion + '&observacion=' + observacion);
      },
      actualizarRemision: function (matricula, remision){
          return $http.put(serverUrl + '/productor/remision?matricula=' + matricula, remision); 
      },
      descargarPlanillasUTE : function(idProductor) {
        var queryObject = {path: '/Productor'};
        return $http({
              url: serverUrl + '/productor/descargarPlanillasUTEzip?idProductor=' + idProductor,
              method: "POST",
              data: queryObject, 
              headers: {
                 'Content-type': 'application/json'
              },
             responseType: 'blob'
          })
      },
      cargarUTE : function(form) {
        // return $http({
            // url: serverUrl + '/productor/cargarUTE',
            // method: "POST",
            // data: form, 
            // headers: {
               // 'Content-type': undefined
            // }
        // })
        return $http.post(serverUrl + '/productor/cargarUTE', form, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
                });
      },
      borrarRemision: function (remisionId, matricula){
          return $http.delete(serverUrl + '/productor/remision?remisionId=' + remisionId + '&matricula=' + matricula);
      },
      descargarDatosUTE : function(idProductor) {
        var queryObject = {path: '/Productor'};
        return $http({
              url: serverUrl + '/productor/descargarDatosUTE?idProductor=' + idProductor,
              method: "GET", 
              headers: {
                 'Content-type': 'application/json'
              },
             responseType: 'blob'
          })
      }
		}
	});