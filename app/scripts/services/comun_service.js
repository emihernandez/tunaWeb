
angular.module('sbAdminApp')
	.factory('VariablesComunes', function() {
         
    var Productor = null;
    var ultimaRemision = '0';
    var eventoData = {};
    eventoData.eventoAuditoriaSeleccionada = 0;
    eventoData.eventoAuditoriaSeleccionadaMatricula = '';
    eventoData.eventoAuditoriaSeleccionadaRazonSocial = '';
    eventoData.date = '';

		return {
      cache: {},
          
      			Productor: Productor,
      			ultimaRemision: ultimaRemision,
            eventoData:eventoData
		}
	});