'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AuditoriaCtrl
 * @description
 * # AuditoriaCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MisAuditoriasCtrl', function($scope, $rootScope, $modal, $modalStack, $timeout, $compile, $q, $sce, $state, $stateParams, ngToast,
                                        DTOptionsBuilder, DTColumnBuilder, AuthService, Auditoria, Productor, Relevamiento, VariablesComunes,
                                        fileManagerConfig, RelevamientoAuditoria,VIEW_CONSTANTS) {
    
    ngToast.settings.verticalPosition = 'bottom';
    ngToast.settings.horizontalPosition = 'right';
    ngToast.settings.maxNumber = 3;

    //localStorage.clear();

    $scope.auditoria = {};
    $scope.productor = {};
    $scope.auditoriasArray = [];
    
    $scope.checkRol = function(accion){
      return AuthService.checkRol(accion);
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
          $scope.auditoria.relevamiento = res.data.relevamiento;
          $scope.auditoria.productor = res.data.productor;
          $scope.auditoria.motivo_cancelacion = res.data.motivo_cancelacion;
          if (res.data.estado === "Cancelada - No verifica condiciones financieras"){
            $scope.auditoria.motivo_cancelacion = "Productor no cumple condiciones financieras.";
          }

          if (res.data.productor.remisiones.length == 0) {
              $scope.auditoria.ultimaRemision = "No existen remisiones para este productor";
            }
          else {
              $scope.auditoria.ultimaRemision =  res.data.productor.remisiones[res.data.productor.remisiones.length-1].remision;
          } 
          
          console.log("Auditoria buscar successfully: " + JSON.stringify(res));
          //$mdToast.show($mdToast.simple().content(res.message));
         // $location.url('/locations');
        },
        function(error){
          console.log("Auditoria error : " + JSON.stringify(error));
        });
      
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

    $scope.verProductor= function(row){
      // var idAuditoria = aData.id;
      // var matricula = aData.matriculaProductor;
      var matriculaProductor = $scope.auditoriasArray[row].matricula;
      console.log('verProductor clicked');
      $state.go('dashboard.productoresEditar', {matricula:matriculaProductor}, {reload:true});
    }  
    
    
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
              DTColumnBuilder.newColumn('estadoUTE').withTitle('Estado UTE'),
              DTColumnBuilder.newColumn('null').withTitle('Accion').notSortable()
              .renderWith(function(data, type, full, meta) {
                $scope.auditoriasArray[meta.row] = {};
                $scope.auditoriasArray[meta.row].estado = full.estado;
                $scope.auditoriasArray[meta.row].accion = full.accion;
                $scope.auditoriasArray[meta.row].id = full.id;
                $scope.auditoriasArray[meta.row].matricula = full.matriculaProductor;
                  if (full.accion == 'Realizar auditoria') {
                    return  '<a ng-click="accionClicked(' + meta.row + ')">' + full.accion + '</a>&nbsp;'
                  } else { 
                    return full.accion
                  }
              }),
              DTColumnBuilder.newColumn('tipo').withTitle('Tipo'),
              DTColumnBuilder.newColumn('matriculaProductor').withTitle('Matricula')
              .renderWith(function(data, type, full, meta) {
                
                $scope.auditoriasArray[meta.row].matricula = full.matriculaProductor;
                return  '<a ng-click="verProductor(' + meta.row + ')"> '+ full.matriculaProductor + '</a>'
              }),
              DTColumnBuilder.newColumn('razonSocial').withTitle('Razon Social')
              .renderWith(function(data, type, full, meta) {
                return  '<a ng-click="verProductor(' + meta.row + ')"> '+ full.razonSocial + '</a>'
              }),
              DTColumnBuilder.newColumn('tipoEstablecimiento').withTitle('Tamaño'),
              DTColumnBuilder.newColumn('zona').withTitle('Zona'),
              DTColumnBuilder.newColumn('null').withTitle('Ver').notSortable()
              .renderWith(function(data, type, full, meta) {
                 return  '<a ng-click="verAuditoria(' + meta.row + ')"> Ver </a> | ' + 
                         '<a ng-click="verHistoricoAuditoria(' + meta.row + ')"> Historico </a>'
              }) //style="align:center"<tr><td><a ng-click="accionClicked(0)">Relevamiento telefonico</a></tr></td>
            ];

    $scope.listarAuditorias = function(){ 
      var deferred = $q.defer();
      if ($scope.bConnected) {
        Auditoria.getAuditoriasAuditor(AuthService.authData.tokenData.username)
          .then(function(res){
            $scope.listadoDataAuditoriasAuditor = res.data;
            console.log("Se trajeron auditorias del auditor OK: ");
            

            $scope.auditoriasOffline = [];
            var cantAuditorias = $scope.listadoDataAuditoriasAuditor.length;
            for (var i = 0; i < cantAuditorias; i++) {
                $scope.auditoriasOffline[i] = {};
                $scope.auditoriasOffline[i].auditoria = $scope.listadoDataAuditoriasAuditor[i].auditoria;
                $scope.auditoriasOffline[i].productor = $scope.listadoDataAuditoriasAuditor[i].productor;
                $scope.auditoriasOffline[i].dataListado = $scope.listadoDataAuditoriasAuditor[i].dataListado;
            }

            $scope.auditorias = [];
            var cantAuditorias = $scope.auditoriasOffline.length;
            for (var i = 0; i < cantAuditorias; i++) {
                $scope.auditorias[i] = $scope.auditoriasOffline[i].dataListado;
            }

            localStorage.setItem("auditorias", JSON.stringify($scope.auditoriasOffline));

            deferred.resolve($scope.auditorias);

          }); 
        return deferred.promise;
      } else {   
          $scope.auditoriasOffline = JSON.parse(localStorage.auditorias);
          $scope.auditorias = [];
          var cantAuditorias = $scope.auditoriasOffline.length;
          for (var i = 0; i < cantAuditorias; i++) {
              $scope.auditorias[i] = $scope.auditoriasOffline[i].dataListado;
          }

          deferred.resolve($scope.auditorias);    
          return deferred.promise;
      }
    }

    $scope.dtOptions =  DTOptionsBuilder.fromFnPromise($scope.listarAuditorias)
                          .withDataProp('auditorias')
                          .withOption("bAutoWidth", true)
                          .withOption("paging", true)
                          .withOption('ordering', false)
                          .withOption('processing', true)
                          .withOption('createdRow', function(row, data, dataIndex) {
                            $compile(angular.element(row).contents())($scope);
                          })
                          .withLanguage(VIEW_CONSTANTS.language);              
   

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

   

   $scope.listarAuditorias = function(){ 
      Auditoria.getAuditoriaLista($scope.idAuditoria)
        .then(function(res){
          $scope.auditorias = res.data;
          console.log("getAuditoriaLista OK: ");
        });
    }   


    if( $stateParams.idAuditoria !== undefined && $stateParams.idAuditoria !== '' ) {
      Auditoria.idRelevamiento= $stateParams.idAuditoria
      $scope.buscarAuditoria();

    }
    
    $scope.accionClicked = function(row){
      var idAuditoria = $scope.auditoriasArray[row].id;
      console.log('accionClicked clicked');
      if ($scope.auditoriasArray[row].accion == 'Realizar auditoria'){ 
        $state.go('dashboard.auditoriasRealizar', {idAuditoria:idAuditoria}, {reload:true});
      } else {
        ngToast.warning('No tiene permisos para realizar esta tarea');
      }
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

    $scope.obtenerZonas = function(){ 
       
      Productor.getZonas()
        .then(
        function(res){
          //$scope.zonas = res.data;   
          localStorage.setItem("zonas", JSON.stringify(res.data));          
        },
        function(error){
          console.log("obtenerZonas error : " + JSON.stringify(error));
        });
    }
    if($scope.bConnected){
      $scope.obtenerZonas();
    }
});