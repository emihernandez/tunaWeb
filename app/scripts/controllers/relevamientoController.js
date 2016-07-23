'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:RelevamientoCtrl
 * @description
 * # RelevamientoCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('RelevamientoCtrl', function($scope, $rootScope, $modal, $modalStack, ngToast, $timeout, $compile, $q, $state, $stateParams,
                                                         Relevamiento, AuthService, Auditoria, VariablesComunes) {

    $scope.relevamientoNuevo = {};
    $scope.auditoria = {} ;
    $scope.nuevoRelevamientoTanques = [];
    $scope.relevamientoNuevo.aceptacionAuditoria = 'Si';
    $scope.idAuditoriaBuscar   = $stateParams.idAuditoria;
    $scope.generalIsCollapsed = true;
    $scope.tanquesIsCollapsed = true;
    $scope.calentamientoIsCollapsed = true;
    $scope.maquinaIsCollapsed = true;
    $scope.electricaIsCollapsed = true;
    $scope.intercambiadorIsCollapsed = true;
    $scope.riegoIsCollapsed = true;
    $scope.aceptacionIsCollapsed = false;
    $scope.bNuevoRelevamiento = true;
    $scope.cargarHorarios = {};

    $scope.formData = {};
    $scope.data = {};
    $scope.formData1 = {};
    $scope.data1 = {};

    ngToast.settings.verticalPosition = 'bottom';
    ngToast.settings.horizontalPosition = 'right';
    ngToast.settings.maxNumber = 3;
    
    if ( navigator.onLine ) {
      $scope.connected = "Con conexion";
      $scope.bConnected = true;
    } else {
      $scope.connected = "Sin conexion";
      $scope.bConnected = false;
    }

    window.addEventListener("offline", function(e) {
      $scope.connected = "Sin conexion";
      $scope.bConnected = false;
      $scope.$apply();
    })

    window.addEventListener("online", function(e) {
      $scope.connected = "Con conexion";
      $scope.bConnected = true;
      $scope.$apply();
    })
    
    $scope.checkRol = function(accion){
      return AuthService.checkRol(accion);
    }
  
   /* $scope.$watch('relevamientoNuevo.aceptacionAuditoria', function() {
      var e = document.getElementById("aceptacionPanel"); 
      e.click();
      $scope.aceptacionIsCollapsed = !$scope.aceptacionIsCollapsed;
      $scope.aceptacionIsCollapsed = !$scope.aceptacionIsCollapsed;
    }, true);*/
    
    $scope.openModal = function (title) {
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/editarTanqueModal.html',
        controller: 'ModalRelevamientoCtrl',
        // size: size,
        resolve: {
            tanqueAModificar: function () {
              return $scope.tanqueAModificar;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }
          }
      });
      modalInstance.result.then(function (tanque) {
      if ( !$scope.bNuevoRelevamiento ){  
        if( $scope.nuevoTanque ){
          Relevamiento.crearTanque($scope.relevamientoNuevo.idAuditoria, tanque)
          .then( function(res){
            console.log("creadoTanque OK");
            $scope.buscarTanque();
          });
        } else {
          Relevamiento.actualizarTanque(tanque)
          .then( function(res){
            console.log("updateTanque OK");
            $scope.buscarTanque();
          });
        } 
      }else {
          $scope.nuevoRelevamientoTanques.push(tanque);
      }     
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.openEditarTanqueNuevo = function (title,index) {
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/editarTanqueModal.html',
        controller: 'ModalRelevamientoCtrl',
        // size: size,
        resolve: {
            tanqueAModificar: function () {
              return $scope.tanqueAModificar;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }
          }
      });
      modalInstance.result.then(function (tanque) {
      $scope.nuevoRelevamientoTanques[index].marca = tanque.marca;
      $scope.nuevoRelevamientoTanques[index].otraMarca = tanque.otraMarca;
      $scope.nuevoRelevamientoTanques[index].clase = tanque.clase;
      $scope.nuevoRelevamientoTanques[index].capacidad = tanque.capacidad;
      $scope.nuevoRelevamientoTanques[index].antiguedad = tanque.antiguedad;

            
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.tanqueGuardado = true;
    $scope.openBorrarTanqueModal = function (tanque) {
      var body = 'Desea borrar el tanque: ' + tanque.marca + '?';
      var title = 'Borrar tanque';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/borrarTanqueModal.html',
        controller: 'ModalRelevamientoCtrl',
        resolve: {
            tanqueAModificar: function () {
              return tanque;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }
          }
      });

      modalInstance.result.then(function (tanque) {
        if( $scope.contactoTanque ){
          tanque.borrarTanque(tanque.id)
          .then( function(res){
            console.log("borrardo tanque OK");
            $scope.buscarTanque();
          });
        } else {
          // Productor.actualizarContacto(contacto)
          // .then( function(res){
            // console.log("updateContacto OK");
          // });
        }        
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };


    $scope.openBorrarTanqueNuevoModal = function (tanque,index) {
      var body = 'Desea borrar el tanque: ' + tanque.marca + ' ?';
      var title = 'Borrar tanque';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/borrarTanqueModal.html',
        controller: 'ModalRelevamientoCtrl',
        resolve: {
            tanqueAModificar: function () {
              return tanque;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }
          }
      });

      modalInstance.result.then(function (tanque) {
        $scope.nuevoRelevamientoTanques.splice(index, 1);       
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.agregarTanqueClicked = function(){
      $scope.nuevoTanque = true;
      $scope.tanqueAModificar = null;
      $scope.openModal('Nuevo tanque');
    }

    $scope.modificarTanqueClicked = function(tanque){
      $scope.nuevoTanque = false;
      $scope.tanqueAModificar = JSON.parse(JSON.stringify(tanque));
      $scope.openModal('Modificar tanque');
    }  
    
    $scope.borrarTanqueClicked = function(tanque){
      $scope.tanqueABorrar = JSON.parse(JSON.stringify(tanque));
      $scope.openBorrarTanqueModal(tanque);
    }

    $scope.modificarTanqueNuevoClicked = function(tanque,index){
      $scope.nuevoTanque = false; 
      $scope.tanqueAModificar = JSON.parse(JSON.stringify(tanque));
      $scope.openEditarTanqueNuevo('Modificar tanque',index);
    }  
    
    $scope.borrarTanqueNuevoClicked = function(tanque,index){
      $scope.tanqueABorrar = JSON.parse(JSON.stringify(tanque));
      $scope.openBorrarTanqueNuevoModal(tanque,index);
    }

    $scope.cargarRelevamientoNuevo = function(){
      $scope.relevamientoNuevo.remision = $scope.auditoria.ultimaRemision;
    }

    $scope.cancelarAuditoria = function(){ 
      $scope.auditoria.motivo_cancelacion= $scope.relevamientoNuevo.motivoRechazo;
      Auditoria.cancelarAuditoria($scope.auditoria)
        .then(function(res){
           ngToast.success('Auditoria cancelada correctamente');
           $state.go('dashboard.auditoriasListar');
        });
    }

    $scope.obtenerAuditores = function(){ 
       
      Relevamiento.getAuditores()
        .then(
        function(res){
          $scope.auditores = res.data;   
          if ($scope.relevamientoNuevo.auditor){
              $scope.auditores.selectedOption = $scope.relevamientoNuevo.auditor;
          }       
          console.log("Obtener auditores OK: ");

        },
        function(error){
          //$mdToast.show($mdToast.simple().content(JSON.stringify(error.data)));
          console.log("Obtener auditores error : " + JSON.stringify(error));
        });
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
          $scope.auditoria.razonSocial = res.data.productor.razonSocial;
          $scope.auditoria.direccion = res.data.productor.direccion;
          $scope.relevamiento = res.data.relevamiento;
          $scope.auditoria.productor = res.data.productor;

          $scope.obtenerAuditores();
          
          if ($scope.relevamiento){
              $scope.relevamientoNuevo = $scope.relevamiento;
              $scope.formData.dueDate = $scope.relevamientoNuevo.visitaDesde;
              $scope.relevamientoNuevo.aceptacionAuditoria = "Si";
              if ($scope.relevamientoNuevo.tanques){
                $scope.nuevoRelevamientoTanques = $scope.relevamientoNuevo.tanques;
              }
              if ($scope.relevamientoNuevo.estadoUTE == 3 || $scope.relevamientoNuevo.estadoUTE == 4){
                $scope.relevamientoNuevo.electrica.datosSolicitados = true;
              }

              $scope.cargarHorarios();
              $scope.relevamientoNuevo.auditorSeleccionado = $scope.relevamientoNuevo.auditor;
              $scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer = ($scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer === 1);
              $scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor = ($scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor === 1);
              $scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar = ($scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar === 1);
              $scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico = ($scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico === 1);
              $scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas = ($scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas === 1);
              $scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor = ($scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor === 1);
              $scope.relevamientoNuevo.mecanismoCalentarAgua.lena = ($scope.relevamientoNuevo.mecanismoCalentarAgua.lena === 1);
              $scope.relevamientoNuevo.intercambiador.usaIntercambiador = ($scope.relevamientoNuevo.intercambiador.usaIntercambiador === 1);
              $scope.relevamientoNuevo.riego.tieneRiego = ($scope.relevamientoNuevo.riego.tieneRiego === 1);
              $scope.relevamientoNuevo.riego.medidorAparte  = ($scope.relevamientoNuevo.riego.medidorAparte === 1);
              $scope.relevamientoNuevo.riego.numCuenta  = parseInt($scope.relevamientoNuevo.riego.numCuenta);
              $scope.relevamientoNuevo.electrica.medidorExclusivo  = ($scope.relevamientoNuevo.electrica.medidorExclusivo === 1);
              $scope.relevamientoNuevo.maquina.tieneVSD  = ($scope.relevamientoNuevo.maquina.tieneVSD === 1);
              $scope.relevamientoNuevo.llegaFactura  = ($scope.relevamientoNuevo.llegaFactura === 1);
          }

          // if ($scope.relevamientoNuevo){
          //   if ($scope.relevamientoNuevo.tanques)
          //     $scope.nuevoRelevamientoTanques = $scope.relevamientoNuevo.tanques;
          // }

          

          if (res.data.productor.remisiones.length != 0) {
              $scope.auditoria.ultimaRemision =  res.data.productor.remisiones[res.data.productor.remisiones.length-1].remision;
          } 

          if (res.data.productor.contactos.length != 0) {
              $scope.auditoria.contactoPrincipal =  res.data.productor.contactos[0].nombre + " - " +  res.data.productor.contactos[0].telefono;
          }  

            $scope.relevamientoNuevo.remision = $scope.auditoria.ultimaRemision;
            $scope.relevamientoNuevo.contactoVisita = $scope.auditoria.contactoPrincipal;
          
          console.log("Auditoria buscar successfully: " + JSON.stringify(res));
          //$mdToast.show($mdToast.simple().content(res.message));
         // $location.url('/locations');
        },
        function(error){
          console.log("Auditoria error : " + JSON.stringify(error));
        });
      
    }

    $scope.modificarRelevamiento = function(){ 

      $scope.relevamientoNuevo.tanques = $scope.nuevoRelevamientoTanques;
      $scope.relevamientoNuevo.auditor = $scope.auditores.selectedOption;
      
      if ($scope.relevamientoNuevo.estadoUTE != 4){
        if ($scope.relevamientoNuevo.electrica.numCuenta){
          if ($scope.relevamientoNuevo.electrica.datosSolicitados){
            $scope.relevamientoNuevo.estadoUTE = 3;
          } else {
            $scope.relevamientoNuevo.estadoUTE = 2;
          }
        } else {
          $scope.relevamientoNuevo.estadoUTE = 1;
        }
      };

      //Se le asigna como marca la marca ingresada manualmente
      var cantidadTanques = $scope.nuevoRelevamientoTanques.length;
      for (var i = 0; i < cantidadTanques; i++) {
        if ( $scope.relevamientoNuevo.tanques[i].marca=="Otro") //verifica que esta definida y no sea vacio.
          $scope.relevamientoNuevo.tanques[i].marca = $scope.relevamientoNuevo.tanques[i].otraMarca;
      }
  
      $scope.relevamientoNuevo.idAuditoria= Auditoria.idRelevamiento;

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer = 1;} 

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor = 1;} 

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar = 1;} 

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico = 1;} 

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas = 1;} 

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor = 1;}              

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.lena === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.lena = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.lena === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.lena = 1;}  

        if ($scope.relevamientoNuevo.intercambiador.usaIntercambiador === false) {
              $scope.relevamientoNuevo.intercambiador.usaIntercambiador = 0 ;} 
        if ($scope.relevamientoNuevo.intercambiador.usaIntercambiador === true) {
              $scope.relevamientoNuevo.intercambiador.usaIntercambiador = 1;} 

        if ($scope.relevamientoNuevo.riego.tieneRiego === false) {
              $scope.relevamientoNuevo.riego.tieneRiego = 0 ;} 
        if ($scope.relevamientoNuevo.riego.tieneRiego === true) {
              $scope.relevamientoNuevo.riego.tieneRiego = 1;} 

        if ($scope.relevamientoNuevo.riego.medidorAparte === false) {
              $scope.relevamientoNuevo.riego.medidorAparte = 0 ;} 
        if ($scope.relevamientoNuevo.riego.medidorAparte === true) {
              $scope.relevamientoNuevo.riego.medidorAparte = 1;} 

        if ($scope.relevamientoNuevo.electrica.medidorExclusivo=== false) {
              $scope.relevamientoNuevo.electrica.medidorExclusivo = 0 ;} 
        if ($scope.relevamientoNuevo.electrica.medidorExclusivo === true) {
              $scope.relevamientoNuevo.electrica.medidorExclusivo = 1;} 

        if ($scope.relevamientoNuevo.maquina.tieneVSD=== false) {
              $scope.relevamientoNuevo.maquina.tieneVSD = 0 ;} 
        if ($scope.relevamientoNuevo.maquina.tieneVSD=== true) {
              $scope.relevamientoNuevo.maquina.tieneVSD = 1;} 

        if ($scope.relevamientoNuevo.llegaFactura=== false) {
              $scope.relevamientoNuevo.llegaFactura = 0 ;} 
        if ($scope.relevamientoNuevo.llegaFactura=== true) {
              $scope.relevamientoNuevo.llegaFactura = 1;} 

      $scope.myPromise = Relevamiento.update($scope.relevamientoNuevo).then(
        function(res){
          console.log("Relevamiento created successfully: " + JSON.stringify(res));

          $scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer = ($scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer === 1);
          $scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor = ($scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor === 1);
          $scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar = ($scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar === 1);
          $scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico = ($scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico === 1);
          $scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor = ($scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor === 1);
          $scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas = ($scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas === 1);
          $scope.relevamientoNuevo.mecanismoCalentarAgua.lena = ($scope.relevamientoNuevo.mecanismoCalentarAgua.lena === 1);
          $scope.relevamientoNuevo.intercambiador.usaIntercambiador = ($scope.relevamientoNuevo.intercambiador.usaIntercambiador === 1);
          $scope.relevamientoNuevo.riego.tieneRiego = ($scope.relevamientoNuevo.riego.tieneRiego === 1);
          $scope.relevamientoNuevo.riego.medidorAparte  = ($scope.relevamientoNuevo.riego.medidorAparte === 1);
          $scope.relevamientoNuevo.electrica.medidorExclusivo  = ($scope.relevamientoNuevo.electrica.medidorExclusivo === 1);
          $scope.relevamientoNuevo.maquina.tieneVSD  = ($scope.relevamientoNuevo.maquina.tieneVSD === 1);
          $scope.relevamientoNuevo.llegaFactura  = ($scope.relevamientoNuevo.llegaFactura === 1);
          
          ngToast.success('Relevamiento guardado correctamente');
          // $location.url('/locations');
        },
        function(error){
          ngToast.danger('Error al guardar relevamiento');
          console.log("Relevamiento error : " + JSON.stringify(error));
        });
    }

    $scope.cargarHorarios= function () {
      $scope.$broadcast('cargar');

  };

  $scope.crearRelevamiento = function(){ 

      $scope.relevamientoNuevo.tanques = $scope.nuevoRelevamientoTanques;
      $scope.relevamientoNuevo.auditor = $scope.auditores.selectedOption;
      if ($scope.relevamientoNuevo.electrica.numCuenta){
        if ($scope.relevamientoNuevo.electrica.datosSolicitados){
          $scope.relevamientoNuevo.estadoUTE = 3;
        } else {
          $scope.relevamientoNuevo.estadoUTE = 2;
        }
      } else {
        $scope.relevamientoNuevo.estadoUTE = 1;
      }

      //Se le asigna como marca la marca ingresada manualmente
      var cantidadTanques = $scope.nuevoRelevamientoTanques.length;
      for (var i = 0; i < cantidadTanques; i++) {
        if ( $scope.relevamientoNuevo.tanques[i].marca=="Otro") //verifica que esta definida y no sea vacio.
          $scope.relevamientoNuevo.tanques[i].marca = $scope.relevamientoNuevo.tanques[i].otraMarca;
      }
  
      $scope.relevamientoNuevo.idAuditoria= Auditoria.idRelevamiento;

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.usaTimer = 1;} 

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.recuperdadorCalor = 1;} 

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.colectorSolar = 1;} 

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.termotanqueElectrico = 1;} 

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.bombaCalor = 1;} 

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.calentadorGas = 1;} 

        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.lena === false) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.lena = 0 ;} 
        if ($scope.relevamientoNuevo.mecanismoCalentarAgua.lena === true) {
              $scope.relevamientoNuevo.mecanismoCalentarAgua.lena = 1;} 

        if ($scope.relevamientoNuevo.intercambiador.usaIntercambiador === false) {
              $scope.relevamientoNuevo.intercambiador.usaIntercambiador = 0 ;} 
        if ($scope.relevamientoNuevo.intercambiador.usaIntercambiador === true) {
              $scope.relevamientoNuevo.intercambiador.usaIntercambiador = 1;} 

        if ($scope.relevamientoNuevo.riego.tieneRiego === false) {
              $scope.relevamientoNuevo.riego.tieneRiego = 0 ;} 
        if ($scope.relevamientoNuevo.riego.tieneRiego === true) {
              $scope.relevamientoNuevo.riego.tieneRiego = 1;} 

        if ($scope.relevamientoNuevo.riego.medidorAparte === false) {
              $scope.relevamientoNuevo.riego.medidorAparte = 0 ;} 
        if ($scope.relevamientoNuevo.riego.medidorAparte === true) {
              $scope.relevamientoNuevo.riego.medidorAparte = 1;} 

        if ($scope.relevamientoNuevo.electrica.medidorExclusivo=== false) {
              $scope.relevamientoNuevo.electrica.medidorExclusivo = 0 ;} 
        if ($scope.relevamientoNuevo.electrica.medidorExclusivo === true) {
              $scope.relevamientoNuevo.electrica.medidorExclusivo = 1;} 

        if ($scope.relevamientoNuevo.maquina.tieneVSD=== false) {
              $scope.relevamientoNuevo.maquina.tieneVSD = 0 ;} 
        if ($scope.relevamientoNuevo.maquina.tieneVSD=== true) {
              $scope.relevamientoNuevo.maquina.tieneVSD = 1;} 

        if ($scope.relevamientoNuevo.llegaFactura=== false) {
              $scope.relevamientoNuevo.llegaFactura = 0 ;} 
        if ($scope.relevamientoNuevo.llegaFactura=== true) {
              $scope.relevamientoNuevo.llegaFactura = 1;} 

      $scope.myPromise = Relevamiento.create($scope.relevamientoNuevo).then(
        function(res){
          console.log("Relevamiento created successfully: " + JSON.stringify(res));
          ngToast.success('Relevamiento creado correctamente');
          $state.go('dashboard.auditoriasListar');
         // $location.url('/locations');
        },
        function(error){
          //ngToast.success('Relevamiento creado correctamente');
          console.log("Relevamiento error : " + JSON.stringify(error));
        });
    }
    
    $scope.cargarRelevamientoOffline = function(){ 
      
      $scope.auditoriasOffline = JSON.parse(localStorage.auditorias);

      var cantAuditorias = $scope.auditoriasOffline.length;
      for (var i = 0; i < cantAuditorias; i++) {
          if ($scope.auditoriasOffline[i].auditoria.id = $scope.idAuditoriaBuscar){
            $scope.auditoria = $scope.auditoriasOffline[i].auditoria;
            $scope.relevamientoNuevo = $scope.auditoria.relevamiento;
            $scope.productor = $scope.auditoriasOffline[i].productor;
          }
      }

      $scope.auditoria.matricula = $scope.productor.matricula;
      $scope.auditoria.tipo = $scope.auditoria.tipo.toString();
      $scope.auditoria.mecanismoContacto = $scope.auditoria.mecanismoContacto.toString();

      if ($scope.auditoria.estado === "Cancelada - No verifica condiciones financieras"){
        $scope.auditoria.motivo_cancelacion = "Productor no cumple condiciones financieras.";
      }

      if ($scope.productor.remisiones.length == 0) {
        $scope.auditoria.ultimaRemision = "No existen remisiones para este productor";
      } else {
        $scope.auditoria.ultimaRemision =  $scope.productor.remisiones[$scope.productor.remisiones.length-1].remision;
      } 
      
    }

    if( $stateParams.idAuditoria !== undefined && $stateParams.idAuditoria !== '' ) {
      Auditoria.idRelevamiento= $stateParams.idAuditoria
      
      if ($scope.bConnected){
        $scope.buscarAuditoria();
      } else {
        $scope.cargarRelevamientoOffline();
      }
      //$scope.buscarRelevamiento();
    }

  });


angular.module('sbAdminApp').controller('ModalRelevamientoCtrl', function ($scope, $modalInstance, tanqueAModificar, obtenerTitulo, obtenerBody) {

  $scope.tanqueAModificar = tanqueAModificar;
  $scope.title = obtenerTitulo;
  $scope.body = obtenerBody;

  $scope.ok = function () {
    $modalInstance.close($scope.tanqueAModificar);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


angular.module('sbAdminApp').controller('TimepickerDemoCtrl', function ($scope, $log, $filter) {
  
  var d = new Date();
  d.setHours( 5 );
  d.setMinutes( 0 );
  var d2= new Date();
  d2.setHours( 17 );
  d2.setMinutes( 0 );
  $scope.horarioRecoleccion = d2;
  $scope.primerOrdene = d;
  $scope.segundoOrdene = d2;

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.horarioRecoleccionChanged = function () {
    var hora = $filter('date')($scope.horarioRecoleccion, "hh:mm a");
    $scope.$parent.relevamientoNuevo.horarios = hora;
  };

  $scope.primerOrdeneChanged = function () {
    var horaPrimerOrdene = $filter('date')($scope.primerOrdene, "hh:mm a");
    $scope.$parent.relevamientoNuevo.maquina.primerHorario = horaPrimerOrdene;
  };

  $scope.segundoOrdeneChanged = function () {
    var horaSegundoOrdene = $filter('date')($scope.segundoOrdene, "hh:mm a");
    $scope.$parent.relevamientoNuevo.maquina.segundoHorario = horaSegundoOrdene;
  };

  $scope.$on('cargar', function(event, args) {
    var horarioRecoleccion = new Date();
    var primerOrdene = new Date();
    var segundoOrdene = new Date();

    if ($scope.$parent.relevamientoNuevo.horarios){
        var res = $scope.$parent.relevamientoNuevo.horarios.split(":",2);
        horarioRecoleccion.setHours(parseInt(res[0]));
        var res2 = res[1].split(" ");
        horarioRecoleccion.setMinutes(parseInt(res2[0]));
        if (res2[1] =="PM"){
          horarioRecoleccion.setHours(parseInt(res[0]) + 12);
        }
        $scope.horarioRecoleccion = horarioRecoleccion;
      }

    if ($scope.$parent.relevamientoNuevo.maquina.primerHorario){
        var res = $scope.$parent.relevamientoNuevo.maquina.primerHorario.split(":",2);
        primerOrdene.setHours(parseInt(res[0]));
        var res2 = res[1].split(" ");
        primerOrdene.setMinutes(parseInt(res2[0]));
        if (res2[1] =="PM"){
          primerOrdene.setHours(parseInt(res[0]) + 12);
        }
        $scope.primerOrdene = primerOrdene;
      }

    if ($scope.$parent.relevamientoNuevo.maquina.segundoHorario){
        var res = $scope.$parent.relevamientoNuevo.maquina.segundoHorario.split(":",2);
        segundoOrdene.setHours(parseInt(res[0]));
        var res2 = res[1].split(" ");
        segundoOrdene.setMinutes(parseInt(res2[0]));
        if (res2[1] =="PM"){
          segundoOrdene.setHours(parseInt(res[0]) + 12);
        }
        $scope.segundoOrdene = segundoOrdene;
      }


  });

});

angular.module('sbAdminApp').controller('DatepickerDemoCtrl', function (Auditoria, $scope, $filter) {
  
  $scope.idAuditoria = $scope.$parent.idAuditoriaBuscar;

 
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.setearMinimo = function () {
    Auditoria.getFechaAuditoria($scope.idAuditoria)
        .then(
        function(res){
          $scope.fechaAuditoria = res.data;    
          console.log("Obtener fecha auditoria OK");

        },
        function(error){
          console.log("Error al obtener fecha auditoria" + JSON.stringify(error));
        });
  };

  $scope.setearMinimo();

  $scope.visitaDesdeChanged = function () {
    var fecha = $filter('date')($scope.formData.dueDate, "dd-MM-yyyy");
    $scope.$parent.relevamientoNuevo.visitaDesde = fecha;
  };

  $scope.visitaHastaChanged = function () {
    var fecha = $filter('date')($scope.relevamientoNuevo.visitaHasta, "dd-MM-yyyy");
    $scope.$parent.relevamientoNuevo.visitaHasta = fecha;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.language = "es";
  };
  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.status = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };
});