
angular.module('sbAdminApp')
    .factory('IndexedDB', function($http,$q, SERVER_CONSTANTS) {

  const dbName = "sgdae";
  var dataBase;
  var request; // = indexedDB.open(dbName, 2);

 
    
  initDB = function () {
    
    var deferred = $q.defer();
    if ( dataBase === undefined ){
      request = indexedDB.open(dbName, 2);
      request.onsuccess = function(event) {
        dataBase = event.target.result;
        deferred.resolve(event);
      }
      request.onerror = function(event) {
        // Handle errors.
        console.log('error');
        deferred.resolve(event);
      };
      request.onupgradeneeded = function(event) {
        dataBase = event.target.result;

        var objectStore = dataBase.createObjectStore("auditorias", { keyPath: "id" });

        objectStore.createIndex("filename", "filename", { unique: false });
        objectStore.createIndex("blob", "blob", { unique: true });

        objectStore.transaction.oncomplete = function(event) {
           console.log('oncomplete');
        };
        deferred.resolve(event);
      };
    } else {
      deferred.resolve(event);
    }
    return deferred.promise;
  }
  putFile = function (idFoto , blob) {

    var auditoria = {};
   // var idFoto = idAuditoria.toString() + '-' + seccion;
    auditoria.id = idFoto;
    auditoria.filename = idFoto;
    auditoria.blob = blob;
   
    
    var customerObjectStore = dataBase.transaction("auditorias", "readwrite").objectStore("auditorias");
    customerObjectStore.delete(idFoto);
    var request =  customerObjectStore.add(auditoria);

    request.onsuccess = function(event) {
        console.log(idFoto + " se guardo en la base de datos.");
    };
     
    request.onerror = function(event) {
        console.log(" Error al guardar en la base de datos " + idFoto );       
    }

    // Open a transaction to the database
   // var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
   // var transaction = dataBase.transaction([idAuditoria], readWriteMode);

    // Put the blob into the dabase
   // var put = transaction.objectStore(idAuditoria).put(blob, filename);            
  }
  getFile = function(idFoto){    
    
    var transaction = dataBase.transaction(["auditorias"]);
    var objectStore = transaction.objectStore("auditorias");
    
    //var idFoto = idAuditoria.toString() + '-' + seccion;
    
    var request = objectStore.get(idFoto);
    return request;
  
  }
  deleteFile = function(idAuditoria){
    var transaction = dataBase.transaction(["auditorias"], "readwrite");
    var objectStore = transaction.objectStore("auditorias");

    objectStore.delete(idAuditoria +'-Suministro electrico'); 
    objectStore.delete(idAuditoria +'-Instalacion electrica'); 
    objectStore.delete(idAuditoria +'-Maquina de ordene'); 
    objectStore.delete(idAuditoria +'-Ordene'); 
    objectStore.delete(idAuditoria +'-Sistema de frio');
    objectStore.delete(idAuditoria +'-Intercambiador de placas'); 
    objectStore.delete(idAuditoria +'-Calentamiento de agua'); 
    objectStore.delete(idAuditoria +'-Otros equipos'); 
  };
  
  deleteOneFile = function(idFoto){
    var transaction = dataBase.transaction(["auditorias"], "readwrite");
    var objectStore = transaction.objectStore("auditorias");

    objectStore.delete(idFoto); 
    
  };

    return{
        putFile: putFile,
        getFile: getFile,
        initDB: initDB,
        deleteFile:deleteFile,
        deleteOneFile:deleteOneFile
    }
});