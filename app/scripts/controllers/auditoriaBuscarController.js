'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AuditoriaBuscarCtrl
 * @description
 * # AuditoriaBuscarCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('AuditoriaBuscarCtrl', function($scope, $rootScope, $modal, $modalStack, $localStorage, $state, $sce, $timeout, $compile, $q, $stateParams, ngToast,
                                              DTOptionsBuilder, DTColumnBuilder, AuthService, Auditoria, Productor, Relevamiento,  VariablesComunes, VIEW_CONSTANTS, SERVER_CONSTANTS) {
  
    var vm = this;
   
    $scope.auditoriaStatusHTML = '';
     
    ngToast.settings.verticalPosition = 'bottom';
    ngToast.settings.horizontalPosition = 'right';
    ngToast.settings.maxNumber = 3;
    
      
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;

    $scope.auditoriasArray = [];
     
    $scope.auditoria = {} ;
    $scope.productor = {} ;
    $scope.child = {};
 
    $scope.auditoriaOpcionesAuditor = [{nombre:'Todos', text:'Todos'},{nombre:'kermit', text:'kermit'},{nombre:'auditorUser', text:'auditorUser'}];
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

    $scope.buscarAuditores = function(){
      Relevamiento.getAuditores().then(
        function(res){
            $scope.auditores = [];
            $scope.auditores[0] = {};
            $scope.auditores[0].nombre = 'Todos';
            $scope.auditores[0].text = 'Todos';
            var cantAuditores = res.data.length;
            for (var i = 0; i < cantAuditores; i ++){
              var cantAuditoresLength = $scope.auditores.length;
              $scope.auditores[cantAuditoresLength] = {};
              $scope.auditores[cantAuditoresLength].nombre = res.data[i].nombre + ' ' + res.data[i].apellido;
              $scope.auditores[cantAuditoresLength].text = res.data[i].username;
            }
            $scope.auditoriaOpcionesAuditor = $scope.auditores;
            $scope.auditorOpcionSeleccion = $scope.auditoriaOpcionesAuditor[0];

        },
        function(error){
          console.log("Buscar auditores error : " + JSON.stringify(res));
        });
    }

    $scope.buscarAuditores();

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
    $scope.verProductor = function(row){
      var matriculaProductor = $scope.auditoriasArray[row].matricula;
      console.log('verProductor clicked');
      $state.go('dashboard.productoresEditar', {matricula:matriculaProductor}, {reload:true});
    }  
    $scope.verAuditoria= function(row){
      var idAuditoria = $scope.auditoriasArray[row].id;
      console.log('verAuditoria clicked');
      $state.go('dashboard.auditoriasVer', {idAuditoria:idAuditoria}, {reload:true});
    }   
    $scope.seleccionarParaEvento= function(row){
      var idAuditoria = $scope.auditoriasArray[row].id;
      VariablesComunes.eventoData.eventoAuditoriaSeleccionada = idAuditoria;
      VariablesComunes.eventoData.eventoAuditoriaSeleccionadaMatricula = $scope.auditoriasArray[row].matricula;
      VariablesComunes.eventoData.eventoAuditoriaSeleccionadaRazonSocial = $scope.auditoriasArray[row].razonSocial;
      $state.go('dashboard.agenda', {}, {reload:true});
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
                 return  '<a ng-click="seleccionarParaEvento(' + meta.row + ')">' + full.id + '</a>'
              }),
              DTColumnBuilder.newColumn('fechaCreacion').withTitle('Fecha inicio').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="seleccionarParaEvento(' + meta.row + ')">' + full.fechaCreacion + '</a>'
              }),
              DTColumnBuilder.newColumn('fechaUltimoEstado').withTitle('Ultimo cambio de estado').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="seleccionarParaEvento(' + meta.row + ')">' + full.fechaUltimoEstado + '</a>'
              }),
              DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable()
              .renderWith(function(data, type, full, meta) {
                   return  $scope.getHtmlStatus( full.estado);
                }),
              DTColumnBuilder.newColumn('estadoUTE').withTitle('Estado UTE').notSortable(),
              DTColumnBuilder.newColumn('tipo').withTitle('Tipo').notSortable(),
              DTColumnBuilder.newColumn('matriculaProductor').withTitle('Matrícula').notSortable()
              .renderWith(function(data, type, full, meta) {
                 $scope.auditoriasArray[meta.row] = {};
                $scope.auditoriasArray[meta.row].matricula = full.matriculaProductor;
                return  '<a ng-click="seleccionarParaEvento(' + meta.row + ')"> '+ full.matriculaProductor + '</a>'
              }),
              DTColumnBuilder.newColumn('razonSocial').withTitle('Razón Social').notSortable()
              .renderWith(function(data, type, full, meta) {
                return  '<a ng-click="seleccionarParaEvento(' + meta.row + ')"> '+ full.razonSocial + '</a>'
              }),
              DTColumnBuilder.newColumn('tipoEstablecimiento').withTitle('Tamaño').notSortable(),
              DTColumnBuilder.newColumn('zona').withTitle('Zona').notSortable(),
              DTColumnBuilder.newColumn('null').withTitle('Seleccionar').notSortable()
              .renderWith(function(data, type, full, meta) {
               // $scope.auditoriasArray[meta.row] = {};
                $scope.auditoriasArray[meta.row].estado = full.estado;
                $scope.auditoriasArray[meta.row].accion = full.accion;
                $scope.auditoriasArray[meta.row].id = full.id;
                $scope.auditoriasArray[meta.row].matricula = full.matriculaProductor;
                $scope.auditoriasArray[meta.row].razonSocial = full.razonSocial;
                return  '<a ng-click="seleccionarParaEvento(' + meta.row + ')"> Seleccionar </a> '
              }) //style="align:center"<tr><td><a ng-click="accionClicked(0)">Relevamiento telefonico</a></tr></td>
            ];
    }else{
      $scope.dtColumns =  [
              DTColumnBuilder.newColumn('id').withTitle('Id').notSortable(),              
              DTColumnBuilder.newColumn('fechaCreacion').withTitle('Fecha inicio').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="seleccionarParaEvento(' + meta.row + ')">' + full.fechaCreacion + '</a>'
              }),
              DTColumnBuilder.newColumn('fechaUltimoEstado').withTitle('Ultimo cambio de estado').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="seleccionarParaEvento(' + meta.row + ')">' + full.fechaUltimoEstado + '</a>'
              }),
              DTColumnBuilder.newColumn('tipo').withTitle('Tipo').notSortable(),
              //DTColumnBuilder.newColumn('estado').withTitle('Estado'),
              DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable()
              .renderWith(function(data, type, full, meta) {
                   return  $scope.getHtmlStatus( full.estado);
                }),
              DTColumnBuilder.newColumn('estadoUTE').withTitle('Estado UTE').notSortable(),
              DTColumnBuilder.newColumn('matriculaProductor').withTitle('Matrícula').notSortable()
              .renderWith(function(data, type, full, meta) {
                $scope.auditoriasArray[meta.row] = {};
                $scope.auditoriasArray[meta.row].matricula = full.matriculaProductor;
                return  '<a ng-click="seleccionarParaEvento(' + meta.row + ')"> '+ full.matriculaProductor + '</a>'
              }),
              DTColumnBuilder.newColumn('razonSocial').withTitle('Razón Social').notSortable()
              .renderWith(function(data, type, full, meta) {
                return  '<a ng-click="seleccionarParaEvento(' + meta.row + ')"> '+ full.razonSocial + '</a>'
              }),
              DTColumnBuilder.newColumn('tipoEstablecimiento').withTitle('Tamaño').notSortable(),
              DTColumnBuilder.newColumn('zona').withTitle('Zona').notSortable(),
              DTColumnBuilder.newColumn('null').withTitle('Selecionar').notSortable()
              .renderWith(function(data, type, full, meta) {
                //$scope.auditoriasArray[meta.row] = {};
                $scope.auditoriasArray[meta.row].estado = full.estado;
                $scope.auditoriasArray[meta.row].accion = full.accion;
                $scope.auditoriasArray[meta.row].id = full.id;
                $scope.auditoriasArray[meta.row].matricula = full.matriculaProductor;
                $scope.auditoriasArray[meta.row].razonSocial = full.razonSocial;
                return  '<a ng-click="seleccionarParaEvento(' + meta.row + ')"> Selecionar </a>'
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
      $scope.filtroEstado.auditoriaRealizada = false;
      $scope.filtroEstado.informeFinalizado = false;
      $scope.filtroEstado.informeAprobado = false;
      $scope.filtroEstado.devolucionRealizada = false;
      $scope.filtroEstado.finalizada = false;

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
      if ($scope.filtroEstado.auditoriaRealizada){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Auditoria realizada/';
      }
      if ($scope.filtroEstado.informeFinalizado){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Informe realizado/';
      }
      if ($scope.filtroEstado.informeAprobado){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Informe de auditoria aprobado/';
      }
      if ($scope.filtroEstado.devolucionRealizada){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Devolucion finalizada/';
      }
      if ($scope.filtroEstado.finalizada){
        $scope.filtroEstado.string = $scope.filtroEstado.string + 'Auditoria finalizada/';
      }
    }

                       
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
   

    $scope.listarAuditorias = function(){ 
      Auditoria.getAuditoriaLista($scope.idAuditoria)
        .then(function(res){
          $scope.auditorias = res.data;
          console.log("getAuditoriaLista OK: ");
        });
    }   
 
  
});

