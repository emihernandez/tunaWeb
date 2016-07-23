'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AuditoriaCtrl
 * @description
 * # AuditoriaCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('AuditoriaCtrl', function($scope, $rootScope, $modal, $modalStack, $timeout, $compile, $q, $state, $sce, $stateParams, ngToast,
                                        DTOptionsBuilder, DTColumnBuilder, AuthService, Auditoria, Productor, Relevamiento, VariablesComunes,
                                        fileManagerConfig, $filter,  $location, $localStorage, VIEW_CONSTANTS, SERVER_CONSTANTS) {
  
    var vm = this;
    var idRelevamiento;

    $scope.auditoriaStatusHTML = '';
    $scope.contactosIsCollapsed = true;
    $scope.archivosIsCollapsed = true;
    $scope.relevamientoIsCollapsed = false;
    
    ngToast.settings.verticalPosition = 'bottom';
    ngToast.settings.horizontalPosition = 'right';
    ngToast.settings.maxNumber = 3;
    
      
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;

    $scope.auditoriasArray = [];
    $scope.idAuditoriaBuscar   = $stateParams.idAuditoria;
    fileManagerConfig.auditoriaId = $scope.idAuditoriaBuscar;
    
    fileManagerConfig.createFolder = true;
    fileManagerConfig.uploadFile = true;
    
    $scope.auditoria = {} ;
    $scope.productor = {} ;
    $scope.auditoriaNueva = {} ;
    $scope.child = {};
    $scope.aprobacion = {};
    $scope.aprobacion.motivoRechazo = {};

    $scope.auditoriaOpcionesAuditor = [{nombre:'Todos', text:'Todos'},{nombre:'Sin asignar', text:'Sin asignar'},{nombre:'kermit', text:'kermit'},{nombre:'auditorUser', text:'auditorUser'}];
    $scope.auditorOpcionSeleccion = 'Todos';
    $scope.dtInstance = {};
    $scope.filtroEstado = {};
    $scope.filtroEstado.string = '';
    $scope.filtroEstado.fechaDesde = '';
    $scope.filtroEstado.fechaHasta = '';
    $scope.filtroScope = {};

    
    $scope.checkRol = function(accion){
      return AuthService.checkRol(accion);
    }
    
    $scope.$watch('auditoriaNueva.tipo', function(newValue,oldValue) {
      if ( newValue === "") {
        $scope.auditoriaNueva.precio = "";
      }
      else {
        var bConRegistro = false
        if ( newValue === "1") {
          bConRegistro = true;
        }
        if ($scope.child.productor){
          if ($scope.child.productor.ultimaRemision){
            if ($scope.child.productor.ultimaRemision != "No existen remisiones para este productor") {
              $scope.obtenerPrecio($scope.child.productor.ultimaRemision, bConRegistro);
            }
          }
        }
      }
    });

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


    var url = $location.url();

    if (url.indexOf("realizar_devolucion") != -1){

      var wrapper = document.getElementById("signature-pad"),
      clearButton = wrapper.querySelector("[data-action=clear]"),
      saveButton = wrapper.querySelector("[data-action=save]"),
      canvas = wrapper.querySelector("canvas"),
      signaturePad;



    function resizeCanvas() {
      var ratio =  Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
    }

    window.onresize = resizeCanvas;
    resizeCanvas();

    signaturePad = new SignaturePad(canvas);
    }

    $scope.borrarPad = function(){ 
       signaturePad.clear();
    }

    $scope.guardarFirma = function(){ 
       if (signaturePad.isEmpty()) {
            ngToast.warning('Debe firmar previamente');
        } else {
            var pngURL = signaturePad.toDataURL(); //PNG base64 por defecto
            var data = atob(pngURL.substring( "data:image/png;base64,".length ) ),
                asArray = new Uint8Array(data.length);
            for( var i = 0, len = data.length; i < len; ++i ) {
                asArray[i] = data.charCodeAt(i);    
            }
            var blob = new Blob( [ asArray.buffer ], {type: "image/png"} );

            // var blob = new Blob([pngURL], {type: 'image/png'});
            var self = this;
            var form = new window.FormData();
            var deferred = $q.defer();
            form.append('id', $scope.auditoria.id.toString());
            form.append('file', blob);
            self.requesting = true;

            Auditoria.guardarFirma(form);
            $scope.SignatureIsCollapsed = true;
            ngToast.success('Firma guardada correctamente');
        }
    }
    
    $scope.obtenerPrecio = function(remision, conRegistro){ 
       
      if (remision !== undefined ) {
        Auditoria.obtenerPrecio(remision, conRegistro)
          .then(
          function(res){
            $scope.precioPorDefecto = res.data; 
            $scope.auditoriaNueva.precio = $scope.precioPorDefecto;
            console.log("obtenerPrecio OK: ");

          },
          function(error){
            console.log("obtenerPrecio error : " + JSON.stringify(error));
          });
      }
      else{
        $scope.auditoriaNueva.precio="";
      }
    }
    
    $scope.crearAuditoria = function(crearIgual){ 
      if (!$scope.auditoriaForm.$invalid) {

      $scope.auditoriaNueva.idProductor = Auditoria.idProductor;

      Auditoria.create($scope.auditoriaNueva, crearIgual).then(
        function(res){
          if (res.data.status == 'OK'){
            console.log("Auditoria created successfully: " + JSON.stringify(res));
            ngToast.success('Auditoria creada correctamente');
            $state.go('dashboard.auditoriasListar');
          } else if (res.data.status == 'NOT_ACCEPTABLE'){
            $scope.confirmarCreacion();
          }
        },
        function(error){
          //$mdToast.show($mdToast.simple().content(JSON.stringify(error.data)));
          console.log("Auditoria error : " + JSON.stringify(res));
        });
      console.log("crearAuditoria: " + $scope.auditoriaNueva.idProductor + ''+ $scope.mecanismoContacto + ''+ $scope.tipo + ''+ $scope.precio + '' + $scope.notas);
    }}


    $scope.confirmarCreacion = function () {
      var body = 'Ya existe una auditoría en curso para este productor. \r\n Seguro desea crear otra?';
      var title = 'Confirmar creación de auditoría';
      var modalInstance = $modal.open({
        templateUrl: 'views/auditorias/confirmarCreacion.html',
        controller: 'ConfirmarCreacionInstanceCtrl',
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
        $scope.crearAuditoria(1);      
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };


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

          $scope.aprobacion.motivoRechazo = "";

          VariablesComunes.ultimaRemision = $scope.auditoria.ultimaRemision;
          
          $scope.auditoriaStatusHTML = $scope.getHtmlStatus($scope.auditoria.estado);

          var cantMedidas = 0;
          if ( $scope.auditoria.devolucion !== null ){
            cantMedidas = $scope.auditoria.devolucion.medidas.length;
          }
          
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
          
          console.log("Auditoria buscar successfully: " + JSON.stringify(res));
          //$mdToast.show($mdToast.simple().content(res.message));
         // $location.url('/locations');
        },
        function(error){
          console.log("Auditoria error : " + JSON.stringify(error));
        });
    }

    $scope.cargarAuditoriaOffline = function(){ 
      
      $scope.auditoriasOffline = JSON.parse(localStorage.auditorias);

      var cantAuditorias = $scope.auditoriasOffline.length;
      for (var i = 0; i < cantAuditorias; i++) {
          if ($scope.auditoriasOffline[i].auditoria.id = $scope.idAuditoriaBuscar){
            $scope.auditoria = $scope.auditoriasOffline[i].auditoria;
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


    $scope.finalizarDevolucion = function(){
      
      var cantMedidas = 0;
      if($scope.auditoria.devolucion.medidas != undefined){
        cantMedidas = $scope.auditoria.devolucion.medidas.length;
      }

      for (var i = 0; i < cantMedidas; i ++){
        $scope.auditoria.devolucion.medidas[i].seguimientos = [];
        $scope.auditoria.devolucion.medidas[i].primerSeguimiento = $filter('date')($scope.auditoria.devolucion.medidas[i].fecha, "dd-MM-yyyy");
      }


      Auditoria.finalizarDevolucion($scope.auditoria.id, $scope.auditoria.devolucion).then(
        function(res){
          console.log("Devolucion finalizada correctamente: " + JSON.stringify(res));
          ngToast.success('Devolución finalizada correctamente');
          $state.go('dashboard.auditoriasListar');
        },
        function(error){
          console.log("Devolucion error : " + JSON.stringify(error));
        });
    }


    $scope.detalleMedida = function(idAuditoria, idMedida){
      $state.go('dashboard.verDetalleMedida', {idAuditoria:idAuditoria, idMedida:idMedida}, {reload:true});
    }

    $scope.modificarAuditoria = function(){ 
      
      Auditoria.create($scope.auditoriaNueva).then(
        function(res){
          console.log("Auditoria created successfully: " + JSON.stringify(res));
         // $location.url('/locations');
        },
        function(error){
          //$mdToast.show($mdToast.simple().content(JSON.stringify(error.data)));
          console.log("Auditoria error : " + JSON.stringify(res));
        });
      console.log("crearAuditoria: " + $scope.idProductor + ''+ $scope.mecanismoContacto + ''+ $scope.tipo + ''+ $scope.precio + '' + $scope.notas);
    }
    $scope.accionClicked = function(row){
      var idAuditoria = $scope.auditoriasArray[row].id;
      console.log('accionClicked clicked');
      if ($scope.auditoriasArray[row].accion == 'Verificar condiciones financieras'){ 
        $state.go('dashboard.verificarCondiciones', {idAuditoria:idAuditoria, matricula:$scope.auditoriasArray[row].matricula}, {reload:true});
      } else if ($scope.auditoriasArray[row].accion == 'Relevamiento telefonico'){ 
        $state.go('dashboard.auditoriasRelevamiento', {idAuditoria:idAuditoria}, {reload:true});
      } else if ($scope.auditoriasArray[row].accion == 'Obtener documentacion preliminar'){ 
        $state.go('dashboard.auditoriasDocumentacion', {idAuditoria:idAuditoria}, {reload:true});
      } else if ($scope.auditoriasArray[row].accion == 'Realizar informe'){ 
        $state.go('dashboard.auditoriasInforme', {idAuditoria:idAuditoria}, {reload:true});
      } else if ($scope.auditoriasArray[row].accion == 'Aprobar informe'){ 
        $state.go('dashboard.aprobarAuditoria', {idAuditoria:idAuditoria}, {reload:true});
      } else if ($scope.auditoriasArray[row].accion == 'Realizar devolución'){ 
        $state.go('dashboard.realizarDevolucion', {idAuditoria:idAuditoria}, {reload:true});
      } else if ($scope.auditoriasArray[row].accion == 'Realizar seguimiento'){ 
        $state.go('dashboard.realizarSeguimiento', {idAuditoria:idAuditoria}, {reload:true});
      }

      
    } 
    $scope.verAuditoria= function(row){
      var idAuditoria = $scope.auditoriasArray[row].id;
      console.log('verAuditoria clicked');
      $state.go('dashboard.auditoriasVer', {idAuditoria:idAuditoria}, {reload:true});
    }  
 
    $scope.verHistoricoAuditoria= function(row){
      var idAuditoria = $scope.auditoriasArray[row].id;
      console.log('verHistoricoAuditoria clicked');
      $state.go('dashboard.auditoriasVerHistorico', {idAuditoria:idAuditoria}, {reload:true});
    }  

    $scope.verProductor = function(row){
      // var idAuditoria = aData.id;
      // var matricula = aData.matriculaProductor;
      var matriculaProductor = $scope.auditoriasArray[row].matricula;
      console.log('verProductor clicked');
      $state.go('dashboard.productoresEditar', {matricula:matriculaProductor}, {reload:true});
    }  
    
    $scope.getColorsStatus = function(estado){
      
      var colors = {};      
      
      switch(estado){
        case 'Interes de auditoria registrado':
            colors.divClass = 'progress-bar-interesAuditoriaRegistrado';
            colors.avance = '10';
            colors.colorAvance = colors.divClass;
          break;
        case 'Condiciones financieras verificadas':
            colors.divClass = 'progress-bar-condicionesFinancierasVerificadas';
            colors.avance = '20';
            colors.colorAvance = colors.divClass;
          break;
        case 'Relevamiento telefonico realizado':
            colors.divClass = 'progress-bar-relevamientoTelefonicoRealizado';
            colors.avance = '30';
            colors.colorAvance = colors.divClass;
          break;
        
        case 'Documentacion preliminar ingresada':
            colors.divClass = 'progress-bar-documentacionPreliminarIngresada';
            colors.avance = '40';
            colors.colorAvance = colors.divClass;
          break;
        case 'Auditoria realizada':
            colors.divClass = 'progress-bar-auditoriaRealizada';
            colors.avance = '50';
            colors.colorAvance = colors.divClass;
          break;
        case 'Informe realizado':
            colors.divClass = 'progress-bar-informeRealizado';
            colors.avance = '60';
            colors.colorAvance = colors.divClass;
          break;
        case 'Informe de auditoria aprobado':
            colors.divClass = 'progress-bar-informeDeAuditoriaAprobado';
            colors.avance = '70';
            colors.colorAvance = colors.divClass;
          break;
          
        case 'Cancelada - No verifica condiciones financieras':
            colors.divClass = 'progress-bar-canceladaNoVerificaCondicionesFinancieras';
            colors.avance = '20';
            colors.colorAvance = 'progress-bar-terminada';
          break;
        case 'Rechazada por productor':
            colors.divClass = 'progress-bar-rechazadaPorProductor';
            colors.avance = '30';
            colors.colorAvance = 'progress-bar-terminada';
          break;
        case 'Informe de auditoria rechazado':
            colors.divClass = 'progress-bar-informeDeAuditoriaRechazado';
            colors.avance = '60';
            colors.colorAvance = colors.divClass;
          break; 
        case 'Devolucion finalizada':
            colors.divClass = 'progress-bar-devolucionFinalizada';
            colors.avance = '80';
            colors.colorAvance = colors.divClass;
          break; 
        case 'Auditoria finalizada':
            colors.divClass = 'progress-bar-auditoriaFinalizada';
            colors.avance = '100';
            colors.colorAvance = colors.divClass;
          break;       
          
        case 'test':
            colors.divClass = 'progress-bar-test';
            colors.avance = '602';
            colors.colorAvance = 'progress-bar-terminada';
          break;          
      }
      return colors;
    }
    $scope.getHtmlLegends = function(){
        var legends = []; //'test',
        var auditoriaStatus = ['Interes de auditoria registrado', 'Condiciones financieras verificadas', 'Relevamiento telefonico realizado','Documentacion preliminar ingresada','Auditoria realizada','Informe realizado','Informe de auditoria aprobado', 'Informe de auditoria rechazado', 'Cancelada - No verifica condiciones financieras','Rechazada por productor'];
        
        for(var i=0; i<auditoriaStatus.length; i++){
          legends[i] = $scope.getColorsStatus(auditoriaStatus[i]);
        }
        return legends;
    }
    $scope.legends = $scope.getHtmlLegends();
    $scope.getHtmlStatus = function(estado){
      var html = '';
      var tableColor = '#e11c1c';
      
      var colors = $scope.getColorsStatus(estado);
   
      html =  '<td width=80%><div class="progress progress-xs"> <div class="progress-bar ' + colors.divClass +  '" style="width:'+ colors.avance + '%"></div> </div>' + 
              '</td><td  width=20%><span class="badge '+ colors.colorAvance+ ' ">' +  colors.avance + '%</span></td>';

      var html2 = '<table class="table no-border" style="background:none"><tr><td border=0 colspan="2">' + estado + '</td> </tr><tr width=100%>' + html + '</tr></table>';
                     
      return $sce.trustAsHtml(html2);
    }
    
    
    if ( $scope.checkRol(4)) {
      $scope.dtColumns =  [
              DTColumnBuilder.newColumn('id').withTitle('Id').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="verAuditoria(' + meta.row + ')">' + full.id + '</a>'
              }),
              DTColumnBuilder.newColumn('fechaCreacion').withTitle('Fecha inicio').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="verAuditoria(' + meta.row + ')">' + full.fechaCreacion + '</a>'
              }),
              DTColumnBuilder.newColumn('fechaUltimoEstado').withTitle('Ultimo cambio de estado').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="verAuditoria(' + meta.row + ')">' + full.fechaUltimoEstado + '</a>'
              }),
              DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable()
              .renderWith(function(data, type, full, meta) {
                   return  '<a ng-click="verAuditoria(' + meta.row + ')">' + $scope.getHtmlStatus( full.estado) + '</a>';
              }),
              DTColumnBuilder.newColumn('auditor').withTitle('Auditor asignado').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="verAuditoria(' + meta.row + ')">' + full.auditor + '</a>'
                }),
              DTColumnBuilder.newColumn('estadoUTE').withTitle('Estado UTE').notSortable(),
              DTColumnBuilder.newColumn('null').withTitle('Acción').notSortable()
              .renderWith(function(data, type, full, meta) {
                $scope.auditoriasArray[meta.row] = {};
                $scope.auditoriasArray[meta.row].estado = full.estado;
                $scope.auditoriasArray[meta.row].accion = full.accion;
                $scope.auditoriasArray[meta.row].id = full.id;
                $scope.auditoriasArray[meta.row].matricula = full.matriculaProductor;
                 if (full.accion == 'Realizar auditoria'){
                  return full.accion;
                 } else if (full.accion == 'Aprobar informe'){
                    if ($scope.checkRol(9)){
                       return  '<a ng-click="accionClicked(' + meta.row + ')">' + full.accion + '</a>&nbsp;'
                    } else {
                      return full.accion;
                    }
                 } else {
                   return  '<a ng-click="accionClicked(' + meta.row + ')">' + full.accion + '</a>&nbsp;'
                 }
              }) ,
              DTColumnBuilder.newColumn('tipo').withTitle('Tipo').notSortable(),
              DTColumnBuilder.newColumn('matriculaProductor').withTitle('Matrícula').notSortable()
              .renderWith(function(data, type, full, meta) {
                // $scope.auditoriasArray[meta.row] = {};
                $scope.auditoriasArray[meta.row].matricula = full.matriculaProductor;
                return  '<a ng-click="verProductor(' + meta.row + ')"> '+ full.matriculaProductor + '</a>'
              }),
              DTColumnBuilder.newColumn('razonSocial').withTitle('Razón Social').notSortable()
              .renderWith(function(data, type, full, meta) {
                return  '<a ng-click="verProductor(' + meta.row + ')"> '+ full.razonSocial + '</a>'
              }),
              DTColumnBuilder.newColumn('tipoEstablecimiento').withTitle('Tamaño').notSortable(),
              DTColumnBuilder.newColumn('zona').withTitle('Zona').notSortable(),
              DTColumnBuilder.newColumn('null').withTitle('Ver').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="verAuditoria(' + meta.row + ')"> Ver </a> | ' + 
                         '<a ng-click="verHistoricoAuditoria(' + meta.row + ')"> Historico </a>'
              }) //style="align:center"<tr><td><a ng-click="accionClicked(0)">Relevamiento telefonico</a></tr></td>
            ];
    }else { // LISTADO PARA DT y AUDITORES
      $scope.dtColumns =  [
              DTColumnBuilder.newColumn('id').withTitle('Id').notSortable(),              
              DTColumnBuilder.newColumn('fechaCreacion').withTitle('Fecha inicio').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="verAuditoria(' + meta.row + ')">' + full.fechaCreacion + '</a>'
              }),
              DTColumnBuilder.newColumn('fechaUltimoEstado').withTitle('Ultimo cambio de estado').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="verAuditoria(' + meta.row + ')">' + full.fechaUltimoEstado + '</a>'
              }),
              DTColumnBuilder.newColumn('tipo').withTitle('Tipo').notSortable(),
              //DTColumnBuilder.newColumn('estado').withTitle('Estado'),
              DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable()
              .renderWith(function(data, type, full, meta) {
                  return  '<a ng-click="verAuditoria(' + meta.row + ')">' + $scope.getHtmlStatus( full.estado) + '</a>';
                }),
              DTColumnBuilder.newColumn('auditor').withTitle('Auditor asignado').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="verAuditoria(' + meta.row + ')">' + full.auditor + '</a>'
                }),
              DTColumnBuilder.newColumn('estadoUTE').withTitle('Estado UTE').notSortable(),
              DTColumnBuilder.newColumn('null').withTitle('Acción')
              .renderWith(function(data, type, full, meta) {
                $scope.auditoriasArray[meta.row] = {};
                $scope.auditoriasArray[meta.row].estado = full.estado;
                $scope.auditoriasArray[meta.row].accion = full.accion;
                $scope.auditoriasArray[meta.row].id = full.id;
                $scope.auditoriasArray[meta.row].matricula = full.matriculaProductor;
                 if ($scope.checkRol(9)){
                    if (full.accion == 'Aprobar informe'){
                       return  '<a ng-click="accionClicked(' + meta.row + ')">' + full.accion + '</a>&nbsp;'
                    } else {
                      return full.accion;
                    }
                 } else if ($scope.checkRol(6)){
                  if (full.accion == 'Realizar auditoria'){
                       return  '<a ng-click="accionClicked(' + meta.row + ')">' + full.accion + '</a>&nbsp;'
                    } else {
                      return full.accion;
                    }
                 }
              }) ,
              DTColumnBuilder.newColumn('matriculaProductor').withTitle('Matrícula').notSortable()
              .renderWith(function(data, type, full, meta) {
                //$scope.auditoriasArray[meta.row] = {};
                $scope.auditoriasArray[meta.row].matricula = full.matriculaProductor;
                return  '<a ng-click="verProductor(' + meta.row + ')"> '+ full.matriculaProductor + '</a>'
              }),
              DTColumnBuilder.newColumn('razonSocial').withTitle('Razón Social').notSortable()
              .renderWith(function(data, type, full, meta) {
                return  '<a ng-click="verProductor(' + meta.row + ')"> '+ full.razonSocial + '</a>'
              }),
              DTColumnBuilder.newColumn('tipoEstablecimiento').withTitle('Tamaño').notSortable(),
              DTColumnBuilder.newColumn('zona').withTitle('Zona').notSortable(),
              DTColumnBuilder.newColumn('null').withTitle('Ver').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="verAuditoria(' + meta.row + ')"> Ver </a>'
              }) 
            ];
    }

    $scope.listarAuditorias2 = function(){ 
      var deferred = $q.defer();
      Auditoria.getAuditoriaListado($scope.idAuditoria) //de donde sale este id auditoria?
        .then(function(res){
          $scope.auditorias = res.data;
          console.log("getAuditoriaLista OK: ");
           deferred.resolve(res.data);
        }); 
      return deferred.promise;
    }

    // function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        // // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
        // $('td', nRow).unbind('click');
        // $('td', nRow).bind('click', function() {
            // $scope.$apply(function() {
                // vm.verAuditoria(aData);
            // });
        // });
        // return nRow;
    // }

    // $scope.dtOptions =  DTOptionsBuilder.fromFnPromise($scope.listarAuditorias2)
    //                       .withDataProp('auditorias')
    //                       .withOption("bAutoWidth", true)
    //                       .withOption("paging", true)
    //                       .withOption('processing', true)
    //                       .withOption('createdRow', function(row, data, dataIndex) {
    //                         $compile(angular.element(row).contents())($scope);
    //                       })
    //                       .withLanguage(VIEW_CONSTANTS.language);              
                      
                        //.withOption('rowCallback', rowCallback)
                      //.withOption('serverSide', true);
                      // .withOption("aaSorting", [])
                      // .withOption("order", [[ 1, "desc" ]])
                      // .withDOM("tr")

  $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
         dataSrc: 'data',
         url: serverUrl + '/auditoria/listado',
         type: 'POST', 
         beforeSend: function(xhr){xhr.setRequestHeader('X-AUTH-TOKEN', $localStorage.tokenData.token);},
         contentType: "application/json",
         data: function(data, dtInstance) {
              $.extend( data, { "auditor": $scope.auditorOpcionSeleccion.text, "filtroEstado": $scope.filtroEstado.string, "fechaDesde": $scope.filtroEstado.fechaDesde, "fechaHasta": $scope.filtroEstado.fechaHasta} );
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
        .withLanguage(VIEW_CONSTANTS.language);
        
    $scope.reloadData = function(){ 
       $scope.dtInstance.reloadData();
    }

    $scope.auditoriaFiltroAuditor = function() {
      
      $scope.dtInstance.DataTable.column( 4 ).search(
          $scope.auditorOpcionSeleccion.text
      ).draw();
    }

    $scope.auditoriaFiltroEstado = function() {
      $scope.crearStringFiltro();
      $scope.dtInstance.DataTable.column( 5 ).search(
          $scope.filtroEstado.string
      ).draw();
    }

    $scope.actualizarAuditorias = function() {
      $scope.auditoriaFiltroAuditor();
    }

    $scope.restablecerFiltros = function() {
      $scope.auditorOpcionSeleccion = $scope.auditoriaOpcionesAuditor[0];
      $scope.filtroEstado.creada = false;
      $scope.filtroEstado.condsVerficiadas = false;
      $scope.filtroEstado.condsNoVerficiadas = false;
      $scope.filtroEstado.relTelRealizado = false;
      $scope.filtroEstado.documentacionIngresada = false;
      $scope.filtroEstado.auditoriaRealizada = false;
      $scope.filtroEstado.informeFinalizado = false;
      $scope.filtroEstado.informeAprobado = false;
      $scope.filtroEstado.informeRechazado = false;
      $scope.filtroEstado.devolucionRealizada = false;
      $scope.filtroEstado.finalizada = false;
      $scope.filtroEstado.rechazadaProductor = false;

      $scope.filtroEstado.fechaDesde = "";
      $scope.filtroEstado.fechaHasta = "";

      $scope.filtroScope.filtroEstado.fechaDesde = "";
      $scope.filtroScope.filtroEstado.fechaHasta = "";
      
      $scope.crearStringFiltro();
      $scope.auditoriaFiltroAuditor();
    }

    $scope.crearStringFiltro = function() {
      $scope.filtroEstado.string = '';
      if ($scope.filtroEstado.creada){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Interes de auditoria registrado/';
      }
      if ($scope.filtroEstado.condsVerficiadas){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Condiciones financieras verificadas/';
      }
      if ($scope.filtroEstado.condsNoVerficiadas){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Cancelada - No verifica condiciones financieras/';
      }
      if ($scope.filtroEstado.relTelRealizado){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Relevamiento telefonico realizado/';
      }
      if ($scope.filtroEstado.rechazadaProductor){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Rechazada por productor/';
      }
      if ($scope.filtroEstado.documentacionIngresada){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Documentacion preliminar ingresada/';
      }
      if ($scope.filtroEstado.auditoriaRealizada){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Auditoria realizada/';
      }
      if ($scope.filtroEstado.informeFinalizado){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Informe realizado/';
      }
      if ($scope.filtroEstado.informeAprobado){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Informe de auditoria aprobado/';
      }
      if ($scope.filtroEstado.informeRechazado){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Informe de auditoria rechazado/';
      }
      if ($scope.filtroEstado.devolucionRealizada){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Devolucion finalizada/';
      }
      if ($scope.filtroEstado.finalizada){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Auditoria finalizada/';
      }
    }

    $scope.listarAuditoriasHistorico = function(){ 
      var deferred = $q.defer();
      Auditoria.getAuditoriaHistoricoListado($scope.idAuditoriaBuscar) 
        .then(function(res){
          $scope.auditorias = res.data;
          console.log("getAuditoriaHistoricoListado OK: ");
          deferred.resolve(res.data);
        }); 
      return deferred.promise;
    }
  
    $scope.getTipoHistoricoDesc = function(tipo){
      var strDesc = '';
      switch (tipo){
        case 100:
          strDesc = 'Creada';
          break;
       case 101:
          strDesc = 'Verificada';
          break;
       case 102:
          strDesc = 'Cancelada';
          break;
       case 103:
          strDesc = 'Relevamiento modificado';
          break;
       case 104:
          strDesc = 'Modificada';
          break;
       case 105:
          strDesc = 'No verificada';
          break;
       case 106:
          strDesc = 'Documentación preliminar finalizada';
          break;
       case 107:
          strDesc = 'Documento subido';
          break;
       case 108:
          strDesc = 'Documento borrado';
          break;
       case 109:
          strDesc = 'Carpeta creada';
          break;
       case 110:
          strDesc = 'Datos de UTE subidos';
          break;
       case 111:
          strDesc = 'Relevamiento finalizado';
          break;
       case 112:
          strDesc = 'Tanque agregado';
          break;
        case 113:
          strDesc = 'Tanque eliminado';
          break;
        case 114:
          strDesc = 'Tanque modificado';
          break;
        case 115:
          strDesc = 'Auditoria realizada';
          break;
        case 116:
          strDesc = 'Informe de auditoria subido al repositorio';
          break;
        case 117:
          strDesc = 'Informe de auditoria finalizado';
          break;
        case 118:
          strDesc = 'Informe de auditoria aprobado';
          break;
        case 119:
          strDesc = 'Informe de auditoria rechazado';
          break;
        case 120:
          strDesc = 'Planilla de seguimiento subida';
          break;
        case 121:
          strDesc = 'Tarea de devolución finalizada';
          break;
        case 122:
          strDesc = 'Seguimiento finalizado';
          break;
        case 123:
          strDesc = 'Comprobante subido al repositorio';
          break;
        case 124:
          strDesc = 'Firma digital subida al repositorio';
          break;
      }
      return strDesc;
    }

    $scope.dtColumnsHistorico =  [
              DTColumnBuilder.newColumn('dateFormateada').withTitle('Fecha'),
              DTColumnBuilder.newColumn('username').withTitle('Usuario'),
              DTColumnBuilder.newColumn('tipo').withTitle('Tipo')
              .renderWith(function(data, type, full, meta) {
                 return  $scope.getTipoHistoricoDesc(full.tipo); //'<a ng-click="verAuditoria(' + meta.row + ')"> Ver </a>'
              }),
              DTColumnBuilder.newColumn('descripcion').withTitle('Información extra')
              ];
              
    $scope.dtOptionsHistorico =  DTOptionsBuilder.fromFnPromise($scope.listarAuditoriasHistorico)
                                .withDataProp('auditorias')
                                .withOption("bAutoWidth", true)
                                .withOption("paging", true)
                                .withOption('processing', true)
                                .withLanguage(VIEW_CONSTANTS.language)
                                .withOption('createdRow', function(row, data, dataIndex) {
                                  $compile(angular.element(row).contents())($scope);
                                });                             
                      
    var tipoEstDescNA = "Grande"
    var tipoEstDescGrande = "Grande"
    var tipoEstDescMediano = "Mediano"
    var tipoEstDescChico = "Chico"

    $scope.traducirTipoEstablecimientoSegunRemision = function(remision){
      var descripcion = '';
      //Tipo de establecimiento. Pasaje de int a String
      if (remision < 1000) {
          descripcion = tipoEstDescChico;} 
      else if (remision >= 1000 && remision <= 3000) {
          descripcion = tipoEstDescMediano;
      }
       else if (remision > 3000) {
          descripcion = tipoEstDescGrande;
      }
      else {
          descripcion = tipoEstDescNA;
      }
      return descripcion;
    }     

    $scope.$watch('auditoriaNueva.productorCargado', function(newValue,oldValue){
    if ( newValue >= 0) {
        var bConRegistro = true;
        $scope.mostrarCombo1 = true;
        if ($scope.child.productor.ultimaRemision != "No existen remisiones para este productor") {
            $scope.obtenerPrecio($scope.child.productor.ultimaRemision, bConRegistro);
              if($scope.child.productor.ultimaRemision < 5000){
                 bConRegistro = false;
                 $scope.auditoriaNueva.tipo="0"
               }
               else{
                 $scope.mostrarCombo1 = false;
                 $scope.auditoriaNueva.tipo = "1";
               }
        }
        else{
             $scope.auditoriaNueva.tipo="";
             bConRegistro = false;
             $scope.mostrarCombo1 = true;
           }

  
      }
    });
   

   $scope.aprobarAuditoria = function(){
     if (!$scope.aprobarForm.$invalid){
      if ($scope.aprobacion.aprobarAuditoria != "No"){
        $scope.aprobacion.motivoRechazo = "-1";
      }
      Auditoria.aprobarAuditoria($scope.idAuditoriaBuscar,$scope.aprobacion.motivoRechazo)
        .then(function(res){
          console.log("Auditoria buscar successfully: " + JSON.stringify(res));
          if ($scope.aprobacion.aprobarAuditoria != "No"){
            ngToast.success('Informe aprobado correctamente');
          } else {
            ngToast.success('Informe rechazado correctamente');
          }
           $state.go('dashboard.auditoriasListar');
        });
    }
   }

   $scope.listarAuditorias = function(){ 
      Auditoria.getAuditoriaLista($scope.idAuditoria)
        .then(function(res){
          $scope.auditorias = res.data;
          console.log("getAuditoriaLista OK: ");
        });
    }   
    $scope.verificarCondiciones = function(){ 
      Auditoria.verificarCondiciones($scope.idAuditoriaBuscar)
        .then(function(res){
          $scope.auditorias = res.data;
           ngToast.success('Condiciones financieras verificadas correctamente');
           $state.go('dashboard.auditoriasListar');
        });
    }

    $scope.noVerificarCondiciones = function(){ 
      Auditoria.noVerificarCondiciones($scope.idAuditoriaBuscar)
        .then(function(res){
          $scope.auditorias = res.data;
           ngToast.success('Condiciones financieras no verificadas correctamente');
           $state.go('dashboard.auditoriasListar');
        });
    }

    $scope.cancelarAuditoria = function(){ 
      Auditoria.cancelarAuditoria($scope.auditoria)
        .then(function(res){
           ngToast.success('Auditoria cancelada correctamente');
           $state.go('dashboard.auditoriasListar');
        });
    }

    $scope.descargarInforme = function(){ 
      $scope.myPromise = Auditoria.descargarInforme($scope.idAuditoriaBuscar)
        .success(function(responseData, status, headers, config) {
             
                 var blob = new Blob([responseData]);                 
                 saveAs( blob, headers('Content-Disposition') );

            }).error(function(data) {
                //self.deferredHandler(data, deferred, $translate.instant('error_getting_content'));
            })['finally'](function() {
                self.inprocess = false;
            });
    }

    if( $stateParams.idAuditoria !== undefined && $stateParams.idAuditoria !== '' ) {
      Auditoria.idRelevamiento= $stateParams.idAuditoria
      if ($scope.bConnected){
        $scope.buscarAuditoria();
      } else {
        $scope.cargarAuditoriaOffline();
      }
    }

    $scope.createMap = function () {
      $scope.mapdiv = document.getElementById('map');
      if ( $scope.mapdiv === null ){
        return;
      }
      $scope.mapdiv.style.height = '210px';
      $scope.mapdiv.style.minHeight = '350px';
      $scope.mapdiv.style.width = '100%';

      var mapOptions = {
        center: new google.maps.LatLng($scope.productor.latitud, $scope.productor.longitud),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        zoomControl: true,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false
      };

      $scope.map = new google.maps.Map($scope.mapdiv, mapOptions);
      $scope.initializeMap();
    };
    
    if( $stateParams.matricula !== undefined && $stateParams.matricula !== '' ) {
        $scope.matriculaBuscar   = parseInt($stateParams.matricula);
        //$scope.buscarProductor();
    }
    
    $scope.agregarContactoClicked = function(){
      $scope.nuevoContacto = true;
      $scope.contactoAModificar = {};
      $scope.contactoAModificar.principal = 0;
      $scope.openModal('Nuevo contacto');
    }
    $scope.openModal = function (title) {
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/productores/editarContactoModal.html',
        controller: 'ModalInstanceCtrl',
        // size: size,
        resolve: {
            contactoAModificar: function () {
              return $scope.contactoAModificar;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }
          }
      });
      modalInstance.result.then(function (contacto) {
        if ( !$scope.bNuevoProductor ){
          if( $scope.nuevoContacto ){
            Productor.crearContacto($scope.productor.matricula, contacto)
            .then( function(res){
              ngToast.create('Contacto creado correctamente');
              $scope.child.buscarProductor();
            });
          } else {
            Productor.actualizarContacto(contacto)
            .then( function(res){
              ngToast.success('Contacto actualizado correctamente');
              $scope.child.buscarProductor();
            });
          }        
        } else {
          $scope.nuevoProductorContactos[$scope.nuevoProductorContactos.length] = contacto;
        }
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

});

angular.module('sbAdminApp').controller('ConfirmarCreacionInstanceCtrl', function ($scope, $modalInstance, $state, obtenerTitulo, obtenerBody) {
    $scope.title = obtenerTitulo;
    $scope.body = obtenerBody;

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
      $state.go('dashboard.auditoriasListar');
    };
  });

angular.module('sbAdminApp').controller('FechaSeguimientoController', function ($scope, $filter) {
  
  $scope.today = function() {
    $scope.dt = new Date();
  };

  $scope.medida.fecha = new Date();
  $scope.medida.fecha.setDate($scope.medida.fecha.getDate() + 30);

  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
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
  $scope.maxDate = new Date(2050, 5, 22);

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

angular.module('sbAdminApp').controller('FechaFiltroController', function ($scope, $filter) {
  
  $scope.filtroEstado= {};
  $scope.$parent.filtroScope = $scope;

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.fechaDesdeChanged = function () {
    var fechaDesde = $filter('date')($scope.filtroEstado.fechaDesde, "yyyy-MM-dd");
    $scope.$parent.filtroEstado.fechaDesde = fechaDesde;
    if ($scope.filtroEstado.fechaHasta){
      $scope.$parent.actualizarAuditorias();
    }
  };

  $scope.fechaHastaChanged = function () {
    var fechaHasta = $filter('date')($scope.filtroEstado.fechaHasta, "yyyy-MM-dd");
    $scope.$parent.filtroEstado.fechaHasta = fechaHasta;
    if ($scope.filtroEstado.fechaDesde){
      $scope.$parent.actualizarAuditorias();
    }
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
  $scope.maxDate = new Date(2050, 5, 22);

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