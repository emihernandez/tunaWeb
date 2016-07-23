  'use strict';
  var SERVER_ERROR_CODES = {OK: 0, TIMEOUT: 5, ERR_UNKNOWN_EXCEPTION: 120};
  var ACTIONS = { CONTRATO_CREAR:0, CONTRATO_MODIFICAR:1, CONTRATO_BORRAR:2, 
                  ESTADO_CONTRATO_MODIFICAR:3, ES_ADMIN_SUPERVISOR:4, ES_ADMIN: 5}




                  /*PRODU_MODIFICAR:4, PRODU_BORRAR:5,
                  AUDIT_REALIZAR:6, ABM_USUARIOS:7, AUDIT_FINALIZAR:8,
                  INFORME_APROBAR:9 }*/
  var language = {
                      "sEmptyTable":     "No existen registros",
                      "sInfo":           "_START_ - _END_ de _TOTAL_ registros",
                      "sInfoEmpty":      "0 a 0 de 0 registros",
                      //"sInfoFiltered":   "(filtrado de _MAX_ registros totales)",
                      "sInfoFiltered":   "",
                      "sInfoPostFix":    "",
                      "sInfoThousands":  ",",
                      "sLengthMenu":     "Ver _MENU_ registros",
                      "sLoadingRecords": "Cargando...",
                      "sProcessing":     "Procesando...",
                      "sSearch":         "Buscar:",
                      "sZeroRecords":    "No existen registros con el criterio de busqueda",
                      "oPaginate": {
                          "sFirst":    "Primero",
                          "sLast":     "Ultimo",
                          "sNext":     "Siguiente",
                          "sPrevious": "Anterior"
                      },
                      "oAria": {
                          "sSortAscending":  ": ascendente",
                          "sSortDescending": ": descendente"
                      }
                  };
                   // "sSortAscending":  ": activate to sort column ascending",
                          // "sSortDescending": ": activate to sort column descending"
                             
  var errorMsg = function BEAUTIFY_ERR_MSG(errcode) {
    var outmsg = '';

    switch (errcode) {
      case SERVER_ERROR_CODES.ERR_UNKNOWN_EXCEPTION:
      outmsg = 'Error interno de comunicacion';
      break;
    }
    return outmsg;
  };
  angular.module('sbAdminApp')
    .constant('SERVER_ERROR_CODES', SERVER_ERROR_CODES)
    .constant('SERVER_CONSTANTS', {
       // SERVER_URL: 'http://server.spel-soft.com/server',
      // SERVER_URL: 'http://server.spel-soft.com/server',
      SERVER_URL: 'http://localhost:8080/tuna/rest',
      SERVER_TIMEOUT: 15,
      DEBUGMODE: true,
      BEAUTIFY_ERR_MSG: errorMsg
    } )
    .constant('VIEW_CONSTANTS', {
      language:language,
      ACTIONS:ACTIONS
    });


