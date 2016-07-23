'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AgendaCtrl
 * @description
 * # AgendaCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('AgendaCtrl', function($scope, $rootScope, $filter, $modal, $state, $modalStack, $localStorage,$compile, VariablesComunes, Agenda, AuthService, ngToast, DTOptionsBuilder, DTColumnBuilder, SERVER_CONSTANTS, VIEW_CONSTANTS ) {

    ngToast.settings.verticalPosition = 'bottom';
    ngToast.settings.horizontalPosition = 'right';
    ngToast.settings.maxNumber = 3;
        
     /* event source that contains custom events on the scope */
    $scope.events = [];
    $scope.eventosEditar = [];
    $scope.eventsTmp = [];
    var date = new Date();
    var d = date.getDate();
    var mesActual = date.getMonth();
    var anoActual = date.getFullYear();
    $scope.dtInstance = {};
    var serverUrl = SERVER_CONSTANTS.SERVER_URL;
         
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
         // Either you specify the AjaxDataProp here
        // dataSrc: 'data',
         url: serverUrl + '/agenda/eventosUsuario?username=' + AuthService.authData.tokenData.username,
         type: 'GET', 
         beforeSend: function(xhr){xhr.setRequestHeader('X-AUTH-TOKEN', $localStorage.tokenData.token);},
         contentType: "application/json"
        })
        .withOption('processing', true)
        .withOption('searching', false)
        .withOption('ordering', false)
        .withOption('lengthChange', false)
        //.withOption('serverSide', true)
        .withOption('createdRow', function(row, data, dataIndex) {
          $compile(angular.element(row).contents())($scope);
        })
        .withOption("paging", true)
        .withLanguage(VIEW_CONSTANTS.language);
        
    $scope.dtColumns =  [
              //DTColumnBuilder.newColumn('id').withTitle('Id'),
              DTColumnBuilder.newColumn('fecha').withTitle('Fecha').notSortable().renderWith(function(data, type, full, meta) {
                var date = new Date(full.fecha);
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
                var dd  = date.getDate().toString(); 
                return  ((dd<10?'0':'') +dd)  + '/' +  ((mm<10?'0':'') +mm) + '/' + yyyy+ ' ' + date.getHours() +':' + ((date.getMinutes()<10?'0':'') +date.getMinutes())
              }),
              DTColumnBuilder.newColumn('auditoria.productor.razonSocial').withTitle('Razón social').notSortable(),
              DTColumnBuilder.newColumn('tipo').withTitle('Tipo').notSortable()
              .renderWith(function(data, type, full, meta) {
                  var sTipo = 0;
                  switch(full.tipo){
                    case "1":
                      sTipo = 'Realizar auditoría';
                      break;
                    case "2":
                      sTipo = 'Entregar informe';
                      break;
                    case "3":
                      sTipo = 'Realizar seguimiento';
                      break;
                    case "4":
                      sTipo = 'General';
                      break;
                  }
                  return sTipo;
              }),
              DTColumnBuilder.newColumn('titulo').withTitle('Título').notSortable(),
              DTColumnBuilder.newColumn('descripcion').withTitle('Descripción').notSortable(),
              DTColumnBuilder.newColumn('estado').withTitle('Estado').notSortable(),
              DTColumnBuilder.newColumn(null).withTitle('Acción').notSortable()
              .renderWith(function(data, type, full, meta) {
                  $scope.eventosEditar[data.id] = data;
                  if (full.estado == 'REALIZADO'){
                    return  '<a ng-click="editarMiEvento(' + data.id + ')">' + "Ver" + '</a>'
                  } else {
                    return  '<a ng-click="editarMiEvento(' + data.id + ')">' + "Editar | " + '</a>' +
                            '<a ng-click="completarMiEvento(' + data.id + ')">' + "Completar | " + '</a>' +
                            '<a ng-click="borrarMiEvento(' + data.id + ')">' + "Borrar" + '</a>'
                  }
                  
              })
            ];

    $scope.borrarMiEvento = function (id) {
      var body = 'Desea borrar el evento ?';
      var title = 'Borrar evento';
      var id = id;
      var modalInstance = $modal.open({
        templateUrl: 'views/agenda/borrarEventoModal.html',
        controller: 'BorrarEventoCtrl',
        resolve: { obtenerTitulo: function () {
                  return title;
                  },
                  obtenerBody: function () {
                    return body;
                  },
                  obtenerId: function () {
                    return id;
                  }
          }
      });
      modalInstance.result.then(function (tanque) {
  
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.completarMiEvento = function (id) {  
      Agenda.completarEvento(id).then(
        function(res){
          ngToast.success('Evento completado correctamente');
          VariablesComunes.eventoData = {};
          $state.go("dashboard.agenda", {}, { reload: true });
        },
        function(error){
          ngToast.danger('Error al crear evento');
          console.log("Error al completar evento : " + JSON.stringify(error));
        });
    };

    $scope.editarMiEvento = function(id){
      var event = $scope.eventosEditar[id];
      var title = 'Ver evento';
      var fecha = new Date(event.fecha);
      var mes = fecha.getMonth();
      var ano = fecha.getYear();
      var modalInstance = $modal.open({
        templateUrl: 'views/agenda/crearEvento.html',
        controller: 'CrearEventoCtrl',
        resolve: {
            obtenerFecha: function () {
              return fecha;
            },
            obtenerTitle: function () {
              return title;
            },
            obtenerDescripcion: function () {
              return event.descripcion;
            },
            obtenerTitulo: function () {
              return event.titulo;
            },
            obtenerTipo: function () {
              return event.tipo;
            },
            obtenerEstado: function () {
              return event.estado;
            },
            obtenerId: function () {
              return event.id;
            },
            obtenerAuditoriaId: function () {
              return event.auditoria.id;
            },
            obtenerMatricula: function () {
              return event.auditoria.productor.matricula;
            },
            obtenerRazonSocial: function () {
              return event.auditoria.productor.razonSocial;
            },
            obtenerAsignado: function () {
              return event.asignado.username;
            },
            obtenerNuevoEvento: function () {
              return false;
            }
          }
      });
      modalInstance.result.then(function () {
        $scope.getEventosMes(ano, mes, null);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };


    $scope.getEventColor = function(tipo){
      var color = 'blue';
      switch(tipo){
        case "1":
          color = '#ff7701';
          break;
        case "2":
          color = '#3c8dbc';
          break;
        case "3":
          color = '#a56650';
          break;
        case "4":
          color = '#3a87ad';
          break;
      }
      return color;
    }
    $scope.getEventosMes = function(ano, mes, callback){
      
      //$scope.dtInstance.reloadData();
      
      var mesActual;
      if(mes<10){
        mesActual = ano + "-0" + (mes +1)+ "-01 00:00:00";
      }else{
        mesActual = ano + "-" + (mes +1)+ "-01 00:00:00";
      }
      $scope.myPromise = Agenda.eventosMes(mesActual).then(
        function(res){
          $scope.events.splice(0, $scope.events.length)
          $scope.eventsTmp = [];
          for(var i=0; i< res.data.length; i++){
            var eventTmp = {};
            eventTmp.id = res.data[i].id;
            eventTmp.title =  res.data[i].asignado.username + '-' + ((res.data[i].titulo!=null)?res.data[i].titulo:'');
            eventTmp.auditoriaId =  res.data[i].auditoria.id;
            eventTmp.matricula =  res.data[i].auditoria.productor.matricula;
            eventTmp.username =  res.data[i].asignado.username;
            eventTmp.titulo =  res.data[i].titulo;
            eventTmp.descripcion =  res.data[i].descripcion;
            eventTmp.tipo = res.data[i].tipo;
            eventTmp.estado = res.data[i].estado;
            eventTmp.start =  new Date(res.data[i].fecha);
            eventTmp.className =  'test';
            eventTmp.color = $scope.getEventColor(res.data[i].tipo);
            eventTmp.allDay = false;
            $scope.eventsTmp[i] = eventTmp;
            $scope.events.push(eventTmp);            
          }
          if(callback!==null){
            callback($scope.events);
          }
        },
        function(error){
          console.log("getEventosMes error : " + JSON.stringify(error));
        });
    }
    $scope.calEventsExt = {  };
    
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var fecha = start.toDate();
      //$scope.getEventosMes(fecha.getFullYear(), fecha.getMonth(), callback);
      // .then(function () {
               callback($scope.events);
            // }
      // );
    };


    
    $scope.eventClick = function( event, jsEvent, view){
      
      var title = 'Ver evento';
      var fecha = event.start.toDate();
      var mes = fecha.getMonth();
      var ano = fecha.getYear();
      var modalInstance = $modal.open({
        templateUrl: 'views/agenda/crearEvento.html',
        controller: 'CrearEventoCtrl',
        resolve: {
            obtenerFecha: function () {
              return fecha;
            },
            obtenerTitle: function () {
              return title;
            },
            obtenerDescripcion: function () {
              return event.descripcion;
            },
            obtenerTitulo: function () {
              return event.titulo;
            },
            obtenerTipo: function () {
              return event.tipo;
            },
            obtenerEstado: function () {
              return event.estado;
            },
            obtenerId: function () {
              return event.id;
            },
            obtenerAuditoriaId: function () {
              return event.auditoriaId;
            },
            obtenerMatricula: function () {
              return event.matricula;
            },
            obtenerRazonSocial: function () {
              return event.razonSocial;
            },
            obtenerAsignado: function () {
              return event.username;
            },
            obtenerNuevoEvento: function () {
              return false;
            }
          }
      });
      modalInstance.result.then(function () {
        $scope.getEventosMes(ano, mes, null);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
      
    $scope.openModalNewEvent = function(fecha){
      var title = 'Crear evento';
      var tipo = '1';
      var auditoriaId = $scope.auditoriaId;
      var matricula = $scope.matricula;
      var razonSocial = $scope.razonSocial;
      var mes = fecha.getMonth();
      var ano = fecha.getYear();
      var username = AuthService.authData.tokenData.username;
      var modalInstance = $modal.open({
        templateUrl: 'views/agenda/crearEvento.html',
        controller: 'CrearEventoCtrl',
        resolve: {
            obtenerFecha: function () {
              return fecha;
            },
            obtenerTitle: function () {
              return title;
            },
            obtenerTitulo: function () {
              return '';
            },
            obtenerDescripcion: function () {
              return '';
            },
            obtenerTipo: function () {
              return tipo;
            },
            obtenerEstado: function () {
              return '';
            },
            obtenerAuditoriaId: function () {
              return auditoriaId;
            },
            obtenerId: function () {
              return '';
            },
            obtenerNuevoEvento: function () {
              return true;
            },
            obtenerRazonSocial: function () {
              return razonSocial;
            },
            obtenerMatricula: function () {
              return matricula;
            },
            obtenerAsignado: function () {
              return username;
            }
          }
      });
      modalInstance.result.then(function () {
        $scope.getEventosMes(ano, mes, null);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }
    $scope.dayClick = function( date, jsEvent, view){      
      var fecha = date.toDate();
      fecha.setDate(fecha.getDate() + 1); //+1 day
      $scope.openModalNewEvent(fecha);
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(anoActual, mesActual, 28),
        end: new Date(anoActual, mesActual, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    
    $scope.eventSources = [$scope.calEventsExt, $scope.eventsF, $scope.events];
   
    $scope.uiConfig = {
      calendar:{
        height: "100%",
        editable: false,
        disableDragging: true,
        header:{
          left: 'month agendaWeek agendaDay', //basicWeek basicDay
          center: 'title',
          right: 'today prev,next'
        },
        lang: 'es',
        dayNames : ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
        dayNamesShort : ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"],
        monthNames : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"],
        buttonText: {
                        today:    'Hoy',
                        month:    'Mes',
                        week:     'Semana',
                        day:      'Día'
                    },
        monthNamesShort : ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
        dayClick: $scope.dayClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventClick:  $scope.eventClick
        // viewRender: function(view, element) {
            // console.log("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
        // }
      }
    };
    
    $scope.getEventosMes(anoActual,mesActual, null);
    if(VariablesComunes.eventoData.date !== undefined && VariablesComunes.eventoData.date !== ''){
      $scope.auditoriaId = VariablesComunes.eventoData.eventoAuditoriaSeleccionada;
      $scope.matricula = VariablesComunes.eventoData.eventoAuditoriaSeleccionadaMatricula;
      $scope.razonSocial = VariablesComunes.eventoData.eventoAuditoriaSeleccionadaRazonSocial;
      $scope.openModalNewEvent(VariablesComunes.eventoData.date);
    }
  
  });



  
angular.module('sbAdminApp').directive('datepickerPopup', function (dateFilter, datepickerPopupConfig) {
  return {
    restrict: 'A',
    priority: 1,
    require: 'ngModel',
    link: function(scope, element, attr, ngModel) {
      var dateFormat = attr.datepickerPopup || datepickerPopupConfig.datepickerPopup;
      ngModel.$formatters.push(function (value) {
        return dateFilter(value, dateFormat);
      });
    }
  };
});
angular.module('sbAdminApp').controller('BorrarEventoCtrl', function ($scope, $modalInstance,$modalStack, $state, ngToast, Agenda, obtenerTitulo, obtenerBody, obtenerId) {
    $scope.id = obtenerId;
    $scope.title = obtenerTitulo;
    $scope.body = obtenerBody;

    $scope.ok = function () {
      Agenda.eliminarEvento($scope.id)
        .then(function(){
            ngToast.success('Evento eliminado correctamente');
            $modalStack.dismissAll()
            $state.go("dashboard.agenda", {}, { reload: true });
        }, 
              function(){
              ngToast.danger('Error al eliminar evento');
          
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
angular.module('sbAdminApp').controller('CrearEventoCtrl', function ($scope,  $modal, $modalInstance, $state, $filter, Agenda, AuthService, ngToast,
                                        VariablesComunes, obtenerId,obtenerFecha, obtenerAsignado, obtenerMatricula, obtenerRazonSocial, obtenerTitle, obtenerTitulo, obtenerDescripcion, obtenerTipo, obtenerAuditoriaId, obtenerEstado, obtenerNuevoEvento) {
  
  
    $scope.getTipoToStr = function(tipo){
      var sTipo = 0;
      switch(tipo){
        case "1":
          sTipo = 'Realizar auditoría';
          break;
        case "2":
          sTipo = 'Entregar informe';
          break;
        case "3":
          sTipo = 'Realizar seguimiento';
          break;
        case "4":
          sTipo = 'General';
          break;
      }
      return sTipo;
    }
    $scope.bNuevoEvento = obtenerNuevoEvento;
    $scope.id =  obtenerId;
    $scope.auditoriaId =  obtenerAuditoriaId;
    $scope.datosIsCollapsed = true;
    if($scope.auditoriaId != undefined){
      $scope.datosIsCollapsed = false;
    }
    
    $scope.fechaDate =  obtenerFecha;
    $scope.horaDate =  obtenerFecha;
    $scope.fecha =  $filter('date')($scope.fechaDate, "dd/MM/yyyy");
    $scope.hora  =  $filter('date')($scope.fechaDate, "hh:mm a");
    $scope.title = obtenerTitle;
    $scope.titulo = obtenerTitulo;
    $scope.asignado = obtenerAsignado;
    $scope.matricula = obtenerMatricula;
    $scope.razonSocial = obtenerRazonSocial;
    $scope.descripcion = obtenerDescripcion;
    $scope.tipo = $scope.getTipoToStr(obtenerTipo);
    $scope.estado = obtenerEstado;
    
    if (!$scope.estado){
      $scope.bMostrarCompletar = false;
    } else {
      $scope.bMostrarCompletar = ($scope.estado!='REALIZADO') && ($scope.asignado==AuthService.authData.tokenData.username);
    }

    $scope.bMostrarBorrar  = (!$scope.bNuevoEvento && ($scope.asignado==AuthService.authData.tokenData.username) && ($scope.bMostrarCompletar));
    $scope.bMostrarGuardar = ($scope.bNuevoEvento || (($scope.asignado==AuthService.authData.tokenData.username)) && ($scope.bMostrarCompletar));
    
    
    $scope.formData = {};
    $scope.data = {};
    $scope.data.isOpen =false;
       
    $scope.fechaSeleccionada = function(tipo){
      var fechaTotal = new Date($scope.fechaDate.getFullYear(), $scope.fechaDate.getMonth(), $scope.fechaDate.getDate(),  $scope.horaDate.getHours(), $scope.horaDate.getMinutes(), $scope.horaDate.getSeconds(), 0);
      return fechaTotal; //$scope.fecha + $scope.hora;
    }
    $scope.getTipo = function(tipo){
      var iTipo = 0;
      switch(tipo){
        case 'Realizar auditoría':
          iTipo = 1;
          break;
        case 'Entregar informe':
          iTipo = 2;
          break;
        case 'Realizar seguimiento':
          iTipo = 3;
          break;
        case 'General':
          iTipo = 4;
          break;
      }
      return iTipo;
    }
    $scope.fechaChanged = function () {
      var fecha = $filter('date')($scope.fechaDate, "dd/MM/yyyy");
      $scope.fecha = fecha;
    };   
    $scope.horaChanged = function () {
     var hora = $filter('date')($scope.horaDate, "hh:mm a");
     $scope.hora = hora;
   };

   $scope.completar = function () {
      var evento ={};
      evento.id = $scope.id;
      evento.auditoriaId = $scope.auditoriaId;
      evento.fecha =  $scope.fechaSeleccionada();
      evento.tipo = $scope.getTipo($scope.tipo);
      evento.titulo = $scope.titulo;
      evento.descripcion = $scope.descripcion;
      evento.estado = 0;      

      Agenda.completarEvento(evento.id).then(
        function(res){
          ngToast.success('Evento completado correctamente');
          $modalInstance.close();
          VariablesComunes.eventoData = {};
          $state.go("dashboard.agenda", {}, { reload: true });
        },
        function(error){
          ngToast.danger('Error al crear evento');
          console.log("Error al completar evento : " + JSON.stringify(error));
        });
    };
    
    $scope.ok = function () {
      var evento ={};
      evento.id = $scope.id;
      evento.auditoriaId = $scope.auditoriaId;
      evento.fecha =  $scope.fechaSeleccionada();
      evento.tipo = $scope.getTipo($scope.tipo);
      evento.titulo = $scope.titulo;
      evento.descripcion = $scope.descripcion;
      evento.estado = 0;      

      if ( $scope.bNuevoEvento ){
        Agenda.crearEvento($scope.auditoriaId,evento).then(
          function(res){
            ngToast.success('Evento creado correctamente');
            $modalInstance.close();
            VariablesComunes.eventoData = {};
            $state.go("dashboard.agenda", {}, { reload: true });
          },
          function(error){
            ngToast.danger('Error al crear evento');
            console.log("crearEvento error : " + JSON.stringify(error));
          });
          
      }else{
        
        Agenda.modificarEvento(evento).then(
          function(res){
            ngToast.success('Evento modificado correctamente');
            $modalInstance.close();
            $state.go("dashboard.agenda", {}, { reload: true });
          },
          function(error){
            ngToast.danger('Error al modificar evento');
          });
        
      }
    };

    $scope.goToBuscar = function () {
      VariablesComunes.eventoData.date = $scope.fechaDate;
      $modalInstance.dismiss('cancel');
      $state.go("dashboard.eventoBuscarAuditoria", {}, { reload: true });
    }
    $scope.cancel = function () {
      VariablesComunes.eventoData = {};
      $modalInstance.dismiss('cancel');
    };
    
    $scope.borrarEventoModal = function () {
      var body = 'Desea borrar el evento ?';
      var title = 'Borrar evento';
      var id = $scope.id;
      var modalInstance = $modal.open({
        templateUrl: 'views/agenda/borrarEventoModal.html',
        controller: 'BorrarEventoCtrl',
        resolve: { obtenerTitulo: function () {
                  return title;
                  },
                  obtenerBody: function () {
                    return body;
                  },
                  obtenerId: function () {
                    return id;
                  }
          }
      });
      modalInstance.result.then(function (tanque) {
  
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
  });

