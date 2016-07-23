
angular.module('sbAdminApp')
    .factory('IndexedDB', function($http,SERVER_CONSTANTS) {

   // IndexedDB
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
        IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
        dbVersion = 1.0;

    var dataBase;
    var objectStore;
    
    createObjectStore = function (db) {
        // Create an objectStore
        console.log("Creating objectStore", { keyPath: "id" })
        db.createObjectStore("auditorias");
        db.createIndex("filename", "filename", { unique: false });
        db.createIndex("blob", "blob", { unique: false });
        
        // Store values in the newly created objectStore.
        // var customerObjectStore = dataBase.transaction("auditorias", "readwrite").objectStore("auditorias");
        // customerObjectStore.add(auditoria);

    }
    // Create/open database
    createDB = function() {
      var db = indexedDB.open("auditorias", dbVersion);
      db.onsuccess = function (event) {
        console.log("Success creating/accessing IndexedDB database");
        // dataBase = event.target.result;
        dataBase = db.result;
        
        if (dataBase.version != dbVersion) {
            var setVersion = dataBase.setVersion(dbVersion);
            setVersion.onsuccess = function () {
                objectStore = dataBase.createObjectStore("auditorias", { keyPath: "id" });
                objectStore.createIndex("filename", "filename", { unique: false });
                objectStore.createIndex("blob", "blob", { unique: false });
            };
        }
        
        objectStore = dataBase.createObjectStore("auditorias", { keyPath: "id" });
        objectStore.createIndex("filename", "filename", { unique: false });
        objectStore.createIndex("blob", "blob", { unique: false });
        
        dataBase.onerror = function (event) {
            console.log("Error creating/accessing IndexedDB database");
        }
      }
      db.onerror = function (event) {
          console.log("Error creating/accessing IndexedDB database");
      }
      db.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
        // dataBase = event.target.result;
        
      
        // //dataBase.onsuccess = function (event) {
          // objectStore = dataBase.createObjectStore("auditorias", { keyPath: "id" });
          // objectStore.createIndex("filename", "filename", { unique: false });
          // objectStore.createIndex("blob", "blob", { unique: false });
        // //}
        // dataBase.onerror = function (event) {
            // console.log("Error creating/accessing IndexedDB database");
        // }
      }
    }
    //   db,



    putFile = function (idAuditoria, filename, blob) {
        console.log("Putting elephants in IndexedDB");
        
       var auditoria = {};
       auditoria.id = idAuditoria;
       auditoria.filename = filename;
       auditoria.blob = blob;
       
       var customerObjectStore = dataBase.transaction("auditorias", "readwrite").objectStore("auditorias");
        customerObjectStore.add(auditoria);

        // Open a transaction to the database
        var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
        var transaction = dataBase.transaction([idAuditoria], readWriteMode);

        // Put the blob into the dabase
        var put = transaction.objectStore(idAuditoria).put(blob, filename);            
    }
    getFile = function(idAuditoria, filename){
        // Retrieve the file that was just stored
        transaction.objectStore(idAuditoria).get(filename);
        // .onsuccess = function (event) {
            // var imgFile = event.target.result;
            // console.log("Got elephant!" + imgFile);

            // // Get window.URL object
            // var URL = window.URL || window.webkitURL;
            // // Create and revoke ObjectURL
            // var imgURL = URL.createObjectURL(imgFile);
            // // Set img src to ObjectURL
            // var imgElephant = document.getElementById("elephant");
            // imgElephant.setAttribute("src", imgURL);

            // // Revoking ObjectURL
            // imgElephant.onload = function() {
                // window.URL.revokeObjectURL(this.src);
            // }
        // };
    }

    // request.onerror = function (event) {
        // console.log("Error creating/accessing IndexedDB database");
    // };

    // request.onsuccess = function (event) {
        // console.log("Success creating/accessing IndexedDB database");
        // dataBase = request.result;

        // dataBase.onerror = function (event) {
            // console.log("Error creating/accessing IndexedDB database");
        // };
        
    // }
        createDB();
        
        // Interim solution for Google Chrome to create an objectStore. Will be deprecated
        // if (dataBase.setVersion) {
            // if (dataBase.version != dbVersion) {
                // var setVersion = dataBase.setVersion(dbVersion);
                // setVersion.onsuccess = function () {
                    // objectStore = dataBase.createObjectStore("auditorias", { keyPath: "id" });
                    // objectStore.createIndex("filename", "filename", { unique: false });
                    // objectStore.createIndex("blob", "blob", { unique: false });
                    
                    // // getImageFile();
                // };
            // }
            // // else {
                // // getImageFile();
            // // }
        // }
        // else {
            // getImageFile();
        // }
    
    
    // For future use. Currently only in latest Firefox versions
    // request.onupgradeneeded = function (event) {
        // createObjectStore(event.target.result);
    // };
    

    return{
        putFile: putFile,
        getFile: getFile,
        createObjectStore:createObjectStore
    }
});