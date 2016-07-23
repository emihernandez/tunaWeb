'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:DocumentacionCtrl
 * @description
 * # DocumentacionCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('DocumentacionCtrl', function($scope, $rootScope, $modal, $modalStack, ngToast, $timeout, $compile, $q, $state, $stateParams,
                                            Relevamiento, AuthService, Auditoria, VariablesComunes, fileManagerConfig) {

    $scope.auditoria = {} ;
    $scope.uploadFileListUTE = {};

    $scope.idAuditoriaBuscar   = $stateParams.idAuditoria;

    fileManagerConfig.createFolder = true;
    fileManagerConfig.uploadFile = true;
    fileManagerConfig.auditoriaId = $scope.idAuditoriaBuscar;
    
        
    ngToast.settings.verticalPosition = 'bottom';
    ngToast.settings.horizontalPosition = 'right';
    ngToast.settings.maxNumber = 3;

    $scope.checkRol = function(accion){
      return AuthService.checkRol(accion);
    }
    
     $scope.verAuditoria= function(){
      var idAuditoria = $scope.idAuditoriaBuscar;
      console.log('verAuditoria clicked');
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
    
    if( $stateParams.idAuditoria !== undefined && $stateParams.idAuditoria !== '' ) {
      $scope.buscarAuditoria();
    }

    $scope.finalizarObtenerDocumentacion = function(){ 
      $scope.buscarAuditoria();
      if (!$scope.relevamiento.auditor){
        ngToast.danger('Debe seleccionar un auditor para realizar la auditoria');
      } else {
        Auditoria.finalizarObtenerDocumentacion($scope.auditoria.id)
        .then( function(res){
          console.log("Obtencion datos preliminares finalizado correctamente: " + JSON.stringify(res));
          $state.go('dashboard.auditoriasListar');
        },
        function(error){
          console.log("Obtencion datos preliminares error : " + JSON.stringify(error));
          ngToast.danger('Error en el servidor');
        });
      }
      
    }
  
  });


