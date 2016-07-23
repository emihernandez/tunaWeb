
angular.module('sbAdminApp')
	.factory('Dashboard', function($http, SERVER_CONSTANTS) {
    
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;

		return {
      cache: {},
          
			getDashboard : function(tamanoProductor) {
				return $http.get(serverUrl + '/dashboard?tipoEstablecimiento=' + tamanoProductor);
			}
		}
	});
