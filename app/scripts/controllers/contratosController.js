'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ProductorCtrl
 * @description
 * # ProductorCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('ContratosCtrl', function($scope, $rootScope, $modal, $modalStack, $localStorage, $location, $window, $timeout,$compile, $q, $state, $stateParams, ngToast, 
                                         $filter, DTOptionsBuilder, DTColumnBuilder, AuthService, Contrato, VIEW_CONSTANTS, SERVER_CONSTANTS ) {
  //$mdToast,
      
    var vm = this;
    var marker = null;
    $scope.contrato = {};
    $scope.contratoAux = {};
    $scope.dosContratos = {};
    $scope.dosContratos.contrato1 = {};
    $scope.dosContratos.contrato2 = {};
    $scope.contrato.domicilio = {};
    $scope.contrato.factura = {};
    $scope.contrato.remito = {};
    $scope.contrato.remito.fechaVisita = new Date();
    $scope.dtInstance = {};
    $scope.filtro = {};
    $scope.dtInstanceVer = {};
    $scope.dtInstanceModificar = {};
    $scope.infoBasicaContratoIsCollapsed = true;
    $scope.estadosContratos = {};
    $scope.historicoContrato = {};
    $scope.nuevoEstado = {};
    $scope.errorLargoCiUru = false;
    $scope.errorLargoCiBra = false;
    $scope.mostrarErrorForm = false;
    $scope.errorFaltaPlazo = false;


    $scope.contratoOpcionesEstados = [{nombre:'Todos', text:'TODOS'},{nombre:'Borrador', text:'BORRADOR'},{nombre:'Generado', text:'GENERADO'},{nombre:'Firmado', text:'FIRMADO'},{nombre:'Cancelado', text:'CANCELADO'},{nombre:'Rechazado', text:'RECHAZADO'},{nombre:'Activo', text:'ACTIVO'},{nombre:'Para recoordinar', text:'PARA_RECOORDINAR'},{nombre:'Recoordinado', text:'RECOORDINADO'}];

    $scope.contratoOpcionesComision = [{nombre:-1, text:'Todos'},{nombre: 1, text:'Si'},{nombre: 0, text:'No'}];

    $scope.departamentos = [{nombre:'CANELONES'},{nombre:'RIVERA'},{nombre:'ARTIGAS'},{nombre:'CERRO LARGO'},{nombre:'COLONIA'},{nombre:'DURAZNO'},{nombre:'FLORES'},{nombre:'FLORIDA'},{nombre:'LAVALLEJA'},{nombre:'MALDONADO'},{nombre:'PAYSANDÚ'},{nombre:'RIO NEGRO'},{nombre:'ROCHA'},{nombre:'SALTO'},{nombre:'SAN JOSÉ'},{nombre:'SORIANO'},{nombre:'TACUAREMBÓ'},{nombre:'TREINTA Y TRES'}];
    $scope.departamentosModificar = [{nombre:'MONTEVIDEO'},{nombre:'CANELONES'},{nombre:'RIVERA'},{nombre:'ARTIGAS'},{nombre:'CERRO LARGO'},{nombre:'COLONIA'},{nombre:'DURAZNO'},{nombre:'FLORES'},{nombre:'FLORIDA'},{nombre:'LAVALLEJA'},{nombre:'MALDONADO'},{nombre:'PAYSANDÚ'},{nombre:'RIO NEGRO'},{nombre:'ROCHA'},{nombre:'SALTO'},{nombre:'SAN JOSÉ'},{nombre:'SORIANO'},{nombre:'TACUAREMBÓ'},{nombre:'TREINTA Y TRES'}];
    $scope.departamentosFiltrar = [{nombre:'Todos'},{nombre:'MONTEVIDEO'},{nombre:'CANELONES'},{nombre:'RIVERA'},{nombre:'ARTIGAS'},{nombre:'CERRO LARGO'},{nombre:'COLONIA'},{nombre:'DURAZNO'},{nombre:'FLORES'},{nombre:'FLORIDA'},{nombre:'LAVALLEJA'},{nombre:'MALDONADO'},{nombre:'PAYSANDÚ'},{nombre:'RIO NEGRO'},{nombre:'ROCHA'},{nombre:'SALTO'},{nombre:'SAN JOSÉ'},{nombre:'SORIANO'},{nombre:'TACUAREMBÓ'},{nombre:'TREINTA Y TRES'}];
    //$scope.meses = [{nombre:'ENERO'},{nombre:'FEBRERO'},{nombre:'MARZO'},{nombre:'ABRIL'},{nombre:'MAYO'},{nombre:'JUNIO'},{nombre:'JULIO'},{nombre:'AGOSTO'},{nombre:'SETIEMBRE'},{nombre:'OCTUBRE'},{nombre:'NOVIEMBRE'},{nombre:'DICIEMBRE'}];
    //$scope.mesSeleccionado = $scope.meses[0];

    var urlListar = $location.url();
    if ((urlListar.indexOf("listar_contratos_ver") != -1)){
      //PARA VER CONTRATO
      if (typeof $localStorage.filtroVerContrato != 'undefined' && $localStorage.filtroVerContrato !== null){
          if (typeof $localStorage.filtroVerContrato.estadoSeleccionado != 'undefined' && $localStorage.filtroVerContrato.estadoSeleccionado !== null ){
             $scope.estadoSeleccionado =  $scope.contratoOpcionesEstados[$localStorage.filtroVerContrato.estadoSeleccionado];
          } else {
            $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
          }
      } else {
          $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      }

      if (typeof $localStorage.filtroVerContrato != 'undefined' && $localStorage.filtroVerContrato !== null){
          if (typeof $localStorage.filtroVerContrato.comisionSeleccionado != 'undefined' && $localStorage.filtroVerContrato.comisionSeleccionado !== null ){
             $scope.comisionSeleccionado = $scope.contratoOpcionesComision[$localStorage.filtroVerContrato.comisionSeleccionado];
          } else {
            $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
          }
      } else {
          $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      }
    } else if ((urlListar.indexOf("listar_remitos_ver") != -1)){
      //PARA VER REMITO
      if (typeof $localStorage.filtroVerRemito != 'undefined' && $localStorage.filtroVerRemito !== null){
          if (typeof $localStorage.filtroVerRemito.estadoSeleccionado != 'undefined' && $localStorage.filtroVerRemito.estadoSeleccionado !== null ){
             $scope.estadoSeleccionado =  $scope.contratoOpcionesEstados[$localStorage.filtroVerRemito.estadoSeleccionado];
          } else {
            $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
          }
      } else {
          $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      }

      if (typeof $localStorage.filtroVerRemito != 'undefined' && $localStorage.filtroVerRemito !== null){
          if (typeof $localStorage.filtroVerRemito.comisionSeleccionado != 'undefined' && $localStorage.filtroVerRemito.comisionSeleccionado !== null ){
             $scope.comisionSeleccionado = $scope.contratoOpcionesComision[$localStorage.filtroVerRemito.comisionSeleccionado];
          } else {
            $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
          }
      } else {
          $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      }
    } else if ((urlListar.indexOf("listar_contratos_modificar") != -1)){
      //PARA MODIFICAR CONTRATO
      if (typeof $localStorage.filtroModificarContrato != 'undefined' && $localStorage.filtroModificarContrato !== null){
          if (typeof $localStorage.filtroModificarContrato.estadoSeleccionado != 'undefined' && $localStorage.filtroModificarContrato.estadoSeleccionado !== null ){
             $scope.estadoSeleccionado =  $scope.contratoOpcionesEstados[$localStorage.filtroModificarContrato.estadoSeleccionado];
          } else {
            $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
          }
      } else {
          $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      }

      if (typeof $localStorage.filtroModificarContrato != 'undefined' && $localStorage.filtroModificarContrato !== null){
          if (typeof $localStorage.filtroModificarContrato.comisionSeleccionado != 'undefined' && $localStorage.filtroModificarContrato.comisionSeleccionado !== null ){
             $scope.comisionSeleccionado = $scope.contratoOpcionesComision[$localStorage.filtroModificarContrato.comisionSeleccionado];
          } else {
            $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
          }
      } else {
          $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      }
    } else if ((urlListar.indexOf("listar_remitos_modificar") != -1)){
      //PARA MODIFICAR REMITO
      if (typeof $localStorage.filtroModificarRemito != 'undefined' && $localStorage.filtroModificarRemito !== null){
          if (typeof $localStorage.filtroModificarRemito.estadoSeleccionado != 'undefined' && $localStorage.filtroModificarRemito.estadoSeleccionado !== null ){
             $scope.estadoSeleccionado =  $scope.contratoOpcionesEstados[$localStorage.filtroModificarRemito.estadoSeleccionado];
          } else {
            $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
          }
      } else {
          $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      }

      if (typeof $localStorage.filtroModificarRemito != 'undefined' && $localStorage.filtroModificarRemito !== null){
          if (typeof $localStorage.filtroModificarRemito.comisionSeleccionado != 'undefined' && $localStorage.filtroModificarRemito.comisionSeleccionado !== null ){
             $scope.comisionSeleccionado = $scope.contratoOpcionesComision[$localStorage.filtroModificarRemito.comisionSeleccionado];
          } else {
            $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
          }
      } else {
          $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      }
    } else if ((urlListar.indexOf("listar_contratos_generar") != -1)){
      //PARA GENERAR CONTRATO
      if (typeof $localStorage.filtroGenerarContrato != 'undefined' && $localStorage.filtroGenerarContrato !== null){
          if (typeof $localStorage.filtroGenerarContrato.estadoSeleccionado != 'undefined' && $localStorage.filtroGenerarContrato.estadoSeleccionado !== null ){
             $scope.estadoSeleccionado =  $scope.contratoOpcionesEstados[$localStorage.filtroGenerarContrato.estadoSeleccionado];
          } else {
            $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
          }
      } else {
          $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      }

      if (typeof $localStorage.filtroGenerarContrato != 'undefined' && $localStorage.filtroGenerarContrato !== null){
          if (typeof $localStorage.filtroGenerarContrato.comisionSeleccionado != 'undefined' && $localStorage.filtroGenerarContrato.comisionSeleccionado !== null ){
             $scope.comisionSeleccionado = $scope.contratoOpcionesComision[$localStorage.filtroGenerarContrato.comisionSeleccionado];
          } else {
            $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
          }
      } else {
          $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      }

      if (typeof $localStorage.filtroGenerarContrato != 'undefined' && $localStorage.filtroGenerarContrato !== null){
          if (typeof $localStorage.filtroGenerarContrato.departamento1Seleccionado != 'undefined' && $localStorage.filtroGenerarContrato.departamento1Seleccionado !== null ){
             $scope.departamento1Seleccionado = $scope.departamentosFiltrar[$localStorage.filtroGenerarContrato.departamento1Seleccionado];
          } else {
            $scope.departamento1Seleccionado = $scope.departamentosFiltrar[0];
          }
      } else {
          $scope.departamento1Seleccionado = $scope.departamentosFiltrar[0];
      }

      if (typeof $localStorage.filtroGenerarContrato != 'undefined' && $localStorage.filtroGenerarContrato !== null){
          if (typeof $localStorage.filtroGenerarContrato.departamento2Seleccionado != 'undefined' && $localStorage.filtroGenerarContrato.departamento2Seleccionado !== null ){
             $scope.departamento2Seleccionado = $scope.departamentosFiltrar[$localStorage.filtroGenerarContrato.departamento2Seleccionado];
          } else {
            $scope.departamento2Seleccionado = $scope.departamentosFiltrar[0];
          }
      } else {
          $scope.departamento2Seleccionado = $scope.departamentosFiltrar[0];
      }


      if (typeof $localStorage.filtroGenerarContrato != 'undefined' && $localStorage.filtroGenerarContrato !== null){
          if (typeof $localStorage.filtroGenerarContrato.fechaSeleccionado != 'undefined' && $localStorage.filtroGenerarContrato.fechaSeleccionado !== null ){
             $scope.fechaSeleccionado = new Date($localStorage.filtroGenerarContrato.fechaSeleccionado);
          } 
      }
    } else if ((urlListar.indexOf("listar_remitos_generar") != -1)){
      //PARA GENERAR REMITO
      if (typeof $localStorage.filtroGenerarRemito != 'undefined' && $localStorage.filtroGenerarRemito !== null){
          if (typeof $localStorage.filtroGenerarRemito.estadoSeleccionado != 'undefined' && $localStorage.filtroGenerarRemito.estadoSeleccionado !== null ){
             $scope.estadoSeleccionado =  $scope.contratoOpcionesEstados[$localStorage.filtroGenerarRemito.estadoSeleccionado];
          } else {
            $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
          }
      } else {
          $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      }

      if (typeof $localStorage.filtroGenerarRemito != 'undefined' && $localStorage.filtroGenerarRemito !== null){
          if (typeof $localStorage.filtroGenerarRemito.comisionSeleccionado != 'undefined' && $localStorage.filtroGenerarRemito.comisionSeleccionado !== null ){
             $scope.comisionSeleccionado = $scope.contratoOpcionesComision[$localStorage.filtroGenerarRemito.comisionSeleccionado];
          } else {
            $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
          }
      } else {
          $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      }

      if (typeof $localStorage.filtroGenerarRemito != 'undefined' && $localStorage.filtroGenerarRemito !== null){
          if (typeof $localStorage.filtroGenerarRemito.departamento1Seleccionado != 'undefined' && $localStorage.filtroGenerarRemito.departamento1Seleccionado !== null ){
             $scope.departamento1Seleccionado = $scope.departamentosFiltrar[$localStorage.filtroGenerarRemito.departamento1Seleccionado];
          } else {
            $scope.departamento1Seleccionado = $scope.departamentosFiltrar[0];
          }
      } else {
          $scope.departamento1Seleccionado = $scope.departamentosFiltrar[0];
      }

      if (typeof $localStorage.filtroGenerarRemito != 'undefined' && $localStorage.filtroGenerarRemito !== null){
          if (typeof $localStorage.filtroGenerarRemito.departamento2Seleccionado != 'undefined' && $localStorage.filtroGenerarRemito.departamento2Seleccionado !== null ){
             $scope.departamento2Seleccionado = $scope.departamentosFiltrar[$localStorage.filtroGenerarRemito.departamento2Seleccionado];
          } else {
            $scope.departamento2Seleccionado = $scope.departamentosFiltrar[0];
          }
      } else {
          $scope.departamento2Seleccionado = $scope.departamentosFiltrar[0];
      }

      if (typeof $localStorage.filtroGenerarRemito != 'undefined' && $localStorage.filtroGenerarRemito !== null){
          if (typeof $localStorage.filtroGenerarRemito.fechaSeleccionado != 'undefined' && $localStorage.filtroGenerarRemito.fechaSeleccionado !== null ){
             $scope.fechaSeleccionado = new Date($localStorage.filtroGenerarRemito.fechaSeleccionado);
          } 
      }
    }
        
    ngToast.settings.verticalPosition = 'bottom';
    ngToast.settings.horizontalPosition = 'right';
    ngToast.settings.maxNumber = 3;
     
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;


     $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
      $scope.language = "es";
    };
    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);
    
    $scope.checkRol = function(accion){
      return AuthService.checkRol(accion);
    }

    $scope.volver = function(){
      $window.history.back();
    }

    $scope.modificarContrato = function(){
      if (!$scope.contratoModificarForm.$invalid){
        if($scope.checkRol(4) || $localStorage.tokenData.username == $scope.contrato.usuario){
          if($scope.contrato.celular){
            var celular = $scope.contratoAux.celular;
            celular = "0" + celular;
            $scope.contrato.celular = celular;
          }

          if($scope.aplicaTarifaModificada === true)
            $scope.contrato.aplicaTarifa = 1;
          else
            $scope.contrato.aplicaTarifa = 0;

          if($scope.aplicaTarifaNuevoServicio === true)
            $scope.contrato.aplicaTarifaNuevoServicio = 1;
          else
            $scope.contrato.aplicaTarifaNuevoServicio = 0;


          console.log("MANDO PARA MODIFICAR " + JSON.stringify($scope.contrato));
          Contrato.modificarContrato($scope.idContratoBuscar, $scope.contrato)
            .then(
            function(res){
              $scope.pop();
              ngToast.success('Contrato modificado correctamente');
              //$state.go('dashboard.ContratoListarModificar');
              $window.history.back();
            },
            function(error){
                ngToast.danger('Error modificando contrato: ' + error.status + ', ' + error.statusText);            
            });
        } else {
          ngToast.danger('No tiene permisos para modificar este contrato'); 
        }
      } 
    }


    $scope.modificarRemito = function(accion){
      //if($scope.checkRol(4) || $localStorage.tokenData.username == $scope.contrato.usuario){
      console.log("MANDO PARA MODIFICAR " + JSON.stringify($scope.remito));
      Contrato.modificarRemito($scope.idContratoBuscar, $scope.remito)
        .then(
        function(res){
          $scope.pop();
          ngToast.success('Remito modificado correctamente');
          $window.history.back();
        },
        function(error){
            ngToast.danger('Error modificando remito: ' + error.status + ', ' + error.statusText);            
        });
      /*} else {
        ngToast.danger('No tiene permisos para modificar este remito'); 
      }*/
    }


    $scope.crearContrato = function(accion){
      var ok = true;

      if ($scope.contrato.tipoCi == 2){
        if ($scope.contrato.ciCliente > 999999999){
          $scope.errorLargoCiBra = true;
          $scope.errorLargoRUT = false;
          $scope.errorLargoCiUru = false;
          $scope.mostrarErrorForm = true;
          ok = false;
        }
        if (!$scope.contrato.genero){
          $scope.errorGeneroRequerido = true;
          ok = false;
        } else {
          $scope.errorGeneroRequerido = false;
        }
      } else if ($scope.contrato.tipoCi == 3) {
        if ($scope.contrato.ciCliente > 999999999999){
          $scope.errorLargoCiUru = false;
          $scope.errorLargoCiBra = false;
          $scope.errorLargoRUT = true;
          $scope.mostrarErrorForm = true;
          ok = false;
        }
      } else {
        if ($scope.contrato.ciCliente > 99999999){
          $scope.errorLargoCiUru = true;
          $scope.errorLargoRUT = false;
          $scope.errorLargoCiBra = false;
          $scope.mostrarErrorForm = true;
          ok = false;
        }
        if (!$scope.contrato.genero){
          $scope.errorGeneroRequerido = true;
          ok = false;
        } else {
          $scope.errorGeneroRequerido = false;
        }
      }

      if($scope.contratoAux.tipoTramite != "1")
        if(!$scope.contratoAux.plazo){
          $scope.errorFaltaPlazo = true;
          ok = false;
          $scope.mostrarErrorForm = true;
        }

      if(!$scope.contrato.departamento)
        $scope.contrato.departamento = "MONTEVIDEO";

      if (!$scope.contratoForm.$invalid && ok){
        if ($scope.mantenerDomicilioInstalacion){
          $scope.contrato.domicilio.localidad = $scope.contrato.localidad;
          $scope.contrato.domicilio.departamento = $scope.contrato.departamento;
          $scope.contrato.domicilio.calle = $scope.contrato.calle;
          $scope.contrato.domicilio.nroPuerta = $scope.contrato.nroPuerta;
          $scope.contrato.domicilio.apto = $scope.contrato.apto;
          $scope.contrato.domicilio.padron = $scope.contrato.padron;
          $scope.contrato.domicilio.solar = $scope.contrato.solar;
          $scope.contrato.domicilio.manzana = $scope.contrato.manzana;
        } else{
          if(!$scope.contrato.domicilio.departamento)
            $scope.contrato.domicilio.departamento = "MONTEVIDEO";
        }
        if ($scope.mantenerDomicilioFactura){
          $scope.contrato.factura.localidad = $scope.contrato.localidad;
          $scope.contrato.factura.departamento = $scope.contrato.departamento;
          $scope.contrato.factura.calle = $scope.contrato.calle;
          $scope.contrato.factura.nroPuerta = $scope.contrato.nroPuerta;
          $scope.contrato.factura.apto = $scope.contrato.apto;
          $scope.contrato.factura.padron = $scope.contrato.padron;
          $scope.contrato.factura.solar = $scope.contrato.solar;
          $scope.contrato.factura.manzana = $scope.contrato.manzana;
        }else{
          if(!$scope.contrato.factura.departamento)
            $scope.contrato.factura.departamento = "MONTEVIDEO";
        }
        if ($scope.mantenerDomicilioRemito){
          $scope.contrato.remito.localidad = $scope.contrato.localidad;
          $scope.contrato.remito.departamento = $scope.contrato.departamento;
          $scope.contrato.remito.calle = $scope.contrato.calle;
          $scope.contrato.remito.nroPuerta = $scope.contrato.nroPuerta;
          $scope.contrato.remito.apto = $scope.contrato.apto;
          $scope.contrato.remito.padron = $scope.contrato.padron;
          $scope.contrato.remito.solar = $scope.contrato.solar;
          $scope.contrato.remito.manzana = $scope.contrato.manzana;
        } else{
          if(!$scope.contrato.remito.departamento)
            $scope.contrato.remito.departamento = "MONTEVIDEO";
        }

        if($scope.aplicaTarifa)
          $scope.contrato.aplicaTarifa = 1;
        else
          $scope.contrato.aplicaTarifa = 0;

        if($scope.aplicaTarifaNuevoServicio)
          $scope.contrato.aplicaTarifaNuevoServicio = 1;
        else
          $scope.contrato.aplicaTarifaNuevoServicio = 0;

        $scope.contrato.remito.nombres= $scope.contrato.nombres;
        $scope.contrato.remito.apellidos= $scope.contrato.apellidos;
        $scope.contrato.remito.ciCliente= $scope.contrato.ciCliente;
        $scope.contrato.remito.telefonoFijo= $scope.contrato.telefonoFijo;
        $scope.contrato.remito.celular= $scope.contrato.celular;
        $scope.contrato.remito.email= $scope.contrato.email;
        
        $scope.contrato.fechaIngresado = new Date();
        $scope.contrato.usuario = $localStorage.tokenData.username;
        $scope.contrato.comision = 0;

        if($scope.contratoAux.celular){
          var celular = $scope.contratoAux.celular;
          celular = "0" + celular;
          $scope.contrato.celular = celular;
        }
        if ($scope.contratoAux.telefonoFijo){
          var telefonoFijo =  $scope.contratoAux.telefonoFijo;
          $scope.contrato.telefonoFijo = telefonoFijo.toString();
        }

        $scope.contrato.remito.nombres= $scope.contrato.nombres;
        $scope.contrato.remito.apellidos= $scope.contrato.apellidos;
        $scope.contrato.remito.ciCliente= $scope.contrato.ciCliente;
        $scope.contrato.remito.telefonoFijo= $scope.contrato.telefonoFijo;
        $scope.contrato.remito.celular= $scope.contrato.celular;
        $scope.contrato.remito.email= $scope.contrato.email;


        if ($scope.contratoAux.tipoTramite == 0){
            $scope.contrato1 = {};
            $scope.contrato2 = {};

            $scope.contrato1 = angular.copy($scope.contrato);
            $scope.contrato1.tipoTramite = "1";
            $scope.contrato1.plazo = "4";
            $scope.contrato1.servicio = $scope.contratoAux.servicioCambioAgente;
            $scope.dosContratos.contrato1 = $scope.contrato1;

            $scope.contrato2 = angular.copy($scope.contrato);
            $scope.contrato2.tipoTramite = "2";
            $scope.contrato2.plazo = $scope.contratoAux.plazo;
            $scope.contrato2.servicio = $scope.contratoAux.servicioCambioProducto;
            $scope.dosContratos.contrato2 = $scope.contrato2;

            Contrato.crearContratos($scope.dosContratos)
            .then(
            function(res){
              $scope.pop();
              ngToast.success('Contrato creado correctamente');
              $state.go('dashboard.ContratoListarVer');
            },
            function(error){
                ngToast.danger('Error creando contrato: ' + error.status + ', ' + error.statusText);            
            });

        } else {
            if ($scope.contratoAux.tipoTramite == 1){
              $scope.contrato.tipoTramite = 1;
              $scope.contrato.servicio=  $scope.contratoAux.servicioCambioAgente;
              $scope.contrato.plazo = 4;
            } else if ($scope.contratoAux.tipoTramite == 2){
              $scope.contrato.tipoTramite = 2;
              $scope.contrato.servicio=  $scope.contratoAux.servicioCambioProducto;
              $scope.contrato.plazo = $scope.contratoAux.plazo;
            } else if ($scope.contratoAux.tipoTramite == 3){
              $scope.contrato.tipoTramite = 3;
              $scope.contrato.servicio=  $scope.contratoAux.servicioCambioAgente;
              $scope.contrato.plazo = $scope.contratoAux.plazo;
            } else {
              $scope.contrato.tipoTramite = 4;
              $scope.contrato.servicio=  $scope.contratoAux.servicioCambioAgente;
              $scope.contrato.plazo = $scope.contratoAux.plazo;
            } 
            console.log(JSON.stringify($scope.contrato));
            Contrato.crearContrato($scope.contrato)
            .then(
            function(res){
              $scope.pop();
              ngToast.success('Contrato creado correctamente');
              $state.go('dashboard.ContratoListarVer');
            },
            function(error){
                ngToast.danger('Error creando contrato: ' + error.status + ', ' + error.statusText);
            });
        }
      }
    }
  

    $scope.buscarContrato = function(){ 
      $scope.myPromise = Contrato.getContrato($scope.idContratoBuscar)
        .then( function(res){
          $scope.contrato = res.data;
          $scope.contrato.domicilio = res.data.domicilioInstalacion;
          $scope.contrato.factura = res.data.envioFactura;
          $scope.estadosContratos = res.data.estados;
          $scope.historicoContrato = res.data.historico;

          if($scope.contrato.tipoTramite == 2 ){
            for(var i = 0; i< $scope.serviciosCambioProducto.length; i++){
              if($scope.serviciosCambioProducto[i].nombre == $scope.contrato.servicio)
                $scope.contrato.servicioNombre = $scope.serviciosCambioProducto[i].nombre;
            }
          } else {
            for(var i = 0; i< $scope.serviciosCambioAgente.length; i++){
              if($scope.serviciosCambioAgente[i].nombre == $scope.contrato.servicio)
                $scope.contrato.servicioNombre = $scope.serviciosCambioAgente[i].nombre;
            }
          }
          

          if($scope.contrato.aplicaTarifa == 1){
            $scope.aplicaTarifaModificada = true;
          } else {
            $scope.aplicaTarifaModificada = false;
          }

          if($scope.contrato.aplicaTarifaNuevoServicio == 1){
            $scope.aplicaTarifaNuevoServicio = true;
          } else {
            $scope.aplicaTarifaNuevoServicio = false;
          }

          $scope.mostrarActivo = false;

          var cantEstados = $scope.estadosContratos.length;
          for (var i = 0 ; i < cantEstados; i ++){
            if($scope.estadosContratos[i].estado == "ACTIVO" && !$scope.mostrarActivo){
              $scope.mostrarActivo = true;

              switch ($scope.estadosContratos[i].mesActivacion) {
                case "0": $scope.contratoAux.mesActivacion = "ENERO";
                          $scope.nuevoEstado.mesActivacion = 0;
                          break;
                case "1": $scope.contratoAux.mesActivacion = "FEBRERO";
                          $scope.nuevoEstado.mesActivacion = 1;
                          break;
                case "2": $scope.contratoAux.mesActivacion = "MARZO";
                          $scope.nuevoEstado.mesActivacion = 2;
                          break;
                case "3": $scope.contratoAux.mesActivacion = "ABRIL";
                          $scope.nuevoEstado.mesActivacion = 3;
                          break;
                case "4": $scope.contratoAux.mesActivacion = "MAYO";
                          $scope.nuevoEstado.mesActivacion = 4;
                          break;
                case "5": $scope.contratoAux.mesActivacion = "JUNIO";
                          $scope.nuevoEstado.mesActivacion = 5;
                          break;
                case "6": $scope.contratoAux.mesActivacion = "JULIO";
                          $scope.nuevoEstado.mesActivacion = 6;
                          break;
                case "7": $scope.contratoAux.mesActivacion = "AGOSTO";
                          $scope.nuevoEstado.mesActivacion = 7;
                          break;
                case "8": $scope.contratoAux.mesActivacion = "SETIEMBRE";
                          $scope.nuevoEstado.mesActivacion = 8;
                          break;
                case "9": $scope.contratoAux.mesActivacion = "OCTUBRE";
                          $scope.nuevoEstado.mesActivacion = 9;
                          break;
                case "10": $scope.contratoAux.mesActivacion = "NOVIEMBRE";
                          $scope.nuevoEstado.mesActivacion = 10;
                          break;
                case "11": $scope.contratoAux.mesActivacion = "DICIEMBRE";
                            $scope.nuevoEstado.mesActivacion = 11;
                            break;
              }
            }
            $scope.estadosContratos[i].fechaString = $filter('date')($scope.estadosContratos[i].fechaEstado, "dd/MM/yyyy HH:mm:ss");
          }

          var cantHistorico = $scope.historicoContrato.length;

          for (var i = 0 ; i < cantHistorico; i ++){
            $scope.historicoContrato[i].fechaString = $filter('date')($scope.historicoContrato[i].fecha, "dd/MM/yyyy HH:mm:ss");
            switch ($scope.historicoContrato[i].tipo){
              case 100:
                  $scope.historicoContrato[i].tipoString = "Contrato creado";
                  break;
              case 101:
                  $scope.historicoContrato[i].tipoString = "Contrato modificado";
                  break;
              case 102:
                  $scope.historicoContrato[i].tipoString = "Remito modificado";
                  break;
              case 103:
                  $scope.historicoContrato[i].tipoString = "Comisión modificada";
                  break;
              case 104:
                  $scope.historicoContrato[i].tipoString = "Estado contrato modificado";
                  break;
              case 105:
                  $scope.historicoContrato[i].tipoString = "Contrato generado";
                  break;
              case 106:
                  $scope.historicoContrato[i].tipoString = "Remito generado";
                  break;
              case 107:
                  $scope.historicoContrato[i].tipoString = "Número de contrato eliminado";
                  break;
              case 108:
                  $scope.historicoContrato[i].tipoString = "Contrato recoordinado";
                  break;
              case 109:
                  $scope.historicoContrato[i].tipoString = "Contrato cancelado";
                  break;
              case 110:
                  $scope.historicoContrato[i].tipoString = "Estado de contrato modificado masivamente";
                  break;
              case 111:
                  $scope.historicoContrato[i].tipoString = "Nuevo número de contrato asignado";
                  break;
            }
          }

          switch ($scope.contrato.tipoCi) {
            case 0:
                $scope.contrato.tipoCiString = "CI";
                break;
            case 1:
                $scope.contrato.tipoCiString = "Pasaporte";
                break;
            case 2:
                $scope.contrato.tipoCiString = "CI brasilera";
                break;
            case 3:
                $scope.contrato.tipoCiString = "RUT";
                break;
            }

          var urlBuscar = $location.url();

          if (urlBuscar.indexOf("modificar_contrato") != -1){
            
            var fecha = new Date($scope.contrato.fechaNacimiento);
            fecha.setDate(fecha.getDate() + 1);
            $scope.contrato.fechaNacimiento = fecha;


            switch ($scope.contrato.tipoTramite) {
              case 1:
                  $scope.contrato.tipoTramiteAux = "Cambio de agente";
                  break;
              case 2:
                  $scope.contrato.tipoTramiteAux = "Cambio de producto";
                  break;
              case 3:
                  $scope.contrato.tipoTramiteAux = "Cambio de titularidad";
                  break;
              case 4:
                  $scope.contrato.tipoTramiteAux = "Nuevo servicio";
                  break;
            }

            $scope.contrato.ciCliente = parseInt($scope.contrato.ciCliente);
            $scope.contratoAux.celular = parseInt($scope.contrato.celular);
            $scope.contrato.telefonoFijo = parseInt($scope.contrato.telefonoFijo);
            $scope.contrato.apto = parseInt($scope.contrato.apto);
            $scope.contrato.domicilioInstalacion.apto = parseInt($scope.contrato.domicilioInstalacion.apto);
            $scope.contrato.envioFactura.apto = parseInt($scope.contrato.envioFactura.apto);

          } else {

            var fecha = new Date($scope.contrato.fechaNacimiento);
            $scope.contrato.fechaNacimiento = $filter('date')($scope.contrato.fechaNacimiento, "dd/MM/yyyy");

            
            switch ($scope.contrato.genero) {
              case 1:
                  $scope.contrato.genero = "F";
                  break;
              case 2:
                  $scope.contrato.genero = "M";
                  break;
            }
            switch ($scope.contrato.tipoTramite) {
              case 1:
                  $scope.contrato.tipoTramiteString = "Cambio de agente";
                  break;
              case 2:
                  $scope.contrato.tipoTramiteString = "Cambio de producto";
                  break;
              case 3:
                  $scope.contrato.tipoTramiteString = "Cambio de titularidad";
                  break;
              case 4:
                  $scope.contrato.tipoTramiteString = "Nuevo servicio";
                  break;
            }
            switch ($scope.contrato.comision) {
              case 0:
                  $scope.contratoAux.comision = "No";
                  break;
              case 1:
                  $scope.contratoAux.comision = "Si";
                  break;
            }
            switch ($scope.contrato.plazo) {
              case 1:
                  $scope.contratoAux.plazo = "1 año";
                  break;
              case 2:
                  $scope.contratoAux.plazo = "2 años";
                  break;
              case 3:
                  $scope.contratoAux.plazo = "Mantiene vigencia plan actual";
                  break;
              case 4:
                  $scope.contratoAux.plazo = "Sin plazo contractual";
                  break;
            }


            $scope.estados = ["BORRADOR","FIRMADO", "RECHAZADO","ACTIVO", "CANCELADO", "PARA RECOORDINAR"];
            
            if($scope.contrato.estado == "PARA_RECOORDINAR"){
              $scope.contrato.estado = "PARA RECOORDINAR";
            }

            if ($scope.estados.indexOf($scope.contrato.estado) != -1) {
               $scope.estados.splice($scope.estados.indexOf($scope.contrato.estado),1);
            }
          }
          
          console.log("Contrato buscar successfully: " + JSON.stringify(res));
        },
        function(error){
          console.log("Contrato error : " + JSON.stringify(error));
        });
     
    }

    $scope.buscarRemito = function(){ 
      $scope.myPromise = Contrato.getRemito($scope.idContratoBuscar)
        .then( function(res){

          //para que se vea bien en el ver remito
          $scope.remito = res.data;
          $scope.remito.fechaVisitaString = $filter('date')($scope.remito.fechaVisita, "dd/MM/yyyy") ;

          switch ($scope.remito.cuando) {
            case 1:
                $scope.remito.cuandoString = "A partir de";
                break;
            case 2:
                $scope.remito.cuandoString = "Entre";
                break;
            case 3:
                $scope.remitocuandoString = "Hasta";
                break;
          }

          //para que se vea bien en el modificar remito
          var fecha = new Date($scope.remito.fechaVisita);
          $scope.remito.fechaVisita = fecha;


          console.log("Remito buscar successfully: " + JSON.stringify(res));
        },
        function(error){
          console.log("Remito error : " + JSON.stringify(error));
        });
     
    }


    $scope.openBorrarContratoModal = function (idContrato) {
      if ($scope.checkRol(5)){ 
        var body = 'Seguro desea eliminar el contrato?';
        var title = 'Eliminar contrato';
        var modalInstance = $modal.open({
          templateUrl: 'views/contratos/borrarContratoModal.html',
          controller: 'ContratoEliminarModalCtrl',
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
            Contrato.delete(idContrato)
            .then(function(res){
              ngToast.success('Contrato borrado correctamente');
              $scope.reloadDataModificar();
            });  
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      } else {
        ngToast.danger('No tiene permisos para eliminar un contrato. Debe tener rol Administrador'); 
      }
    };

    $scope.asignarNuevoNumeroContratoModal = function (idContrato) {
      if ($scope.checkRol(4)){ 
        var body = '';
        var title = 'Asignar nuevo número de contrato';
        var modalInstance = $modal.open({
          templateUrl: 'views/contratos/asignarNuevoNumeroContratoModal.html',
          controller: 'ContratoAsignarNuevoNumeroModalCtrl',
          resolve: {
              obtenerTitulo: function () {
                return title;
              },
              obtenerBody: function () {
                return body;
              },
              nuevoNumero: function(){
                return $scope.nuevoNum;
              }

            }
        });
        modalInstance.result.then(function (nuevoNum) {
            Contrato.asignarNuevoNumeroContrato(idContrato,nuevoNum)
            .then(function(res){
              ngToast.success('Nuevo número de contrato asignado correctamente');
              $scope.reloadDataModificar();
            });  
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      } else {
        ngToast.danger('No tiene permisos para asignar un nuevo número de contrato. Debe tener rol Supervisor o Administrador'); 
      }
    };

    $scope.exportarBaseRemitosModal = function(){
    if ($scope.checkRol(5)){ 
        var body = '';
        var title = 'Exportar base de remitos';
        var modalInstance = $modal.open({
          templateUrl: 'views/contratos/exportarRemitosModal.html',
          controller: 'ExportarRemitoModalCtrl',
          resolve: {
             fechasFiltro: function () {
              return $scope.fechasFiltro;
              },
              obtenerTitulo: function () {
                return title;
              },
              obtenerBody: function () {
                return body;
              }
            }
        });
        modalInstance.result.then(function (fechasFiltro) {
          $scope.exportarBaseRemitos(fechasFiltro);
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      } else {
        ngToast.danger('No tiene permisos para exportar la base de remitos. Debe tener rol Administrador'); 
      }
    };


    $scope.openModificarUsuarioIngresoContratoModal = function(idContrato){
      if ($scope.checkRol(5)){ 
        var body = '';
        var title = 'Modificar usuario ingreso contrato';
        var modalInstance = $modal.open({
          templateUrl: 'views/contratos/modificarUsuarioIngresoContratoModal.html',
          controller: 'ModificarUsuarioIngresoContratoModalCtrl',
          resolve: {
             numContratoIngresado: function () {
              return $scope.usuario;
              },
              obtenerTitulo: function () {
                return title;
              },
              obtenerBody: function () {
                return body;
              }
            }
        });
        modalInstance.result.then(function (usuario) {
          Contrato.modificarUsuarioIngresoContrato(idContrato,usuario)
          .then(
            function(res){
              $scope.pop();
              ngToast.success('Modificación realizada correctamente');
              $scope.reloadDataModificar();
              $state.go('dashboard.ContratoListarModificar');     
            },
            function(error){
              console.log("Modificar usuario ingreso error : " + JSON.stringify(error));
            });

            
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      } else {
        ngToast.danger('No tiene permisos para generar un contrato. Debe tener rol Administrador.'); 
      }
    }





    

    $scope.openGenerarContratoModal = function (idContrato,tipoTramite,estado) {
      if ($scope.checkRol(4)){ 
        var body = '';
        var title = 'Generar contrato';
        var tramite = tipoTramite;
        var modalInstance = $modal.open({
          templateUrl: 'views/contratos/generarContratoModal.html',
          controller: 'ContratoModalCtrl',
          resolve: {
             numContratoIngresado: function () {
              return $scope.datosContrato;
              },
              obtenerTitulo: function () {
                return title;
              },
              obtenerBody: function () {
                return body;
              },
              tipoTramite: function () {
                return tramite;
              },
              estado: function () {
                return estado;
              }
            }
        });
        modalInstance.result.then(function (datosContrato) {
          $scope.generarContrato(idContrato,datosContrato,datosContrato.generarRemitoAsociado);
            
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      } else {
        ngToast.danger('No tiene permisos para generar un contrato. Debe tener rol Administrador o Supervisor'); 
      }
    };

    $scope.modificarEstadoContrato = function(){
      if($scope.checkRol(3)){
        $scope.nuevoEstado.comision = $scope.contrato.comision;
        if(!$scope.nuevoEstado.estado){
          $scope.nuevoEstado.estado = $scope.contrato.estado;
        } else {
          if($scope.nuevoEstado.estado == "PARA RECOORDINAR"){
            $scope.nuevoEstado.estado = "PARA_RECOORDINAR";
          }
        }
        if($scope.nuevoEstado.estado == "ACTIVO"){
          if(!$scope.nuevoEstado.mesActivacion){
            $scope.nuevoEstado.mesActivacion = "ENERO";
          }
        }
        console.log("MANDO ESTADO NUEVO " + JSON.stringify($scope.nuevoEstado));
        Contrato.modificarEstadoContrato($scope.idContratoBuscar, $scope.nuevoEstado)
          .then(
          function(res){
            $scope.pop();
            ngToast.success('Estado modificado correctamente');
            $state.go('dashboard.ContratoListarModificar');
          },
          function(error){
              ngToast.danger('Error modificando estado: ' + error.status + ', ' + error.statusText);            
          });
      } else {
        ngToast.danger('No tiene permisos para modificar el estado de un contrato');
      }
  }


  $scope.recoordinarContrato = function(recoordinado){
    $scope.contratoRecoordinado = {};
    $scope.contratoRecoordinado.remito = $scope.remito;
    $scope.contratoRecoordinado.recoordinado = recoordinado;
    Contrato.recoordinarContrato($scope.idContratoBuscar,$scope.contratoRecoordinado)
    .then(
      function(res){
        $scope.pop();
        ngToast.success('Contrato recoordinado correctamente');
        $state.go('dashboard.ContratoListarRecoordinar');     
      },
      function(error){
        //$mdToast.show($mdToast.simple().content(JSON.stringify(error.data)));
        console.log("obtenerServicios error : " + JSON.stringify(error));
      });
  }




  $scope.obtenerServicios = function(){ 
     
    Contrato.obtenerServicios()
      .then(
      function(res){
        $scope.serviciosCambioAgente = res.data;  
        $scope.serviciosCambioProducto = [];

        for(var i = 0; i< $scope.serviciosCambioAgente.length; i++){
          if($scope.serviciosCambioAgente[i].cambioDeProducto == 1){
            $scope.serviciosCambioProducto.push($scope.serviciosCambioAgente[i]);
          }
        }

        console.log("obtenerServiciosCambioAgente: " + JSON.stringify($scope.serviciosCambioAgente));    
        console.log("obtenerServiciosCambioProducto: " + JSON.stringify($scope.serviciosCambioProducto));       
      },
      function(error){
        //$mdToast.show($mdToast.simple().content(JSON.stringify(error.data)));
        console.log("obtenerServicios error : " + JSON.stringify(error));
      });
  }    

  
  $scope.obtenerServicios();

  $scope.obtenerCambiosMasivosCargados = function(){
    if($scope.checkRol(4)){
    $scope.myPromise = Contrato.obtenerCambiosMasivosCargados()
        .then( function(res){
          $scope.cambiosMasivos = res.data;
          console.log(JSON.stringify($scope.cambiosMasivos));
          for(var i = 0; i< $scope.cambiosMasivos.length; i++){
            if($scope.cambiosMasivos[i].estado){
              $scope.cambiosMasivos[i].aplicarCambio = true;
              $scope.cambiosMasivos[i].error = false;
              if($scope.cambiosMasivos[i].estado.comision == 0)
                $scope.cambiosMasivos[i].estado.comisionString = "No";
              else if($scope.cambiosMasivos[i].estado.comision == 1)
                $scope.cambiosMasivos[i].estado.comisionString = "Si";
              else
                $scope.cambiosMasivos[i].estado.comision = null;
            } else {
              $scope.cambiosMasivos[i].aplicarCambio = false;
              $scope.cambiosMasivos[i].error = true;
            }
          }          

          },
        function(error){
          console.log("Remito error : " + JSON.stringify(error));
        });
    } else {
      ngToast.danger('No tiene permisos para realizar esta acción. Debe tener rol Supervisor o Administrador'); 
    }
  }

  $scope.confirmarCambiosMasivoCargados = function(){
    if($scope.checkRol(4)){
      $scope.cambiosConfirmados = [];
      for(var i = 0; i< $scope.cambiosMasivos.length; i++){
        if($scope.cambiosMasivos[i].aplicarCambio){
          $scope.cambiosConfirmados.cambio = {};
          $scope.cambiosConfirmados.cambio.id = $scope.cambiosMasivos[i].id;
          $scope.cambiosConfirmados.cambio.estado = $scope.cambiosMasivos[i].estado.estado;
          $scope.cambiosConfirmados.cambio.comision = $scope.cambiosMasivos[i].estado.comision;
          if($scope.cambiosConfirmados.cambio.comision == null){
            $scope.cambiosConfirmados.cambio.comision = -1;
          }
          $scope.cambiosConfirmados.push($scope.cambiosConfirmados.cambio);
        }
      }
      console.log("MANDO CAMBIOS:" + JSON.stringify($scope.cambiosConfirmados));
      Contrato.confirmarCambiosMasivoCargados($scope.cambiosConfirmados)
      .then(
      function(res){

        
        $scope.pop();
        ngToast.success('Cambios masivos de estados aplicados correctamente');
        $state.go('dashboard.ContratoListarModificar');
      },
      function(error){
          ngToast.danger('Error modificando contrato: ' + error.status + ', ' + error.statusText);            
      });
    } else {
     ngToast.danger('No tiene permisos para realizar esta acción. Debe tener rol Supervisor o Administrador');  
    }

  }




    if ($stateParams.idContrato) {
        $scope.idContratoBuscar = parseInt($stateParams.idContrato);
    }

    var url = $location.url();
    if( $stateParams.idContrato !== undefined && $stateParams.idContrato !== '' ) {
      if ((url.indexOf("ver_remito") != -1) || (url.indexOf("modificar_remito") != -1) || (url.indexOf("generar_remito") != -1) || (url.indexOf("recoordinar_contrato") != -1)) {
        $scope.buscarRemito();
      } else {
        $scope.buscarContrato();
      }
    }

    if(url.indexOf("cambio_masivo_estados") != -1){
      $scope.obtenerCambiosMasivosCargados();
    }

    
    $scope.contratoFiltroEstado = function() {
      
      $scope.dtInstance.DataTable.column( 6 ).search(
          $scope.estadoSeleccionado.text
      ).draw();
    }

    $scope.contratoFiltroComision = function() {
      
      $scope.dtInstance.DataTable.column( 5 ).search(
          $scope.comisionSeleccionado.nombre
      ).draw();
    }


    $scope.contratoFiltroFechaRemito = function() {

      if(angular.isDate($scope.fechaSeleccionado)){
        var fecha = $filter('date')($scope.fechaSeleccionado, "dd/MM/yyyy");
        var regEx = /^\d{2}-\d{2}-\d{4}$/;
        if($scope.fechaSeleccionado.getFullYear() > 2000)
          $scope.contratoFiltroComision();
      }
    }

    $scope.restablecerFiltrosVerContrato = function() {
      $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      $localStorage.filtroVerContrato = null;
      $scope.contratoFiltroEstado();
    }

    $scope.restablecerFiltrosGenerarContrato = function(){
      $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      $scope.departamento1Seleccionado = $scope.departamentosFiltrar[0];
      $scope.departamento2Seleccionado = $scope.departamentosFiltrar[0];
      $scope.fechaSeleccionado = null;
      $localStorage.filtroGenerarContrato = null;
      $scope.contratoFiltroEstado();
    }

    $scope.restablecerFiltrosGenerarRemito = function(){
      $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      $scope.departamento1Seleccionado = $scope.departamentosFiltrar[0];
      $scope.departamento2Seleccionado = $scope.departamentosFiltrar[0];
      $scope.fechaSeleccionado = null;
      $localStorage.filtroGenerarRemito = null;
      $scope.contratoFiltroEstado();
    }


    $scope.restablecerFiltrosVerRemito = function() {
      $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      $localStorage.filtroVerRemito = null;
      $scope.contratoFiltroEstado();
    }

    $scope.restablecerFiltrosModificarContrato = function() {
      $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      $localStorage.filtroModificarContrato = null;
      $scope.contratoFiltroEstado();
    }

    $scope.restablecerFiltrosModificarRemito = function() {
      $scope.estadoSeleccionado = $scope.contratoOpcionesEstados[0];
      $scope.comisionSeleccionado = $scope.contratoOpcionesComision[0];
      $localStorage.filtroModificarRemito = null;
      $scope.contratoFiltroEstado();
    }


    $scope.dtColumnsVer = [
            DTColumnBuilder.newColumn('id').withTitle('Id').notSortable(),
            DTColumnBuilder.newColumn('usuario').withTitle('Usuario').notSortable(),
            DTColumnBuilder.newColumn('nroContrato').withTitle('Numero de contrato').notSortable(),
            DTColumnBuilder.newColumn('tipoTramite').withTitle('Tipo de tramite').notSortable(),
            DTColumnBuilder.newColumn('ciCliente').withTitle('Cédula').notSortable(),
            DTColumnBuilder.newColumn('nombres').withTitle('Nombres').notSortable(),
            DTColumnBuilder.newColumn('apellidos').withTitle('Apellidos').notSortable(),
            DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable(),
            DTColumnBuilder.newColumn('fechaHora').withTitle('Fecha y Hora').notSortable(),
            DTColumnBuilder.newColumn('comision').withTitle('Comision').notSortable(),

            DTColumnBuilder.newColumn(null).withTitle('Acción').notSortable()
            .renderWith(function(data, type, full, meta) {
                if($scope.checkRol(4)){
                  return  '<a ng-click="verContratoClicked(' + data.id + ')">' +
                        "Ver Contrato | " + '</a><br>' + 
                          '<a ng-click="EstadosContratosVerClicked(' + data.id + ')">' +
                          "Ver estados del contrato | " + '</a><br>' + 
                          '<a ng-click="HistoricoContratoVerClicked(' + data.id + ')">' +
                          "Ver historico del contrato " + '</a>'
                } else {
                return  '<a ng-click="verContratoClicked(' + data.id + ')">' +
                        "Ver Contrato | " + '</a><br>' + 
                          '<a ng-click="EstadosContratosVerClicked(' + data.id + ')">' +
                          "Ver estados del contrato" + '</a>'
                }
            })
            //DTColumnBuilder.newColumn('remision').withTitle('Remision')
          ];

    $scope.dtColumnsVerRemito = [
            DTColumnBuilder.newColumn('id').withTitle('Id').notSortable(),
            DTColumnBuilder.newColumn('usuario').withTitle('Usuario').notSortable(),
            DTColumnBuilder.newColumn('nroContrato').withTitle('Numero de contrato').notSortable(),
            DTColumnBuilder.newColumn('tipoTramite').withTitle('Tipo de tramite').notSortable(),
            DTColumnBuilder.newColumn('ciCliente').withTitle('Cédula').notSortable(),
            DTColumnBuilder.newColumn('nombres').withTitle('Nombres').notSortable(),
            DTColumnBuilder.newColumn('apellidos').withTitle('Apellidos').notSortable(),
            DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable(),
            DTColumnBuilder.newColumn('fechaHora').withTitle('Fecha y Hora').notSortable(),
            DTColumnBuilder.newColumn('comision').withTitle('Comision').notSortable(),

            DTColumnBuilder.newColumn(null).withTitle('Acción').notSortable()
            .renderWith(function(data, type, full, meta) {
                return  '<a ng-click="verRemitoClicked(' + data.id + ')">' +
                        "Ver Remito" + '</a>'
            })
            //DTColumnBuilder.newColumn('remision').withTitle('Remision')
    ];

    $scope.dtColumnsRecoordinar = [
            DTColumnBuilder.newColumn('id').withTitle('Id').notSortable(),
            DTColumnBuilder.newColumn('usuario').withTitle('Usuario').notSortable(),
            DTColumnBuilder.newColumn('nroContrato').withTitle('Numero de contrato').notSortable(),
            DTColumnBuilder.newColumn('tipoTramite').withTitle('Tipo de tramite').notSortable(),
            DTColumnBuilder.newColumn('ciCliente').withTitle('Cédula').notSortable(),
            DTColumnBuilder.newColumn('nombres').withTitle('Nombres').notSortable(),
            DTColumnBuilder.newColumn('apellidos').withTitle('Apellidos').notSortable(),
            DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable(),
            DTColumnBuilder.newColumn('fechaHora').withTitle('Fecha y Hora').notSortable(),
            DTColumnBuilder.newColumn('comision').withTitle('Comision').notSortable(),

            DTColumnBuilder.newColumn(null).withTitle('Acción').notSortable()
            .renderWith(function(data, type, full, meta) {
                return  '<a ng-click="recoordinarContratoClicked(' + data.id + ')">' +
                        "Recoordinar Contrato" + '</a>'
            })
            //DTColumnBuilder.newColumn('remision').withTitle('Remision')
    ];

    $scope.dtColumnsModificar = [
            DTColumnBuilder.newColumn('id').withTitle('Id').notSortable(),
            DTColumnBuilder.newColumn('usuario').withTitle('Usuario').notSortable(),
            DTColumnBuilder.newColumn('nroContrato').withTitle('Numero de contrato').notSortable(),
            DTColumnBuilder.newColumn('tipoTramite').withTitle('Tipo de tramite').notSortable(),
            DTColumnBuilder.newColumn('ciCliente').withTitle('Cédula').notSortable(),
            DTColumnBuilder.newColumn('nombres').withTitle('Nombres').notSortable(),
            DTColumnBuilder.newColumn('apellidos').withTitle('Apellidos').notSortable(),
            DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable(),
            DTColumnBuilder.newColumn('fechaHora').withTitle('Fecha y Hora').notSortable(),
            DTColumnBuilder.newColumn('comision').withTitle('Comision').notSortable(),

            DTColumnBuilder.newColumn(null).withTitle('Acción').notSortable()
            .renderWith(function(data, type, full, meta) {
                if($scope.checkRol(5)){
                  if((data.estado == "GENERADO") && (data.nroContrato == "")){
                    return  '<a ng-click="ModificarContratoClicked(' + data.id + ')">' +
                        "Modificar Contrato | " + '</a><br>' + '<a ng-click="AsignarNuevoContratoClicked(' + data.id + ')">' +
                          "Asignar nuevo número de contrato | " + '</a><br>' + 
                          '<a ng-click="ModificarEstadoContratoClicked(' + data.id + ')">' +
                          "Modificar Estado Contrato | " + '</a><br>' + 
                          '<a ng-click="EliminarContratoClicked(' + data.id + ')">' +
                          "Eliminar Contrato | " + '</a><br>' + 
                          '<a ng-click="ModificarUsuarioIngresoContratoClicked(' + data.id + ')">' +
                          "Modificar usuario ingreso contrato" + '</a>'
                  } else {
                    return  '<a ng-click="ModificarContratoClicked(' + data.id + ')">' +
                        "Modificar Contrato | " + '</a><br>' + 
                          '<a ng-click="ModificarEstadoContratoClicked(' + data.id + ')">' +
                          "Modificar Estado Contrato | " + '</a><br>' + 
                          '<a ng-click="EliminarContratoClicked(' + data.id + ')">' +
                          "Eliminar Contrato | " + '</a><br>' + 
                          '<a ng-click="ModificarUsuarioIngresoContratoClicked(' + data.id + ')">' +
                          "Modificar usuario ingreso contrato" + '</a>'
                  } 
                } else if ($scope.checkRol(3)){
                  if((data.estado == "GENERADO") && (data.nroContrato == "")){
                    return  '<a ng-click="ModificarContratoClicked(' + data.id + ')">' +
                        "Modificar Contrato | " + '</a><br>' + '<a ng-click="AsignarNuevoContratoClicked(' + data.id + ')">' +
                        "Asignar nuevo número de contrato | " + '</a><br>' + '<a ng-click="ModificarEstadoContratoClicked(' + data.id + ')">' +
                          "Modificar Estado Contrato" + '</a>' 
                  } else {
                    return  '<a ng-click="ModificarContratoClicked(' + data.id + ')">' +
                        "Modificar Contrato | " + '</a><br>' + 
                          '<a ng-click="ModificarEstadoContratoClicked(' + data.id + ')">' +
                          "Modificar Estado Contrato" + '</a>' 
                    }
                } else {
                  return  '<a ng-click="ModificarContratoClicked(' + data.id + ')">' +
                        "Modificar Contrato" + '</a>' 
                }

            })
            //DTColumnBuilder.newColumn('remision').withTitle('Remision')
          ];

    $scope.dtColumnsGenerar = [
            DTColumnBuilder.newColumn('id').withTitle('Id').notSortable(),
            DTColumnBuilder.newColumn('usuario').withTitle('Usuario').notSortable(),
            DTColumnBuilder.newColumn('nroContrato').withTitle('Numero de contrato').notSortable(),
            DTColumnBuilder.newColumn('tipoTramite').withTitle('Tipo de tramite').notSortable(),
            DTColumnBuilder.newColumn('ciCliente').withTitle('Cédula').notSortable(),
            DTColumnBuilder.newColumn('nombres').withTitle('Nombres').notSortable(),
            DTColumnBuilder.newColumn('apellidos').withTitle('Apellidos').notSortable(),
            DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable(),
            DTColumnBuilder.newColumn('fechaHora').withTitle('Fecha y Hora').notSortable(),
            DTColumnBuilder.newColumn('comision').withTitle('Comision').notSortable(),

            DTColumnBuilder.newColumn(null).withTitle('Acción').notSortable()
            .renderWith(function(data, type, full, meta) {
                  var partes = data.tipoTramite;
                  var tramite = partes.split(' ')[2];
                  
                  if (tramite == 'producto'){
                    tramite = 0;
                   } else {
                    tramite = 1;
                  }

                  var estado;
                  if (data.estado == 'BORRADOR'){
                      estado = 1;
                  } else {
                    estado = 0;
                  }

                  return  '<a ng-click="GenerarContratoClicked(' + tramite + ',' + data.id + ',' + estado + ')">' +
                        "Generar Contrato | " + '</a><br>' + 
                          '<a ng-click="ModificarContratoClicked(' + data.id + ')">' +
                          "Modificar Contrato" +  '</a>'

            })
            //DTColumnBuilder.newColumn('remision').withTitle('Remision')
    ];

    $scope.dtColumnsModificarRemito = [
            DTColumnBuilder.newColumn('id').withTitle('Id').notSortable(),
            DTColumnBuilder.newColumn('usuario').withTitle('Usuario').notSortable(),
            DTColumnBuilder.newColumn('nroContrato').withTitle('Numero de contrato').notSortable(),
            DTColumnBuilder.newColumn('tipoTramite').withTitle('Tipo de tramite').notSortable(),
            DTColumnBuilder.newColumn('ciCliente').withTitle('Cédula').notSortable(),
            DTColumnBuilder.newColumn('nombres').withTitle('Nombres').notSortable(),
            DTColumnBuilder.newColumn('apellidos').withTitle('Apellidos').notSortable(),
            DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable(),
            DTColumnBuilder.newColumn('fechaHora').withTitle('Fecha y Hora').notSortable(),
            DTColumnBuilder.newColumn('comision').withTitle('Comision').notSortable(),

            DTColumnBuilder.newColumn(null).withTitle('Acción').notSortable()
            .renderWith(function(data, type, full, meta) {
                return  '<a ng-click="ModificarRemitoClicked(' + data.id + ')">' +
                        "Modificar Remito " + '</a>'
            })
            //DTColumnBuilder.newColumn('remision').withTitle('Remision')
          ];

    $scope.dtColumnsGenerarRemito = [
            DTColumnBuilder.newColumn('id').withTitle('Id').notSortable(),
            DTColumnBuilder.newColumn('usuario').withTitle('Usuario').notSortable(),
            DTColumnBuilder.newColumn('nroContrato').withTitle('Numero de contrato').notSortable(),
            DTColumnBuilder.newColumn('tipoTramite').withTitle('Tipo de tramite').notSortable(),
            DTColumnBuilder.newColumn('ciCliente').withTitle('Cédula').notSortable(),
            DTColumnBuilder.newColumn('nombres').withTitle('Nombres').notSortable(),
            DTColumnBuilder.newColumn('apellidos').withTitle('Apellidos').notSortable(),
            DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable(),
            DTColumnBuilder.newColumn('fechaHora').withTitle('Fecha y Hora').notSortable(),
            DTColumnBuilder.newColumn('comision').withTitle('Comision').notSortable(),

            DTColumnBuilder.newColumn(null).withTitle('Acción').notSortable()
            .renderWith(function(data, type, full, meta) {
                return  '<a ng-click="GenerarRemitoClicked(' + data.id + ')">' +
                        "Generar Remito | " + '</a><br>' +'<a ng-click="ModificarRemitoClicked(' + data.id + ')">' +
                        "Modificar Remito " + '</a>'
            })
            //DTColumnBuilder.newColumn('remision').withTitle('Remision')
      ];

    $scope.verContratoClicked = function(id){
      $localStorage.filtroVerContrato = {};
      $localStorage.filtroVerContrato.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
      $localStorage.filtroVerContrato.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      $state.go('dashboard.ContratoVer', {idContrato:id}, {reload:true});
    }

    $scope.recoordinarContratoClicked = function(id){
      $state.go('dashboard.ContratoRecoordinar', {idContrato:id}, {reload:true});
    }

    $scope.ModificarRemitoClicked = function(id){
      var url = $location.url();
      if ((urlListar.indexOf("listar_remitos_modificar") != -1)){
        $localStorage.filtroModificarRemito = {};
        $localStorage.filtroModificarRemito.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
        $localStorage.filtroModificarRemito.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      } else {
        $localStorage.filtroGenerarRemito = {};
        $localStorage.filtroGenerarRemito.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
        $localStorage.filtroGenerarRemito.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
        $localStorage.filtroGenerarRemito.fechaSeleccionado = $scope.fechaSeleccionado;
        $localStorage.filtroGenerarRemito.departamento1Seleccionado = $scope.departamentosFiltrar.indexOf($scope.departamento1Seleccionado);
        $localStorage.filtroGenerarRemito.departamento2Seleccionado = $scope.departamentosFiltrar.indexOf($scope.departamento2Seleccionado);
      }
      $state.go('dashboard.RemitoModificar', {idContrato:id}, {reload:true});
    }

    $scope.ModificarEstadoContratoClicked = function(id){
      $localStorage.filtroModificarContrato = {};
      $localStorage.filtroModificarContrato.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
      $localStorage.filtroModificarContrato.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      $state.go('dashboard.ContratoEstadoModificar', {idContrato:id}, {reload:true});
    }

    $scope.ModificarContratoClicked = function(id){
      var url = $location.url();
      if ((urlListar.indexOf("listar_contratos_modificar") != -1)){
        $localStorage.filtroModificarContrato = {};
        $localStorage.filtroModificarContrato.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
        $localStorage.filtroModificarContrato.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      } else if ((urlListar.indexOf("listar_contratos_generar") != -1)){
        $localStorage.filtroGenerarContrato = {};
        $localStorage.filtroGenerarContrato.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
        $localStorage.filtroGenerarContrato.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
        $localStorage.filtroGenerarContrato.fechaSeleccionado = $scope.fechaSeleccionado
        $localStorage.filtroGenerarContrato.departamento1Seleccionado = $scope.departamentosFiltrar.indexOf($scope.departamento1Seleccionado);
        $localStorage.filtroGenerarContrato.departamento2Seleccionado = $scope.departamentosFiltrar.indexOf($scope.departamento2Seleccionado);
      }

     $state.go('dashboard.ContratoModificar', {idContrato:id}, {reload:true});
    }

    $scope.verRemitoClicked = function(id){
      $localStorage.filtroVerRemito = {};
      $localStorage.filtroVerRemito.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
      $localStorage.filtroVerRemito.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      $state.go('dashboard.RemitoVer', {idContrato:id}, {reload:true});
    }

    $scope.EstadosContratosVerClicked = function(id){
      $localStorage.filtroVerContrato = {};
      $localStorage.filtroVerContrato.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
      $localStorage.filtroVerContrato.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      $state.go('dashboard.EstadosContratosVer', {idContrato:id}, {reload:true});
    }

    $scope.EliminarContratoClicked = function (id) {
      $localStorage.filtroModificarContrato = {};
      $localStorage.filtroModificarContrato.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
      $localStorage.filtroModificarContrato.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      $scope.openBorrarContratoModal(id);
    }

    $scope.ModificarUsuarioIngresoContratoClicked = function (id){
      $localStorage.filtroModificarContrato = {};
      $localStorage.filtroModificarContrato.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
      $localStorage.filtroModificarContrato.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      $scope.openModificarUsuarioIngresoContratoModal(id);
    }

    $scope.AsignarNuevoContratoClicked = function(id){
      $localStorage.filtroModificarContrato = {};
      $localStorage.filtroModificarContrato.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
      $localStorage.filtroModificarContrato.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      $scope.asignarNuevoNumeroContratoModal(id);
    }

    $scope.GenerarContratoClicked = function (tipoTramite, id, estado){
      $localStorage.filtroGenerarContrato = {};
      $localStorage.filtroGenerarContrato.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
      $localStorage.filtroGenerarContrato.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      $localStorage.filtroGenerarContrato.fechaSeleccionado = $scope.fechaSeleccionado;
      $localStorage.filtroGenerarContrato.departamento1Seleccionado = $scope.departamentosFiltrar.indexOf($scope.departamento1Seleccionado);
      $localStorage.filtroGenerarContrato.departamento2Seleccionado = $scope.departamentosFiltrar.indexOf($scope.departamento2Seleccionado);
      $scope.openGenerarContratoModal(id, tipoTramite, estado);
    }

    $scope.HistoricoContratoVerClicked = function (id){
      $localStorage.filtroVerContrato = {};
      $localStorage.filtroVerContrato.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
      $localStorage.filtroVerContrato.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      $state.go('dashboard.ContratoHistorico', {idContrato:id}, {reload:true});
    }

    $scope.GenerarRemitoClicked = function (id){
      $localStorage.filtroGenerarRemito = {};
      $localStorage.filtroGenerarRemito.estadoSeleccionado = $scope.contratoOpcionesEstados.indexOf($scope.estadoSeleccionado);
      $localStorage.filtroGenerarRemito.comisionSeleccionado = $scope.contratoOpcionesComision.indexOf($scope.comisionSeleccionado);
      $localStorage.filtroGenerarRemito.fechaSeleccionado = $scope.fechaSeleccionado;
      $localStorage.filtroGenerarRemito.departamento1Seleccionado = $scope.departamentosFiltrar.indexOf($scope.departamento1Seleccionado);
      $localStorage.filtroGenerarRemito.departamento2Seleccionado = $scope.departamentosFiltrar.indexOf($scope.departamento2Seleccionado);
      $scope.generarRemito(id);
    }

    $scope.reloadDataVer = function(){ 
       $scope.dtInstance.reloadData();
    }

    $scope.reloadDataModificar = function(){ 
       $scope.dtInstance.reloadData();
    }

    
    $scope.dtOptionsVer = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
         // Either you specify the AjaxDataProp here
         dataSrc: 'contratos',
         url: serverUrl + '/contratos/listar',
         type: 'POST', 
         beforeSend: function(xhr){xhr.setRequestHeader('Authorization', $localStorage.tokenData.token.hash);},
         contentType: "application/json",
         data: function(data, dtInstance) {
              $.extend( data, { "estado": $scope.estadoSeleccionado.text, "comisionPaga": $scope.comisionSeleccionado.nombre} ); 
              console.log("MANDO: " + JSON.stringify(data));
              return JSON.stringify(data);
         }
     })
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('ordering', false)
        .withOption('createdRow', function(row, data, dataIndex) {
          $compile(angular.element(row).contents())($scope);
        })
        .withOption("paging", true)
        //.withPaginationType('full_numbers')
        .withLanguage(VIEW_CONSTANTS.language);


  $scope.dtOptionsModificar = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
         // Either you specify the AjaxDataProp here
         dataSrc: 'contratos',
         url: serverUrl + '/contratos/listar',
         type: 'POST', 
         beforeSend: function(xhr){xhr.setRequestHeader('Authorization', $localStorage.tokenData.token.hash);},
         contentType: "application/json",
         data: function(data, dtInstance) {
              if(!$scope.checkRol(4)){
                $.extend( data, { "usuario": $localStorage.tokenData.username, "estado": $scope.estadoSeleccionado.text, "comisionPaga": $scope.comisionSeleccionado.nombre} );
              } else{
                $.extend( data, { "estado": $scope.estadoSeleccionado.text, "comisionPaga": $scope.comisionSeleccionado.nombre} ); 
              }
              return JSON.stringify(data); 
         }
     })
     // or here
    // .withDataProp('data')
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('ordering', false)
        .withOption('createdRow', function(row, data, dataIndex) {
          $compile(angular.element(row).contents())($scope);
        })
        .withOption("paging", true)
        //.withPaginationType('full_numbers')
        .withLanguage(VIEW_CONSTANTS.language);


  $scope.dtOptionsGenerar = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
         // Either you specify the AjaxDataProp here
         dataSrc: 'contratos',
         url: serverUrl + '/contratos/listar',
         type: 'POST', 
         beforeSend: function(xhr){xhr.setRequestHeader('Authorization', $localStorage.tokenData.token.hash);},
         contentType: "application/json",
         data: function(data, dtInstance) {
              $.extend( data, { "estado": $scope.estadoSeleccionado.text, "comisionPaga": $scope.comisionSeleccionado.nombre, "fechaRemito": $scope.fechaSeleccionado,"departamento1": $scope.departamento1Seleccionado.nombre,"departamento2": $scope.departamento2Seleccionado.nombre} );
              console.log("MANDO FILTRO GENERAR : " + JSON.stringify(data));
              return JSON.stringify(data); 
         }
     })
     // or here
    // .withDataProp('data')
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('ordering', false)
        .withOption('createdRow', function(row, data, dataIndex) {
          $compile(angular.element(row).contents())($scope);
        })
        .withOption("paging", true)
        //.withPaginationType('full_numbers')
        .withLanguage(VIEW_CONSTANTS.language);


    $scope.dtOptionsRecoordinar = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
         // Either you specify the AjaxDataProp here
         dataSrc: 'contratos',
         url: serverUrl + '/contratos/listar',
         type: 'POST', 
         beforeSend: function(xhr){xhr.setRequestHeader('Authorization', $localStorage.tokenData.token.hash);},
         contentType: "application/json",
         data: function(data, dtInstance) {
              if(!$scope.checkRol(4)){
                $.extend( data, { "usuario": $localStorage.tokenData.username, "estado": "PARA_RECOORDINAR", "comisionPaga": -1} );
              } else{
                $.extend( data, { "estado": "PARA_RECOORDINAR", "comisionPaga": -1} ); 
              }
              console.log("MANDO PARA RECOORDINAR :" + JSON.stringify(data) );
              return JSON.stringify(data); 
         }
     })
     // or here
    // .withDataProp('data')
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('ordering', false)
        .withOption('createdRow', function(row, data, dataIndex) {
          $compile(angular.element(row).contents())($scope);
        })
        .withOption("paging", true)
        //.withPaginationType('full_numbers')
        .withLanguage(VIEW_CONSTANTS.language);



    $scope.pop = function (type, title, body, timeout, bodyOutputType, clickHandler) {
        this.toast = {
            type: type,
            title: title,
            body: body,
            timeout: timeout,
            bodyOutputType: bodyOutputType,
            clickHandler: clickHandler
        };
        $rootScope.$broadcast('toaster-newToast');
    };


    $scope.generarRemito = function(id,numContrato){ 
      $scope.myPromise = Contrato.generarRemito(id)
        .success(function(responseData, status, headers, config) {
          var blob = new Blob([responseData]);                 
          saveAs( blob, headers('Content-Disposition') );
          $scope.reloadDataModificar();
        }).error(function(data) {
            //self.deferredHandler(data, deferred, $translate.instant('error_getting_content'));
        })['finally'](function() {
            self.inprocess = false;
        });
    };
    

  $scope.generarContrato = function(id,numContrato, generarRemito){ 
    $scope.myPromise = Contrato.generarContrato(id, numContrato)
      .success(function(responseData, status, headers, config) {
           var blob = new Blob([responseData]);                 
           saveAs( blob, headers('Content-Disposition') );
           $scope.reloadDataModificar();

           if(generarRemito){
            $scope.generarRemito(id,numContrato);
           }
      }).error(function(data) {
          //self.deferredHandler(data, deferred, $translate.instant('error_getting_content'));
      })['finally'](function() {
          self.inprocess = false;
      });
  };

  $scope.exportarBaseContratos = function(){ 
    if($scope.checkRol(5)){
      $scope.myPromise = Contrato.exportarContratos()
        .success(function(responseData, status, headers, config) {
             var blob = new Blob([responseData]);                 
             saveAs( blob, headers('Content-Disposition') );
             ngToast.success('Contratos exportados correctamente');

        }).error(function(data) {
            //self.deferredHandler(data, deferred, $translate.instant('error_getting_content'));
        })['finally'](function() {
            self.inprocess = false;
        });
    } else {
      ngToast.danger('No tiene permisos para exportar la base de contratos. Debe tener rol Administrador'); 
    }
  };

  $scope.exportarBaseRemitos = function(fechasFiltro){ 
    if($scope.checkRol(5)){
      $scope.myPromise = Contrato.exportarRemitos(fechasFiltro)
        .success(function(responseData, status, headers, config) {
             var blob = new Blob([responseData]);                 
             saveAs( blob, headers('Content-Disposition') );
             ngToast.success('Remitos exportados correctamente');

        }).error(function(data) {
            //self.deferredHandler(data, deferred, $translate.instant('error_getting_content'));
        })['finally'](function() {
            self.inprocess = false;
        });
    } else {
      ngToast.danger('No tiene permisos para exportar la base de contratos. Debe tener rol Administrador'); 
    }
  };

  $scope.cargarCambioEstados = function(file, errFiles){ 
    if($scope.checkRol(4)){
     $scope.errFile = errFiles && errFiles[0];
      if (file) {
        var blob = new Blob([file], { type: file.type });
        var form = new window.FormData();
        form.append('file',  blob, file.name);

        $scope.myPromise = Contrato.cargarCambioEstados(form).then(
          function(res){
            if (res.status == 200){
              $state.go('dashboard.CambioMasivoEstadosVer');
              //$scope.obtenerCambiosMasivosCargados();
            } else {
              ngToast.danger('Error al cargar el archivo de cambio masivo de estados de contratos');
            }
          },
          function(error){
            ngToast.danger('Error al cargar el archivo de cambio masivo de estados de contratos');
          }
        );
      }
    } else {
      ngToast.danger('No tiene permisos para realizar esta acción. Debe tener rol Supervisor o Administrador'); 
    }
  }

});



angular.module('sbAdminApp').controller('ContratoModalCtrl', function ($scope, $modalInstance, obtenerTitulo, obtenerBody, Contrato,tipoTramite, estado) {

  $scope.title = obtenerTitulo;
  $scope.body = obtenerBody;
  $scope.existeNumContrato = false;
  $scope.numContratos = [""];
  $scope.mostrarNumContrato;

  if(tipoTramite == 0)
    $scope.generarRemitoAsociado = false;
  else
    $scope.generarRemitoAsociado = true;

  if(estado == 1){
    $scope.mostrarNumContrato = true; 
  } else {
    $scope.mostrarNumContrato = false;
  }

  $scope.ok = function () {
    $scope.datosContrato = {};
    if($scope.numContratoIngresado){
      $scope.datosContrato.numContrato = $scope.numContratoIngresado;
    } else {
      $scope.datosContrato.numContrato = '-1';
    }  
    $scope.datosContrato.generarRemitoAsociado = $scope.generarRemitoAsociado;
    $scope.datosContrato.observaciones = $scope.observaciones;
    $modalInstance.close($scope.datosContrato);
  };

  $scope.obtenerNumContratos = function () {
    Contrato.obtenerNumContratos()
    .then(
    function(res){
      $scope.numContratos = res.data.numContratos;
    },  
    function(error){
        ngToast.danger('Error obteniendo numero de contratos: ' + error.status + ', ' + error.statusText);            
    });
  }

  $scope.obtenerNumContratos();

  $scope.$watch('numContratoIngresado', function() {
    if($scope.numContratos){
      if ($scope.numContratos.indexOf($scope.numContratoIngresado) != -1){
        $scope.existeNumContrato = true;
      }
      else{
        $scope.existeNumContrato = false;
       }
    }  
    });

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


angular.module('sbAdminApp').controller('ModificarUsuarioIngresoContratoModalCtrl', function ($scope, Usuario, $modalInstance, obtenerTitulo, obtenerBody) {

  $scope.title = obtenerTitulo;
  $scope.body = obtenerBody;

  $scope.ok = function () {
    
    $modalInstance.close($scope.usuario);
  };

  $scope.obtenerUsuarios = function () {
    Usuario.obtenerUsuarios()
    .then(
    function(res){
      $scope.usuarios = res.data;
      
    },  
    function(error){
        ngToast.danger('Error obteniendo usuarios: ' + error.status + ', ' + error.statusText);            
    });
  }

  $scope.obtenerUsuarios();

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


angular.module('sbAdminApp').controller('ContratoEliminarModalCtrl', function ($scope, $modalInstance, obtenerTitulo, obtenerBody) {

  $scope.title = obtenerTitulo;
  $scope.body = obtenerBody;

  $scope.ok = function () {
    
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

angular.module('sbAdminApp').controller('ContratoAsignarNuevoNumeroModalCtrl', function ($scope, $modalInstance, obtenerTitulo, obtenerBody) {

  $scope.title = obtenerTitulo;
  $scope.body = obtenerBody;

  $scope.ok = function () {
    $modalInstance.close($scope.nuevoNumero);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


angular.module('sbAdminApp').controller('ExportarRemitoModalCtrl', function ($scope, $modalInstance, obtenerTitulo, obtenerBody) {

  $scope.departamentosFiltrar = [{nombre:'Todos'},{nombre:'MONTEVIDEO'},{nombre:'CANELONES'},{nombre:'RIVERA'},{nombre:'ARTIGAS'},{nombre:'CERRO LARGO'},{nombre:'COLONIA'},{nombre:'DURAZNO'},{nombre:'FLORES'},{nombre:'FLORIDA'},{nombre:'LAVALLEJA'},{nombre:'MALDONADO'},{nombre:'PAYSANDÚ'},{nombre:'RIO NEGRO'},{nombre:'ROCHA'},{nombre:'SALTO'},{nombre:'SAN JOSÉ'},{nombre:'SORIANO'},{nombre:'TACUAREMBÓ'},{nombre:'TREINTA Y TRES'}];
  
  $scope.title = obtenerTitulo;
  $scope.body = obtenerBody;

  $scope.fechasFiltro = {};
  $scope.departamento1Seleccionado = $scope.departamentosFiltrar[0];
  $scope.departamento2Seleccionado = $scope.departamentosFiltrar[0];

  $scope.ok = function () {
    $scope.fechasFiltro.departamento1 = $scope.departamento1Seleccionado.nombre;
    $scope.fechasFiltro.departamento2 = $scope.departamento2Seleccionado.nombre;
    $modalInstance.close($scope.fechasFiltro);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
