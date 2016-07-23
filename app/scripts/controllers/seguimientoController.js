'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:InformeCtrl
 * @description
 * # InformeCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('SeguimientoCtrl', function($scope, $rootScope, $modal, $modalStack, ngToast, $timeout,$filter, $window, $compile, $location, $q, $state, $stateParams, $route,
                                            Relevamiento, Seguimiento, fileManagerConfig, AuthService, Auditoria, VariablesComunes, RelevamientoAuditoria, $element) {

    $scope.auditoria = {} ;
    $scope.uploadInforme = {};
    $scope.fileBlob = '';
    $scope.ultimoSeguimiento = {};
    $scope.nuevoSeguimiento = {};
    $scope.idAuditoriaBuscar   = $stateParams.idAuditoria;
    $scope.idMedidaBuscar   = $stateParams.idMedida;
    fileManagerConfig.auditoriaId = $scope.idAuditoriaBuscar;
    fileManagerConfig.medida = $scope.idMedidaBuscar;
    ngToast.settings.verticalPosition = 'bottom';
    ngToast.settings.horizontalPosition = 'right';
    ngToast.settings.maxNumber = 3;

    var url = $location.url();
    if (url.indexOf("detalle_medida") != -1){      
      fileManagerConfig.createFolder = false;
      fileManagerConfig.uploadFile = false;
      //listUrl: "localhost:auditoria/archivosSeguimiento"
      listUrl: "http://server.spel-soft.com/server:auditoria/archivosSeguimiento"
    }
    
    $scope.checkRol = function(accion){
      return AuthService.checkRol(accion);
    }   

    $scope.detalleMedida = function(idAuditoria, idMedida){
      $state.go('dashboard.detalleMedida', {idAuditoria:idAuditoria, idMedida:idMedida}, {reload:true});
    } 

    $scope.cargarComprobante = function() {
      
        if (! window.FormData) {
            throw new Error('Unsupported browser version');
        }
        var self = this;
        var form = new window.FormData();
        var deferred = $q.defer();
        form.append('destination', '/Comprobantes/');
        form.append('id', $scope.idAuditoriaBuscar);
        form.append('medida', $scope.idMedidaBuscar);

        var fileList = $scope.uploadComprobante
        for (var i = 0; i < fileList.length; i++) {
            var fileObj = fileList.item(i);
            fileObj instanceof window.File && form.append('file', fileObj);
        }

        Seguimiento.subirArchivo(form).success(function(data) {
           ngToast.success('Comprobante cargado correctamente');
           $window.location.reload();
        });

    };

    $scope.actualizarMedida = function(){
     Seguimiento.actualizarMedida($scope.idAuditoriaBuscar,$scope.medidaBuscada)
        .then( function(res){
          if (res.data.status == 'OK'){
            console.log("Medida actualizada correctamente: " + JSON.stringify(res));
            ngToast.success('Medida actualizada correctamente');
            $scope.buscarAuditoria();
          }
        },
        function(error){
          console.log("Medida error : " + JSON.stringify(error));
          ngToast.danger('Error al actualizar la medida');
        });
    }


    $scope.buscarMedida = function(){

      var cantMedidas = $scope.auditoria.devolucion.medidas.length;
      
      for (var i = 0; i < cantMedidas; i ++){
        if ($scope.auditoria.devolucion.medidas[i].id == $scope.idMedidaBuscar)
          $scope.medidaBuscada = $scope.auditoria.devolucion.medidas[i];
      } 

      var cantSeguimientos = $scope.medidaBuscada.seguimientos.length;
      $scope.seguimientos = [];
      for (var i = 0; i < cantSeguimientos; i ++){
        
        $scope.medidaBuscada.seguimientos[i].fechaString = $filter('date')($scope.medidaBuscada.seguimientos[i].fecha, "dd/MM/yyyy") ;
        $scope.seguimientos[i] = $scope.medidaBuscada.seguimientos[i];
      }

      $scope.medidaBuscada.fechaImplementacionFiltrada = $filter('date')($scope.medidaBuscada.fechaImplementacion, "dd/MM/yyyy") ;

    } 


    $scope.guardarSeguimiento = function(){

      var cantSeguimientos = $scope.medidaBuscada.seguimientos.length;

      for (var i = 0; i < cantSeguimientos; i ++){

        $scope.medidaBuscada.seguimientos[i].fecha = new Date($scope.medidaBuscada.seguimientos[i].fecha);
        $scope.seguimientos[i] = $scope.medidaBuscada.seguimientos[i];
      }


      $scope.medidaBuscada.seguimientos[cantSeguimientos -1].observaciones = $scope.ultimoSeguimiento.observaciones;

      $scope.medidaBuscada.proximoSeguimiento = Date.parse($scope.medidaBuscada.proximoSeguimiento);

      console.log(JSON.stringify($scope.medidaBuscada));

      console.log(JSON.stringify($scope.nuevoSeguimiento.fecha));

      Auditoria.guardarSeguimiento($scope.idAuditoriaBuscar, $scope.medidaBuscada,$scope.nuevoSeguimiento.fecha)
        .then( function(res){
  
          console.log("Auditoria buscar successfully: " + JSON.stringify(res));
          //$mdToast.show($mdToast.simple().content(res.message));
         // $location.url('/locations');
        },
        function(error){
          console.log("Auditoria error : " + JSON.stringify(error));
        });

    } 


    $scope.volverASeguimiento= function(){
      var idAuditoria = $scope.idAuditoriaBuscar;
      $state.go('dashboard.realizarSeguimiento', {idAuditoria:idAuditoria}, {reload:true});
    }

    $scope.volverAAuditoria= function(){
      var idAuditoria = $scope.idAuditoriaBuscar;
      $state.go('dashboard.auditoriasVer', {idAuditoria:idAuditoria}, {reload:true});
    }

        $scope.buscarAuditoria = function(){ 

    Auditoria.getAuditoria($scope.idAuditoriaBuscar)
        .then( function(res){
          
          //$scope.buscarIsCollapsed = true;
          
          $scope.auditoria.id = res.data.id;
          $scope.auditoria.estado = res.data.estado;
          $scope.auditoria.fechaCreacion = res.data.fechaCreacion;
          $scope.auditoria.precio = res.data.precio;
          $scope.auditoria.tipo = res.data.tipo.toString();
          $scope.auditoria.mecanismoContacto = res.data.mecanismoContacto.toString();
          $scope.auditoria.notas = res.data.notas;
          $scope.auditoria.matricula = res.data.productor.matricula;
          $scope.auditoria.relevamiento = res.data.relevamiento;
          $scope.auditoria.relevamientoAuditoria = res.data.relevamientoAuditoria;
          $scope.auditoria.productor = res.data.productor;
          $scope.auditoria.motivo_cancelacion = res.data.motivo_cancelacion;
          $scope.auditoria.devolucion = res.data.devolucion;


          if (res.data.estado === "Cancelada - No verifica condiciones financieras"){
            $scope.auditoria.motivo_cancelacion = "Productor no cumple condiciones financieras.";
          }
          VariablesComunes.Productor = res.data.productor;


          if (res.data.productor.remisiones.length == 0) {
              $scope.auditoria.ultimaRemision = "No existen remisiones para este productor";
            }
          else {
              $scope.auditoria.ultimaRemision =  res.data.productor.remisiones[res.data.productor.remisiones.length-1].remision;
          } 

          var cantMedidas = $scope.auditoria.devolucion.medidas.length;

          for (var i = 0; i < cantMedidas; i ++){
            var cantSeguimientos = $scope.auditoria.devolucion.medidas[i].seguimientos.length;
            if (cantSeguimientos == 0){
              $scope.auditoria.devolucion.medidas[i].proximoSeguimiento = "N/A";
            } else {
              var encontrado = -1;
              for (var j = 0; j < cantSeguimientos; j++){
                $scope.auditoria.devolucion.medidas[i].seguimientos[j].fechaString = $filter('date')($scope.auditoria.devolucion.medidas[i].seguimientos[j].fecha, "dd/MM/yyyy") ;
                if (encontrado == -1){
                  if (!$scope.auditoria.devolucion.medidas[i].seguimientos[j].observaciones){
                    encontrado = j;
                  }
                }
              }
              if (encontrado == -1){
                $scope.auditoria.devolucion.medidas[i].proximoSeguimiento = "N/A";
              } else {
                $scope.auditoria.devolucion.medidas[i].proximoSeguimiento = $filter('date')($scope.auditoria.devolucion.medidas[i].seguimientos[encontrado].fecha, "dd/MM/yyyy") ;
              }
            }
          }


          if( $stateParams.idMedida !== undefined && $stateParams.idMedida !== '' )
            $scope.buscarMedida();

          VariablesComunes.ultimaRemision = $scope.auditoria.ultimaRemision;
          
          
          console.log("Auditoria buscar successfully: " + JSON.stringify(res));
          //$mdToast.show($mdToast.simple().content(res.message));
         // $location.url('/locations');
        },
        function(error){
          console.log("Auditoria error : " + JSON.stringify(error));
        });
    }

    $scope.nuevoSeguimiento = function(){
      $scope.seguimientoAModificar = {};
      $scope.nuevoSeguimientoModal('Nuevo seguimiento');
    }

    $scope.actualizarSeguimiento = function(seguimiento){
      $scope.seguimientoAModificar = seguimiento;
      $scope.actualizarSeguimientoModal('Actualizar seguimiento');
    }

    $scope.actualizarSeguimientoModal = function (title) {
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/actualizarSeguimiento.html',
        controller: 'ActualizarSeguimientoCtrl',
        resolve: {
            seguimientoAModificar: function () {
              return $scope.seguimientoAModificar;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }  
          }
      });
      modalInstance.result.then(function (seguimientoAModificar) { 
        Seguimiento.actualizarSeguimiento($scope.idAuditoriaBuscar, seguimientoAModificar, $scope.idMedidaBuscar).then(
        function(res){
          if (res.data.status == 'OK'){
            console.log("Seguimiento actualizado correctamente: " + JSON.stringify(res));
            ngToast.success('Seguimiento actualizado correctamente');
            $scope.buscarAuditoria();
          } 
        },
        function(error){
          ngToast.danger('Error al actualizar el seguimiento');
        }
      );
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.nuevoSeguimientoModal = function (title) {
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/nuevoSeguimiento.html',
        controller: 'ActualizarSeguimientoCtrl',
        resolve: {
            seguimientoAModificar: function () {
              return $scope.seguimientoAModificar;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }  
          }
      });
      modalInstance.result.then(function (seguimientoAModificar) { 
        console.log("mando:" + JSON.stringify(seguimientoAModificar));
        Seguimiento.agregarSeguimiento($scope.idAuditoriaBuscar, seguimientoAModificar, $scope.idMedidaBuscar).then(
        function(res){
          if (res.data.status == 'OK'){
            console.log("Seguimiento creado correctamente: " + JSON.stringify(res));
            ngToast.success('Seguimiento creado correctamente');
            $scope.buscarAuditoria();
          } 
        },
        function(error){
          ngToast.danger('Error al crear el seguimiento');
        }
      );
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.finalizarAuditoria = function(){
     Seguimiento.finalizarSeguimiento($scope.idAuditoriaBuscar)
        .then( function(res){
          if (res.data.status == 'OK'){
            console.log("Auditoria finalizada correctamente: " + JSON.stringify(res));
            ngToast.success('Auditoria finalizada');
            $state.go('dashboard.auditoriasListar');
          }
        },
        function(error){
          console.log("Error finalizando auditoria: " + JSON.stringify(error));
          ngToast.danger('Error al finalizar la auditoria');
        });
    }

    $scope.confirmarFinalizacion = function () {
      var title = '¿Seguro desea finalizar la auditoría?';
      var body = 'Una vez finalizada no se podrá continuar con el seguimiento.';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/confirmarCreacion.html',
        controller: 'ConfirmarRestauracionCtrl',
        resolve: {
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }
          }
      });
      modalInstance.result.then(function () {
        $scope.finalizarAuditoria();      
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };


    if( $stateParams.idAuditoria !== undefined && $stateParams.idAuditoria !== '' ) {
      $scope.buscarAuditoria();
    }


    $scope.labels = ['Jul-2012', 'Ago-2012', 'Sep-2012'];
    $scope.type = 'StackedBar';
    $scope.data = [
      [65, 59, 90],
      [28, 48, 400]
    ];
    $scope.test = function () { 
      console.log('fff'); 
    };
    
    $scope.options = {
      data: [
        {
          sales: 130,
          income: 250
        }
      ],
      dimensions: {
        sales: {
          type: 'bar'
        },
        income: {
          axis: 'y2'
        }
      },
      chart: {
        onrendered: function () { 
          var el = document.getElementById("chartContainer").children[0].children[0];
          el.id = "testId";
          var jQueryInnerItem = $($element);
          console.log('rendered...') ;
        }
      }
    };

});

angular.module('sbAdminApp').controller('ActualizarSeguimientoCtrl', function ($scope, $modalInstance, seguimientoAModificar, obtenerTitulo, obtenerBody) {

  $scope.seguimientoAModificar = seguimientoAModificar;
  $scope.title = obtenerTitulo;
  $scope.body = obtenerBody;

  $scope.ok = function () {
    $modalInstance.close($scope.seguimientoAModificar);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
