'use strict';
/**
 * @ngdoc function
 * @name sgdaOffline.controller:PrototipoCtrl
 * @description
 * # PrototipoCtrl
 * Controller of the sgdaOffline
 */
angular.module('sbAdminApp')
  .controller('RealizarAuditoriaCtrl', function($scope, $rootScope, $localStorage, $location, $compile, $q, $state, $stateParams, 
                                       RelevamientoAuditoria, $modal, $modalStack,Auditoria, ngToast, Upload, IndexedDB, $window, Offline) {
    
    
    $scope.productor = {};
    $scope.productoresOffline = {};
    $scope.suministros = [];
    $scope.bombas = [];
    $scope.tanques = [];
    $scope.equiposCalentamiento = [];
    $scope.otrosEquipos = [];
    $scope.files = [];

    IndexedDB.initDB();
    
    $scope.dia = {};
    $scope.dia = new Date();
    $scope.dia.setHours( 14 );
    $scope.dia.setMinutes( 0 );
    
    $scope.showScroll = function(  ) {
        var bool = $('.device-sm').is(':visible') || $('.device-xs').is(':visible');
        return bool;
    }

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

    $scope.generalIsCollapsed = false;
    $scope.suministroElectricoIsCollapsed = true;
    $scope.suministrosIsCollapsed = false;
    $scope.instalacionElectricaIsCollapsed = true;
    $scope.orderneIsCollapsed = true;
    $scope.maquinaOrdeneIsCollapsed = true;
    $scope.bombasVacioIsCollapsed = false;
    $scope.sistemaFrioIsCollapsed = true;
    $scope.itercambiadorIsCollapsed = true;
    $scope.calentamientoAguaIsCollapsed = true;
    $scope.calentamientoIsCollapsed = true;
    $scope.otrosEquiposIsCollapsed = true;
    $scope.otrosEquipIsCollapsed = true;
    $scope.datosEstadisticosIsCollapsed = true;
    $scope.frasesInformeIsCollapsed = true;

    $scope.generalSiguiente = function() {
      $scope.generalIsCollapsed = true ;
      $scope.suministroElectricoIsCollapsed = false;
      $scope.guardarRelevamiento();
    }
    $scope.suministroElectricoSiguiente = function() {
      $scope.suministroElectricoIsCollapsed = true;
      $scope.instalacionElectricaIsCollapsed = false;
      $scope.guardarRelevamiento();

    }
    $scope.instalacionElectricaSiguiente = function() {
      $scope.instalacionElectricaIsCollapsed = true;
      $scope.orderneIsCollapsed = false;
      $scope.guardarRelevamiento();
    }
    $scope.ordeneSiguiente = function() {
      $scope.orderneIsCollapsed = true;
      $scope.maquinaOrdeneIsCollapsed = false;
      $scope.guardarRelevamiento();
    }
    $scope.maquinaOrdeneSiguiente = function() {
      $scope.maquinaOrdeneIsCollapsed = true;
      $scope.sistemaFrioIsCollapsed = false;
      $scope.guardarRelevamiento();
    }
    $scope.sistemaFrioSiguiente = function() {
      $scope.sistemaFrioIsCollapsed = true;
      $scope.itercambiadorIsCollapsed = false;
      $scope.guardarRelevamiento();
    }
    $scope.intercambiadorSiguiente = function() {
      $scope.itercambiadorIsCollapsed = true;
      $scope.calentamientoAguaIsCollapsed = false;
      $scope.guardarRelevamiento();
    }
    $scope.calentamientoAguaSiguiente = function() {
      $scope.calentamientoAguaIsCollapsed = true;
      $scope.otrosEquiposIsCollapsed = false;
      $scope.guardarRelevamiento();
    }
    $scope.otrosEquiposSiguiente = function() {
      $scope.otrosEquiposIsCollapsed = true;
      $scope.datosEstadisticosIsCollapsed = false;
      $scope.guardarRelevamiento();
    }
    $scope.frasesInformeSiguiente = function() {
      $scope.datosEstadisticosIsCollapsed = true;
      $scope.frasesInformeIsCollapsed = false;
      $scope.guardarRelevamiento();
    }
     $scope.humanFileSize = function(bytes, si) {
        var thresh = si ? 1000 : 1024;
        if(Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = si
            ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
            : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while(Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1)+' '+units[u];
    }
    $scope.getTamanoText = function(size) {
      return $scope.humanFileSize(size, true);
    }
    $scope.borrarFileClicked = function(file, index) {
      var body = 'Desea borrar el archivo: ' + file.id + ' ?';
      var title = 'Borrar archivo';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/borrarSuministroModal.html',
        controller: 'ModalBorrarArchivoCtrl',
        resolve: {
            obtenerFile: function () {
              return file;
            },
            obtenerIndex: function () {
              return index;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }
          }
      });
      modalInstance.result.then(function (file) {
        IndexedDB.deleteOneFile(file.filename);
        $scope.files.splice(index, 1);
            
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }
    
    $scope.verFileClicked = function(file,$index) {
      
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/verArchivo.html',
        controller: 'ModalVerArchivoCtrl',
        resolve: {
            getfile: function () {
              return file;
            }
          }
      });
      // modalInstance.rendered.then(function () {
     // //process your logic for DOM element
     // console.info('test');
      // }); 
      
    }
    $scope.buscarAuditoria = function() {
     
      var url = $location.url();

      if ((url.indexOf("ver") != -1) && $scope.bConnected ){

        Auditoria.getAuditoria($scope.idAuditoriaBuscar)
        .then( function(res){
          
          
          $scope.auditoria.id = res.data.id;
          $scope.relevamiento = res.data.relevamientoAuditoria;
          

          if ($scope.relevamiento){
              $scope.relevamientoNuevo = $scope.relevamiento;
              $scope.relevamientoNuevo.datosEstadisticos.establecimientoFamiliarBoolean = ($scope.relevamientoNuevo.datosEstadisticos.establecimientoFamiliar === 1);
              $scope.relevamientoNuevo.suministroElectrico.incluyeCasaBoolean  = ($scope.relevamientoNuevo.suministroElectrico.incluyeCasa === 1);
              $scope.relevamientoNuevo.suministroElectrico.incluyeCasaBoolean  = ($scope.relevamientoNuevo.suministroElectrico.incluyeCasa === 1);
              $scope.relevamientoNuevo.instalacionElectrica.conexionTierraBoolean  = ($scope.relevamientoNuevo.instalacionElectrica.conexionTierra === 1);
              $scope.relevamientoNuevo.maquinaOrdene.variadorVelocidadBoolean  = ($scope.relevamientoNuevo.maquinaOrdene.variadorVelocidad === 1);
              $scope.relevamientoNuevo.intercambiadorPlacas.tieneIntercambiadorBoolean  = ($scope.relevamientoNuevo.intercambiadorPlacas.tieneIntercambiador === 1);
              $scope.relevamientoNuevo.calentamientoAgua.tieneAblandadorBoolean = ($scope.relevamientoNuevo.calentamientoAgua.tieneAblandador === 1);
              $scope.relevamientoNuevo.calentamientoAgua.problemasAguaDuraBoolean = ($scope.relevamientoNuevo.calentamientoAgua.problemasAguaDura === 1);
              $scope.relevamientoNuevo.calentamientoAgua.tieneAblandadorBoolean = ($scope.relevamientoNuevo.calentamientoAgua.tieneAblandador === 1);
          }

          console.log("Auditoria buscar successfully: " + JSON.stringify(res));
          //$mdToast.show($mdToast.simple().content(res.message));
         // $location.url('/locations');
        },
        function(error){
          console.log("Auditoria error : " + JSON.stringify(error));
        });
    

      } else {

        $scope.auditoriasOffline = JSON.parse(localStorage.getItem("auditorias"));
        $scope.relevamientosOffline = JSON.parse(localStorage.getItem("relevamientos"));

        if (!$scope.auditoriasOffline){
          ngToast.warning("No existen datos almacenados en storage local");
        } else {
          
          var encontrado = 0;
          var cantAuditorias = $scope.auditoriasOffline.length;
          for (var i = 0; i < cantAuditorias; i++) {
            if ($scope.auditoriasOffline[i].auditoria.id == $stateParams.idAuditoria){
              encontrado = 1;
              $scope.auditoria = $scope.auditoriasOffline[i].auditoria;
              $scope.productor = $scope.auditoriasOffline[i].productor;
            }
          }

          if (!encontrado){
            ngToast.warning("No existen datos de la auditoria en el storage local");
          } else {


            // Si hay relevamientos cargados. Busco si hay relevamiento empezado para esta auditoria. Si lo hay lo cargo.
            var relevamientoEncontrado = 0;
            if ($scope.relevamientosOffline){
              var cantRelevamientos = $scope.relevamientosOffline.length;
              for (var i = 0; i < cantRelevamientos; i++) {
                if ($scope.relevamientosOffline[i].idAuditoria === parseInt($stateParams.idAuditoria)){
                  relevamientoEncontrado = 1;
                  $scope.relevamiento = $scope.relevamientosOffline[i];
                  
                  $scope.suministros = $scope.relevamiento.suministroElectrico.suministros;
                  $scope.bombas = $scope.relevamiento.maquinaOrdene.bombas;
                  $scope.tanques = $scope.relevamiento.sistemaFrio.tanques;
                  $scope.equiposCalentamiento = $scope.relevamiento.calentamientoAgua.equipos;
                  $scope.otrosEquipos = $scope.relevamiento.otrosEquipos.equipos;
 
                var idAuditoria = $scope.relevamientosOffline[i].idAuditoria;
                
                IndexedDB.initDB().then( function(){
                  
                  $scope.getFotos(idAuditoria).then(function(res){
                      var j =0;
                      for (var i = 0; i < res.length; i++) {
                        if (  res[i] !== undefined ){
                          $scope.files[j++] = res[i];
                        }
                      }
                  });                
                });
              }
              }
            }

            //Si no hay relevamiento empezado, se comienza uno nuevo.
            if (!relevamientoEncontrado ){ //&& $scope.auditoria.relevamientoAuditoria == null
              $scope.relevamiento = {};
              $scope.relevamiento.suministroElectrico = {};
              $scope.relevamiento.instalacionElectrica = {};
              $scope.relevamiento.intercambiadorPlacas = {};
              $scope.relevamiento.datosEstadisticos = {};
              $scope.relevamiento.maquinaOrdene = {};
              $scope.relevamiento.ordene = {};
              $scope.relevamiento.sistemaFrio = {};
              $scope.relevamiento.calentamientoAgua = {};
              $scope.relevamiento.otrosEquipos = {};
              $scope.relevamiento.suministroElectrico.suministros = [];
              $scope.relevamiento.maquinaOrdene.bombas = [];
              $scope.relevamiento.sistemaFrio.tanques = [];
              $scope.relevamiento.calentamientoAgua.equipos = [];
              $scope.relevamiento.otrosEquipos.equipos = [];

              //Datos precargados
              $scope.relevamiento.fecha = new Date();
              $scope.relevamiento.idAuditoria = $scope.auditoria.id;
              //$scope.relevamiento.auditoria = $scope.auditoria;
              $scope.relevamiento.suministroElectrico.idUTE = $scope.auditoria.relevamiento.electrica.numCuenta;
              $scope.guardarRelevamiento();
              
            }else if(!relevamientoEncontrado){
              //$scope.relevamiento = JSON.stringify($scope.auditoria.relevamientoAuditoria);
            }

            
          }

        }
      }
    }

    $scope.guardarRelevamiento = function() {
     
      $scope.relevamientosOffline = JSON.parse(localStorage.getItem("relevamientos"));
      if ($scope.relevamientosOffline){
        var cantRelevamientos = $scope.relevamientosOffline.length;
        var encontrado = false;
        for (var i = 0; i < cantRelevamientos; i++) {
          if ($scope.relevamientosOffline[i].idAuditoria === parseInt($stateParams.idAuditoria)){
            encontrado = true;
            $scope.relevamientosOffline[i] = $scope.relevamiento;  
            
          }
        }
        if (!encontrado){
          $scope.relevamientosOffline[cantRelevamientos] = $scope.relevamiento; 
        }
      } else {
        $scope.relevamientosOffline = [];
        $scope.relevamientosOffline[0] = $scope.relevamiento;
      }
      localStorage.setItem("relevamientos", JSON.stringify($scope.relevamientosOffline));
    }

    $scope.agregarSuministroClicked = function(){
      $scope.suministroAModificar = null;
      $scope.editarSuministroModal('Nuevo suministro', true);
    }

    $scope.modificarSuministroClicked = function(suministro,index){
      $scope.suministroAModificar = JSON.parse(JSON.stringify(suministro));
      $scope.editarSuministroModal('Modificar suministro', false, index);
    }

    $scope.borrarSuministroClicked = function(suministro,index){
      $scope.suministroABorrar = JSON.parse(JSON.stringify(suministro));
      $scope.borrarSuministroModal(suministro,index);
    }

    $scope.editarSuministroModal = function (title, creacion, index) {
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/editarSuministroModal.html',
        controller: 'ModalSuministroInstanceCtrl',
        resolve: {
            suministroAModificar: function () {
              return $scope.suministroAModificar;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }  
          }
      });
      modalInstance.result.then(function (suministro) {
        if (creacion){ // Agregar a arreglo
          $scope.suministros[$scope.suministros.length] = suministro;
        } else { //sustituir en arreglo
          $scope.suministros[index] = suministro;
        }  
        $scope.relevamiento.suministroElectrico.suministros = $scope.suministros;
        $scope.guardarRelevamiento(); 

      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.borrarSuministroModal = function (suministro, index) {
      var body = 'Desea borrar el suministro: ' + suministro.idUTE + ' ?';
      var title = 'Borrar suministro';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/borrarSuministroModal.html',
        controller: 'ModalSuministroInstanceCtrl',
        resolve: {
            suministroAModificar: function () {
              return suministro;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }
          }
      });
      modalInstance.result.then(function (suministro) {
        $scope.suministros.splice(index, 1); 
        $scope.relevamiento.suministroElectrico.suministros = $scope.suministros;
        $scope.guardarRelevamiento();       
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };


    $scope.agregarBombaClicked = function(){
      $scope.bombaAModificar = null;
      $scope.editarBombaModal('Nuevo bomba', true);
    }

    $scope.modificarBombaClicked = function(bomba,index){
      $scope.bombaAModificar = JSON.parse(JSON.stringify(bomba));
      $scope.editarBombaModal('Modificar bomba', false, index);
    }

    $scope.borrarBombaClicked = function(bomba,index){
      $scope.bombaABorrar = JSON.parse(JSON.stringify(bomba));
      $scope.borrarBombaModal(bomba,index);
    }

    $scope.editarBombaModal = function (title, creacion, index) {
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/editarBombaModal.html',
        controller: 'ModalBombaInstanceCtrl',
        resolve: {
            bombaAModificar: function () {
              return $scope.bombaAModificar;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }  
          }
      });
      modalInstance.result.then(function (bomba) {
        if (creacion){ // Agregar a arreglo
          $scope.bombas[$scope.bombas.length] = bomba;
        } else { //sustituir en arreglo
          $scope.bombas[index] = bomba;
        }  
        $scope.relevamiento.maquinaOrdene.bombas = $scope.bombas;
        $scope.guardarRelevamiento(); 

      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.borrarBombaModal = function (bomba, index) {
      var body = 'Desea borrar la bomba de vacío ?';
      var title = 'Borrar bomba';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/borrarBombaModal.html',
        controller: 'ModalBombaInstanceCtrl',
        resolve: {
            bombaAModificar: function () {
              return bomba;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }
          }
      });
      modalInstance.result.then(function (bomba) {
        $scope.bombas.splice(index, 1); 
        $scope.relevamiento.maquinaOrdene.bombas = $scope.bombas;
        $scope.guardarRelevamiento();       
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.agregarTanqueClicked = function(){
      $scope.tanqueAModificar = null;
      $scope.editarTanqueModal('Nuevo tanque', true);
    }

    $scope.modificarTanqueClicked = function(tanque,index){
      $scope.tanqueAModificar = JSON.parse(JSON.stringify(tanque));
      $scope.editarTanqueModal('Modificar tanque', false, index);
    }

    $scope.borrarTanqueClicked = function(tanque,index){
      $scope.tanqueABorrar = JSON.parse(JSON.stringify(tanque));
      $scope.borrarTanqueModal(tanque,index);
    }

    $scope.editarTanqueModal = function (title, creacion, index) {
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/editarTanqueCompletoModal.html',
        controller: 'ModalTanqueInstanceCtrl',
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
        if (creacion){ // Agregar a arreglo
          $scope.tanques[$scope.tanques.length] = tanque;
        } else { //sustituir en arreglo
          $scope.tanques[index] = tanque;
        }  
        $scope.relevamiento.sistemaFrio.tanques = $scope.tanques;
        $scope.guardarRelevamiento(); 

      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.borrarTanqueModal = function (tanque, index) {
      var body = 'Desea borrar el tanque: ' + tanque.marca + '?';
      var title = 'Borrar tanque';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/borrarTanqueModal.html',
        controller: 'ModalTanqueInstanceCtrl',
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
        $scope.tanques.splice(index, 1); 
        $scope.relevamiento.sistemaFrio.tanques = $scope.tanques;
        $scope.guardarRelevamiento();       
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.agregarEquipoCalentamientoClicked = function(){
      $scope.equipoAModificar = null;
      $scope.editarEquipoCalentamientoModal('Nuevo equipo', true);
    }

    $scope.modificarEquipoCalentamientoClicked = function(equipo,index){
      $scope.equipoAModificar = JSON.parse(JSON.stringify(equipo));
      $scope.editarEquipoCalentamientoModal('Modificar equipo', false, index);
    }

    $scope.borrarEquipoCalentamientoClicked = function(equipo,index){
      $scope.equipoABorrar = JSON.parse(JSON.stringify(equipo));
      $scope.borrarEquipoCalentamientoModal(equipo,index);
    }


    $scope.editarEquipoCalentamientoModal = function (title, creacion, index) {
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/editarEquipoCalentamientoModal.html',
        controller: 'ModalEquipoInstanceCtrl',
        resolve: {
            equipoAModificar: function () {
              return $scope.equipoAModificar;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }  
          }
      });
      modalInstance.result.then(function (equipo) {
        if (creacion){ // Agregar a arreglo
          $scope.equiposCalentamiento[$scope.equiposCalentamiento.length] = equipo;
        } else { //sustituir en arreglo
          $scope.equiposCalentamiento[index] = equipo;
        }  
        $scope.relevamiento.calentamientoAgua.equipos = $scope.equiposCalentamiento;
        $scope.guardarRelevamiento(); 

      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.borrarEquipoCalentamientoModal = function (equipo, index) {
      var body = 'Desea borrar el equipo: ' + equipo.equipo + '?';
      var title = 'Borrar equipo';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/borrarEquipoModal.html',
        controller: 'ModalEquipoInstanceCtrl',
        resolve: {
            equipoAModificar: function () {
              return equipo;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }
          }
      });
      modalInstance.result.then(function (equipo) {
        $scope.equiposCalentamiento.splice(index, 1); 
        $scope.relevamiento.calentamientoAgua.equipos = $scope.equiposCalentamiento;
        $scope.guardarRelevamiento();       
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.agregarOtroEquipoClicked = function(){
      $scope.equipoAModificar = null;
      $scope.editarOtroEquipoModal('Nuevo equipo', true);
    }

    $scope.modificarOtroEquipoClicked = function(equipo,index){
      $scope.equipoAModificar = JSON.parse(JSON.stringify(equipo));
      $scope.editarOtroEquipoModal('Modificar equipo', false, index);
    }

    $scope.borrarOtroEquipoClicked = function(equipo,index){
      $scope.equipoABorrar = JSON.parse(JSON.stringify(equipo));
      $scope.borrarOtroEquipoModal(equipo,index);
    }

    $scope.editarOtroEquipoModal = function (title, creacion, index) {
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/editarOtroEquipoModal.html',
        controller: 'ModalEquipoInstanceCtrl',
        resolve: {
            equipoAModificar: function () {
              return $scope.equipoAModificar;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }  
          }
      });
      modalInstance.result.then(function (equipo) {
        if (creacion){ // Agregar a arreglo
          $scope.otrosEquipos[$scope.otrosEquipos.length] = equipo;
        } else { //sustituir en arreglo
          $scope.otrosEquipos[index] = equipo;
        }  
        $scope.relevamiento.otrosEquipos.equipos = $scope.otrosEquipos;
        $scope.guardarRelevamiento(); 

      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.borrarOtroEquipoModal = function (equipo, index) {
      var body = 'Desea borrar el equipo: ' + equipo.equipo + '?';
      var title = 'Borrar equipo';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/borrarEquipoModal.html',
        controller: 'ModalEquipoInstanceCtrl',
        resolve: {
            equipoAModificar: function () {
              return equipo;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }
          }
      });
      modalInstance.result.then(function (equipo) {
        $scope.otrosEquipos.splice(index, 1); 
        $scope.relevamiento.otrosEquipos.equipos = $scope.otrosEquipos;
        $scope.guardarRelevamiento();       
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.boolAint = function(booleano){ 
      if (booleano){
        return 1;
      } else {
        return 0;
      }
    };

    $scope.crearRelevamiento = function(finRelevamiento){

      var url = $location.url();

      if (url.indexOf("ver") == -1){
        $scope.guardarRelevamiento();
      }

      if ($scope.bConnected){

        if (url.indexOf("ver") != -1){
          $scope.relevamiento = $scope.relevamientoNuevo;
        }

        $scope.relevamiento.suministroElectrico.incluyeCasa = $scope.boolAint($scope.relevamiento.suministroElectrico.incluyeCasaBoolean);
        if (!$scope.relevamiento.suministroElectrico.incluyeCasa){
          $scope.relevamiento.suministroElectrico.cantPersonas = 0;
        }

        $scope.relevamiento.instalacionElectrica.conexionTierra = $scope.boolAint($scope.relevamiento.instalacionElectrica.conexionTierraBoolean);
        if (!$scope.relevamiento.instalacionElectrica.conexionTierra){
          $scope.relevamiento.instalacionElectrica.estadoTierra = "";
        }

        $scope.relevamiento.intercambiadorPlacas.tieneIntercambiador = $scope.boolAint($scope.relevamiento.intercambiadorPlacas.tieneIntercambiadorBoolean);
        if (!$scope.relevamiento.intercambiadorPlacas.tieneIntercambiador){
          $scope.relevamiento.intercambiadorPlacas.situacion = "";
          $scope.relevamiento.intercambiadorPlacas.relacionCaudal = "";
          $scope.relevamiento.intercambiadorPlacas.marca = "";
          $scope.relevamiento.intercambiadorPlacas.modelo = "";
          $scope.relevamiento.intercambiadorPlacas.numeroPlacas = 0;
          $scope.relevamiento.intercambiadorPlacas.temperaturaLeche = 0;
          $scope.relevamiento.intercambiadorPlacas.caudalesSincronizadosBoolean = false;
        }

        $scope.relevamiento.intercambiadorPlacas.caudalesSincronizados = $scope.boolAint($scope.relevamiento.intercambiadorPlacas.caudalesSincronizadosBoolean);
        
        $scope.relevamiento.datosEstadisticos.establecimientoFamiliar = $scope.boolAint($scope.relevamiento.datosEstadisticos.establecimientoFamiliarBoolean);

        $scope.relevamiento.calentamientoAgua.problemasAguaDura = $scope.boolAint($scope.relevamiento.calentamientoAgua.problemasAguaDuraBoolean);
        if (!$scope.relevamiento.calentamientoAgua.problemasAguaDura){
          $scope.relevamiento.calentamientoAgua.tieneAblandadorBoolean = false;
        }

        var cantEquiposCalentamiento = $scope.relevamiento.calentamientoAgua.equipos.length;
        for (var i = 0; i < cantEquiposCalentamiento; i++){
          $scope.relevamiento.calentamientoAgua.equipos[i].intemperie = $scope.boolAint($scope.relevamiento.calentamientoAgua.equipos[i].intemperieBoolean);
          $scope.relevamiento.calentamientoAgua.equipos[i].respaldoElectrico = $scope.boolAint($scope.relevamiento.calentamientoAgua.equipos[i].respaldoElectricoBoolean);
          $scope.relevamiento.calentamientoAgua.equipos[i].timer = $scope.boolAint($scope.relevamiento.calentamientoAgua.equipos[i].timerBoolean);
        }
        
        $scope.relevamiento.calentamientoAgua.tieneAblandador = $scope.boolAint($scope.relevamiento.calentamientoAgua.tieneAblandadorBoolean);

        $scope.relevamiento.maquinaOrdene.variadorVelocidad = $scope.boolAint($scope.relevamiento.maquinaOrdene.variadorVelocidadBoolean);

        var cantTanques = $scope.relevamiento.sistemaFrio.tanques.length;
        for (var i = 0; i < cantTanques; i++){
          $scope.relevamiento.sistemaFrio.tanques[i].intemperie = $scope.boolAint($scope.relevamiento.sistemaFrio.tanques[i].intemperieBoolean);
          $scope.relevamiento.sistemaFrio.tanques[i].tanqueCalor = $scope.boolAint($scope.relevamiento.sistemaFrio.tanques[i].tanqueCalorBoolean);
        }
       
        var form = new window.FormData();
        form.append('id', $scope.relevamiento.idAuditoria);


         if (url.indexOf("ver") != -1){
          $scope.myPromise = RelevamientoAuditoria.create($scope.relevamiento,finRelevamiento).then(
            function(res){
              console.log("Relevamiento de auditoria created successfully: " + JSON.stringify(res));
              ngToast.success('Relevamiento de auditoria guardado correctamente');
              
              $state.go('dashboard.auditoriasListar');
             },
             function(error){
               console.log("Relevamiento Auditoria error : " + JSON.stringify(error));
             });
         } else {

            $scope.getFotos($scope.relevamiento.idAuditoria).then(function(res){
            for (var i = 0; i < res.length; i++) {
              if (  res[i] !== undefined ){
                //res[i].blob.name =  res[i].filename;
                form.append('file',  res[i].blob, res[i].filename + '.' + res[i].blob.name.split('.').pop());
              }
            }

            $scope.myPromise = RelevamientoAuditoria.uploadFiles(form).then(
              function(res){
                console.log("Relevamiento de uploadFiles created successfully: " + JSON.stringify(res));
              },
              function(error){
                console.log("Relevamiento Auditoria error : " + JSON.stringify(error));
                ngToast.danger('Relevamiento de auditoria error ' + JSON.stringify(error));
              });
            
            $scope.myPromise =  RelevamientoAuditoria.create($scope.relevamiento,finRelevamiento).then(
              function(res){
                console.log("Relevamiento de auditoria created successfully: " + JSON.stringify(res));
                ngToast.success('Relevamiento de auditoria guardado correctamente');
                if (finRelevamiento){
                  $state.go('dashboard.auditoriasAuditorListar');
                }
              },
              function(error){
                console.log("Relevamiento Auditoria error : " + JSON.stringify(error));
              });
          });
        }
      }
    }   
    $scope.getFotos = function(idAuditoria){
     
      var deferred = $q.defer();
      var fileList =['Suministro electrico', 'Instalacion electrica', 'Ordene', 'Maquina de ordene','Sistema de frio','Intercambiador de placas', 'Calentamiento de agua', 'Otros equipos'];
      var promises = [];
      
      function getFile(idAuditoria, seccion){
          var deferred = $q.defer();
          var response = IndexedDB.getFile(idAuditoria, seccion);
          response.onerror = function(event) {
            console.log('error');
            deferred.resolve(event);
          };
          response.onsuccess = function(event) {          
            var imgFile = event.target.result;
            deferred.resolve(imgFile);
          };
          return deferred.promise;
      }
      if ($scope.files.length>0){
        for (var i = 0; i < $scope.files.length; i++) {         
            promises.push(getFile($scope.files[i].id));
        } 
      }else{
        //Init files array
         for (var i = 0; i < fileList.length; i++) {         
          for (var j = 1; j < 4; j++) {         
            promises.push(getFile(idAuditoria+fileList[i]+'_'+j));
          } 
        } 
      }        
      $q.all(promises).then( function(res){
          console.log("all promises" + JSON.stringify(res));
          deferred.resolve(res);
      });
      return deferred.promise;
    }  
    
    $scope.subirFoto = function(file, errFiles, seccion) {
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
          var id = $stateParams.idAuditoria; 
          var fileName = seccion + "_" + ($scope.files.length+1);
          
          IndexedDB.putFile(id + fileName,file);          
          
          var response = IndexedDB.getFile(id + fileName);
          response.onerror = function(event) {
            console.log('error');
          };
          response.onsuccess = function(event) {

            $scope.files[$scope.files.length] = event.target.result;
            
            var file = event.target.result;
            
            if( file.blob.type.indexOf('image/') !== -1){
              console.log('image');
              // Get window.URL object
            /*  var URL = window.URL || window.webkitURL;
              // Create and revoke ObjectURL
              var imgURL = URL.createObjectURL(file.blob);
              // Set img src to ObjectURL
              var imgElement = document.getElementById(seccion);
              imgElement.setAttribute("src", imgURL);
              // Revoking ObjectURL
              imgElement.onload = function() {
                  window.URL.revokeObjectURL(this.src);
              }*/
            }else if( file.blob.type.indexOf('audio/') !== -1){
              console.log('audio');
              /* // Get window.URL object
              var URL = window.URL || window.webkitURL;
              // Create and revoke ObjectURL
              var imgURL = URL.createObjectURL(file.blob);
              // Set img src to ObjectURL
              var imgElement = document.getElementById(seccion);
              imgElement.setAttribute("src", imgURL);
              // Revoking ObjectURL
              imgElement.onload = function() {
                  window.URL.revokeObjectURL(this.src);
              }*/
            }else if( file.blob.type.indexOf('video/') !== -1){
               console.log('video');
                              // Get window.URL object
             /* var URL = window.URL || window.webkitURL;
              // Create and revoke ObjectURL
              var imgURL = URL.createObjectURL(file.blob);
              // Set img src to ObjectURL
              var imgElement = document.getElementById(seccion);
              imgElement.setAttribute("src", imgURL);
              // Revoking ObjectURL
              imgElement.onload = function() {
                  window.URL.revokeObjectURL(this.src);
              }*/
            }
            
          };
        }
    }

    if( $stateParams.idAuditoria !== undefined && $stateParams.idAuditoria !== '' ) {
      $scope.buscarAuditoria();
    }

});
	
angular.module('sbAdminApp').controller('ModalVerArchivoCtrl', function ($scope, $modalInstance, $timeout, getfile) {
      
    $scope.title = '';
    $scope.body = '';
    var file = getfile;

    function humanFileSize(bytes, si) {
        var thresh = si ? 1000 : 1024;
        if(Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = si
            ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
            : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while(Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1)+' '+units[u];
    }
    
    $scope.filename = file.id;
    $scope.type = file.blob.type;
    $scope.size = humanFileSize(file.blob.size, true);
    
    $scope.fileIsImage = false;
    $scope.fileIsAudio = false;
    $scope.fileIsVideo = false;
    
    function modalLoaded(){
      if( file.blob.type.indexOf('image/') !== -1){

        $scope.fileIsImage = true;
        // Get window.URL object
        var URL = window.URL || window.webkitURL;
        // Create and revoke ObjectURL
        var imgURL = URL.createObjectURL(file.blob);
        // Set img src to ObjectURL
        var imgElement = document.getElementById('fileImage');
        imgElement.setAttribute("src", imgURL);
        // Revoking ObjectURL
        imgElement.onload = function() {
            window.URL.revokeObjectURL(this.src);
        }
      }else if( file.blob.type.indexOf('audio/') !== -1){

        $scope.fileIsAudio = true;
         // Get window.URL object
        var URL = window.URL || window.webkitURL;
        // Create and revoke ObjectURL
        var imgURL = URL.createObjectURL(file.blob);
        // Set img src to ObjectURL
        var imgElement = document.getElementById('fileAudio');
        imgElement.setAttribute("src", imgURL);
        // Revoking ObjectURL
        imgElement.onload = function() {
            window.URL.revokeObjectURL(this.src);
        }
      }else if( file.blob.type.indexOf('video/') !== -1){

        $scope.fileIsVideo = true;
        // Get window.URL object
        var URL = window.URL || window.webkitURL;
        // Create and revoke ObjectURL
        var imgURL = URL.createObjectURL(file.blob);
        // Set img src to ObjectURL
        var imgElement = document.getElementById('fileVideo');
        imgElement.setAttribute("src", imgURL);
        // Revoking ObjectURL
        imgElement.onload = function() {
            window.URL.revokeObjectURL(this.src);
        }
      }
    }
    
    $timeout(modalLoaded, 0);
  
   // addEventListener('rendered', modalLoaded, false);

    $scope.ok = function () {
      $modalInstance.close();
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

angular.module('sbAdminApp').controller('ModalBorrarArchivoCtrl', function ($scope, $modalInstance, obtenerFile, obtenerIndex, obtenerTitulo, obtenerBody) {
    
    $scope.file = obtenerFile;
    $scope.index = obtenerIndex;
    $scope.title = obtenerTitulo;
    $scope.body = obtenerBody;

    $scope.ok = function () {
      $modalInstance.close($scope.file, $scope.index);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
angular.module('sbAdminApp').controller('ModalSuministroInstanceCtrl', function ($scope, $modalInstance, suministroAModificar, obtenerTitulo, obtenerBody) {
    $scope.suministroAModificar = suministroAModificar;
    $scope.title = obtenerTitulo;
    $scope.body = obtenerBody;

    $scope.ok = function () {
      $modalInstance.close($scope.suministroAModificar);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

angular.module('sbAdminApp').controller('ModalBombaInstanceCtrl', function ($scope, $modalInstance, bombaAModificar, obtenerTitulo, obtenerBody) {
    $scope.bombaAModificar = bombaAModificar;
    $scope.title = obtenerTitulo;
    $scope.body = obtenerBody;

    $scope.ok = function () {
      $modalInstance.close($scope.bombaAModificar);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

angular.module('sbAdminApp').controller('ModalTanqueInstanceCtrl', function ($scope, $modalInstance, tanqueAModificar, obtenerTitulo, obtenerBody) {
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

angular.module('sbAdminApp').controller('ModalEquipoInstanceCtrl', function ($scope, $modalInstance, equipoAModificar, obtenerTitulo, obtenerBody) {
    $scope.equipoAModificar = equipoAModificar;
    $scope.title = obtenerTitulo;
    $scope.body = obtenerBody;

    $scope.ok = function () {
      $modalInstance.close($scope.equipoAModificar);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
