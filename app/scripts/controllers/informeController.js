'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:InformeCtrl
 * @description
 * # InformeCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('InformeCtrl', function($scope, $rootScope, $modal, $modalStack, ngToast, $timeout, $compile, $q, $state, $stateParams,
                                            Relevamiento, fileManagerConfig, AuthService, Auditoria, VariablesComunes, RelevamientoAuditoria, $element) {

    $scope.auditoria = {} ;
    $scope.uploadInforme = {};
    $scope.fileBlob = '';
    $scope.idAuditoriaBuscar   = $stateParams.idAuditoria;
    fileManagerConfig.auditoriaId = $scope.idAuditoriaBuscar;
    ngToast.settings.verticalPosition = 'bottom';
    ngToast.settings.horizontalPosition = 'right';
    ngToast.settings.maxNumber = 3;

    $scope.checkRol = function(accion){
      return AuthService.checkRol(accion);
    }   

    $scope.generarExcel = function(){
      $scope.myPromise = RelevamientoAuditoria.generarExcel($scope.auditoria.id)
            .success(function(responseData, headers) {

                 var blob = new Blob([responseData], {type: 'zip'});                 
                // var pathArr = data.params.path.split('/');
                // saveAs( blob , (pathArr[pathArr.length-1]));
                 saveAs( blob , 'Relevamiento_info_auditoria_'+ $scope.auditoria.id + '.xlsx');

                
                //self.deferredHandler(data, deferred);
            }).error(function(data) {
                //self.deferredHandler(data, deferred, $translate.instant('error_getting_content'));
            })['finally'](function() {
                self.inprocess = false;
            });
    } 
    $scope.descargarArchivos = function(){
      $scope.myPromise = RelevamientoAuditoria.descargarArchivos($scope.auditoria.id)
      .success(function(responseData, headers) {

                 var blob = new Blob([responseData], {type: 'zip'});                 
                // var pathArr = data.params.path.split('/');
                // saveAs( blob , (pathArr[pathArr.length-1]));
                 saveAs( blob , 'Relevamiento_archivos_auditoria_'+ $scope.auditoria.id + '.zip');

                
                //self.deferredHandler(data, deferred);
            }).error(function(data) {
                //self.deferredHandler(data, deferred, $translate.instant('error_getting_content'));
            })['finally'](function() {
                self.inprocess = false;
            });
    } 
    
    $scope.verAuditoria= function(row){
      var idAuditoria = $scope.auditoria.id;
      console.log('Ver info completa auditoria clicked');
      $state.go('dashboard.auditoriasVer', {idAuditoria:idAuditoria}, {reload:true});
    }

    $scope.buscarAuditoria = function(){ 

    Auditoria.getAuditoria($scope.idAuditoriaBuscar)
        .then( function(res){
          
          //$scope.buscarIsCollapsed = true;
          
          
          $scope.auditoria.id = res.data.id;
          $scope.auditoria.fechaCreacion = res.data.fechaCreacion;
          $scope.auditoria.precio = res.data.precio;
          $scope.auditoria.tipo = res.data.tipo.toString();
          $scope.auditoria.mecanismoContacto = res.data.mecanismoContacto.toString();
          $scope.auditoria.notas = res.data.notas;
          $scope.auditoria.matricula = res.data.productor.matricula;
          $scope.relevamiento = res.data.relevamiento;
          $scope.auditoria.productor = res.data.productor;
          $scope.estadoUTE = res.data.relevamiento.estadoUTE;

          if (!res.data.motivo_rechazo_informe){
            $scope.auditoria.mostrarRechazo = false;
          } else {
            $scope.auditoria.mostrarRechazo = true;
            $scope.auditoria.motivoRechazo = res.data.motivo_rechazo_informe;
          }

         // $scope.obtenerAuditores();

          if (res.data.productor.remisiones.length != 0) {
              $scope.auditoria.ultimaRemision =  res.data.productor.remisiones[res.data.productor.remisiones.length-1].remision;
          } 

          if (res.data.productor.contactos.length != 0) {
              $scope.auditoria.contactoPrincipal =  res.data.productor.contactos[0].nombre + " - " +  res.data.productor.contactos[0].telefono;
          }  
          console.log("Auditoria buscar successfully: " + JSON.stringify(res));
          //$mdToast.show($mdToast.simple().content(res.message));
         // $location.url('/locations');
        },
        function(error){
          console.log("Auditoria error : " + JSON.stringify(error));
        });
      
    }    

    $scope.finalizar = function(){
      Auditoria.getCantInformes($scope.idAuditoriaBuscar)
        .then( function(res){
          if (res.data == "0") {
            ngToast.warning('Debe subir el informe antes de continuar');
            ngToast.warning('Debe subir la planilla de seguimiento antes de continuar');
          } else if (res.data == "-1") {
            ngToast.warning('Debe subir el informe antes de continuar');
          } else if (res.data == "-2") {
            ngToast.warning('Debe subir la planilla de seguimiento antes de continuar');
          } else {
            $state.go('dashboard.auditoriasListar');
          }
        },
        function(error){
          console.log("Error al finalizar Realizar Informe : " + JSON.stringify(error));
          
        });
      
    }


    if( $stateParams.idAuditoria !== undefined && $stateParams.idAuditoria !== '' ) {
      $scope.buscarAuditoria();
    }
    
    $scope.generarInforme = function(){
      
      if (! window.FormData) {
          throw new Error('Unsupported browser version');
      }
      var self = this;
      var form = new window.FormData();
      var deferred = $q.defer();

      //form.append('id', $scope.idAuditoriaBuscar);
      form.append('id', '10');

      // for (var i = 0; i < fileList.length; i++) {
          // var fileObj = fileList.item(i);
          // // fileObj instanceof window.File && form.append('file-' + i, fileObj);
          // fileObj instanceof window.File && form.append('file', fileObj);
      // }
//      $scope.fileBlob instanceof window.File &&
      form.append('file', $scope.fileBlob);

      self.requesting = true;
      Auditoria.generarInforme(form);

      return deferred.promise;
      
    }
    
  // $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  // $scope.series = ['Series A', 'Series B'];

  // $scope.data = [
    // [65, 59, 80, 81, 56, 55, 40],
    // [28, 48, 40, 19, 86, 27, 90]
  // ];
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


