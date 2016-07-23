(function(window, angular) {
    "use strict";
    angular.module('FileManagerApp').service('fileUploader', ['$http', '$q', 'fileManagerConfig', function ($http, $q, fileManagerConfig) {

        function deferredHandler(data, deferred, errorMessage) {
            if (!data || typeof data !== 'object') {
                return deferred.reject('Bridge response error, please check the docs');
            }
            if (data.result && data.result.error) {
                return deferred.reject(data);
            }
            if (data.error) {
                return deferred.reject(data);
            }
            if (errorMessage) {
                return deferred.reject(errorMessage);
            }
            deferred.resolve(data);
        }

        this.requesting = false; 
        this.requesting2 = false; 
        this.upload = function(fileList, path, auditoriaId) {
            if (! window.FormData) {
                throw new Error('Unsupported browser version');
            }
            var self = this;
            var form = new window.FormData();
            var deferred = $q.defer();
            form.append('destination', '/' + path.join('/'));
            form.append('id', auditoriaId);

            for (var i = 0; i < fileList.length; i++) {
                var fileObj = fileList.item(i);
                // fileObj instanceof window.File && form.append('file-' + i, fileObj);
                fileObj instanceof window.File && form.append('file', fileObj);
            }

            self.requesting = true;
            $http.post(fileManagerConfig.uploadUrl, form, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
            }).success(function(data) {
                deferredHandler(data, deferred);
            }).error(function(data) {
                deferredHandler(data, deferred, 'Unknown error uploading files');
            })['finally'](function(data) {
                self.requesting = false;
            });;

            return deferred.promise;
        };

        this.cargarUTE = function(fileList, path, auditoriaId) {
            if (! window.FormData) {
                throw new Error('Unsupported browser version');
            }
            var self = this;
            var form = new window.FormData();
            var deferred = $q.defer();
            form.append('destination', '/' + path.join('/'));
            form.append('id', auditoriaId);

            for (var i = 0; i < fileList.length; i++) {
                var fileObj = fileList.item(i);
                // fileObj instanceof window.File && form.append('file-' + i, fileObj);
                fileObj instanceof window.File && form.append('file', fileObj);
            }

            self.requesting = true;
            $http.post(fileManagerConfig.cargarUteUrl, form, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
            }).success(function(data) {
                deferredHandler(data, deferred);
            }).error(function(data) {
                deferredHandler(data, deferred, 'Unknown error uploading files');
            })['finally'](function(data) {
                self.requesting = false;
            });;

            return deferred.promise;
        };

        this.cargarCambioEstados = function(fileList) {
            if (! window.FormData) {
                throw new Error('Unsupported browser version');
            }
            var self = this;
            var form = new window.FormData();
            var deferred = $q.defer();
            form.append('destination', '/' + path.join('/'));
            form.append('id', auditoriaId);

            for (var i = 0; i < fileList.length; i++) {
                var fileObj = fileList.item(i);
                // fileObj instanceof window.File && form.append('file-' + i, fileObj);
                fileObj instanceof window.File && form.append('file', fileObj);
            }

            self.requesting = true;
            $http.post(fileManagerConfig.cargarInformeUrl, form, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
            }).success(function(data) {
                deferredHandler(data, deferred);
            }).error(function(data) {
                deferredHandler(data, deferred, 'Unknown error uploading files');
            })['finally'](function(data) {
                self.requesting = false;
            });;

            return deferred.promise;
        };

        this.cargarComprobante = function(fileList, path, auditoriaId, medida) {
            if (! window.FormData) {
                throw new Error('Unsupported browser version');
            }
            var self = this;
            var form = new window.FormData();
            var deferred = $q.defer();
            form.append('destination', '/' + path.join('/'));
            form.append('id', auditoriaId);
            form.append('medida', medida);


            for (var i = 0; i < fileList.length; i++) {
                var fileObj = fileList.item(i);
                // fileObj instanceof window.File && form.append('file-' + i, fileObj);
                fileObj instanceof window.File && form.append('file', fileObj);
            }

            self.requesting = true;
            $http.post(fileManagerConfig.cargarComprobanteUrl, form, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
            }).success(function(data) {
                deferredHandler(data, deferred);
            }).error(function(data) {
                deferredHandler(data, deferred, 'Unknown error uploading files');
            })['finally'](function(data) {
                self.requesting = false;
            });;

            return deferred.promise;
        };

        this.cargarPlanillaSeguimiento = function(fileList, path, auditoriaId) {
            if (! window.FormData) {
                throw new Error('Unsupported browser version');
            }
            var self = this;
            var form = new window.FormData();
            var deferred = $q.defer();
            form.append('destination', '/' + path.join('/'));
            form.append('id', auditoriaId);

            for (var i = 0; i < fileList.length; i++) {
                var fileObj = fileList.item(i);
                fileObj instanceof window.File && form.append('file', fileObj);
            }

            self.requesting2 = true;
            $http.post(fileManagerConfig.cargarPlanillaSeguimientoUrl, form, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
            }).success(function(data) {
                deferredHandler(data, deferred);
            }).error(function(data) {
                deferredHandler(data, deferred, 'Unknown error uploading files');
            })['finally'](function(data) {
                self.requesting2 = false;
            });;

            return deferred.promise;
        };

    }]);
})(window, angular);