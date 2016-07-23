(function(window, angular, $) {
    "use strict";
    angular.module('FileManagerApp').controller('FileManagerCtrl', [
    '$scope', '$translate', '$cookies', 'fileManagerConfig', 'item', 'ngToast', 'fileNavigator', 'fileUploader',
    function($scope, $translate, $cookies, fileManagerConfig, Item, ngToast, FileNavigator, FileUploader) {

        $scope.config = fileManagerConfig;
        $scope.appName = fileManagerConfig.appName;

        $scope.reverse = false;
        $scope.predicate = ['model.type', 'model.name'];        
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate[1] === predicate) ? !$scope.reverse : false;
            $scope.predicate[1] = predicate;
        };

        $scope.query = '';
        $scope.temp = new Item();
        $scope.fileNavigator = new FileNavigator(fileManagerConfig.auditoriaId, fileManagerConfig.medida);
        $scope.fileUploader = FileUploader;
        $scope.uploadFileList = [];
        $scope.uploadInforme = [];
        $scope.uploadComprobante = [];
        $scope.uploadPlanillaSeguimiento = [];
        $scope.uploadFileListUTE = [];
        $scope.viewTemplate = $cookies.viewTemplate || 'main-table.html';
        $scope.requestingPlanillaSeguimiento = false;

        $scope.setTemplate = function(name) {
            $scope.viewTemplate = $cookies.viewTemplate = name;
        };

        $scope.changeLanguage = function (locale) {
            if (locale) {
                return $translate.use($cookies.language = locale);
            }
            $translate.use($cookies.language || fileManagerConfig.defaultLang);
        };

        $scope.touch = function(item) {
            item = item instanceof Item ? item : new Item();
            item.revert && item.revert();
            $scope.temp = item;
        };

        $scope.smartClick = function(item) {
            if (item.isFolder()) {
                return $scope.fileNavigator.folderClick(item);
            }
            if (item.isImage()) {
                return item.preview();
            }
            if (item.isEditable()) {
                item.getContent();
                $scope.touch(item);
                return $scope.modal('edit');
            }
        };

        $scope.modal = function(id, hide) {
            $('#' + id).modal(hide ? 'hide' : 'show')
        };

        $scope.isInThisPath = function(path) {
            var currentPath = $scope.fileNavigator.currentPath.join('/');
            return currentPath.indexOf(path) !== -1;
        };

        $scope.edit = function(item) {
            item.edit().then(function() {
                $scope.modal('edit', true);
            });
        };

        $scope.changePermissions = function(item) {
            item.changePermissions().then(function() {
                $scope.modal('changepermissions', true);
            });
        };

        $scope.copy = function(item) {
            var samePath = item.tempModel.path.join() === item.model.path.join();
            if (samePath && $scope.fileNavigator.fileNameExists(item.tempModel.name)) {
                item.error = $translate.instant('error_invalid_filename');
                return false;
            }
            item.copy().then(function() {
                $scope.fileNavigator.refresh();
                $scope.modal('copy', true);
            });
        };

        $scope.compress = function(item) {
            item.compress().then(function() {
                $scope.fileNavigator.refresh();
                if (! $scope.config.compressAsync) {
                    return $scope.modal('compress', true);
                }
                item.asyncSuccess = true;
            }, function() {
                item.asyncSuccess = false;
            });
        };

        $scope.extract = function(item) {
            item.extract().then(function() {
                $scope.fileNavigator.refresh();
                if (! $scope.config.extractAsync) {
                    return $scope.modal('extract', true);
                }
                item.asyncSuccess = true;
            }, function() {
                item.asyncSuccess = false;
            });
        };

        $scope.remove = function(item) {
            item.remove().then(function() {
                $scope.fileNavigator.refresh();
                $scope.modal('delete', true);
            });
        };

        $scope.rename = function(item) {
            var samePath = item.tempModel.path.join() === item.model.path.join();
            if (samePath && $scope.fileNavigator.fileNameExists(item.tempModel.name)) {
                item.error = $translate.instant('error_invalid_filename');
                return false;
            }
            item.rename().then(function() {
                $scope.fileNavigator.refresh();
                $scope.modal('rename', true);
            });
        };

        $scope.createFolder = function(item) {
            var name = item.tempModel.name && item.tempModel.name.trim();
            item.tempModel.type = 'dir';
            item.tempModel.path = $scope.fileNavigator.currentPath;
            item.tempModel.auditoriaId = $scope.fileNavigator.auditoriaId;
            if (name && !$scope.fileNavigator.fileNameExists(name)) {
                item.createFolder().then(function() {
                    $scope.fileNavigator.refresh();
                    $scope.modal('newfolder', true);
                });
            } else {
                $scope.temp.error = $translate.instant('error_invalid_filename');
                return false;
            }
        };

        $scope.uploadFiles = function() {
            $scope.fileUploader.upload($scope.uploadFileList, $scope.fileNavigator.currentPath, $scope.fileNavigator.auditoriaId).then(function() {
                $scope.fileNavigator.refresh();
                $scope.modal('uploadfile', true);
            }, function(data) {
                var errorMsg = data.result && data.result.error || $translate.instant('error_uploading_files');
                $scope.temp.error = errorMsg;
            });
        };

        $scope.cargarUTE = function() {
            $scope.fileUploader.cargarUTE($scope.uploadFileListUTE, $scope.fileNavigator.currentPath, $scope.fileNavigator.auditoriaId).then(function() {
                $scope.fileNavigator.refresh();
                $scope.modal('uploadfile', true);
                ngToast.success('Datos de UTE subidos correctamente');
            }, function(data) {
                var errorMsg = data.result && data.result.error || $translate.instant('error_uploading_files');
                $scope.temp.error = errorMsg;
            });
        };

        $scope.cargarInforme = function() {
            $scope.fileUploader.cargarInforme($scope.uploadInforme, $scope.fileNavigator.currentPath, $scope.fileNavigator.auditoriaId).then(function() {
                //$scope.fileNavigator.refresh();
                $scope.modal('uploadfile', true);
                ngToast.success('Informe cargado correctamente');
            }, function(data) {
                var errorMsg = data.result && data.result.error || $translate.instant('error_uploading_files');
                $scope.temp.error = errorMsg;
            });
        };

        $scope.cargarComprobante = function() {
            $scope.fileUploader.cargarComprobante($scope.uploadComprobante, $scope.fileNavigator.currentPath, $scope.fileNavigator.auditoriaId, $scope.fileNavigator.medida).then(function() {
                $scope.modal('uploadfile', true);
                ngToast.success('Comprobante cargado correctamente');
            }, function(data) {
                var errorMsg = data.result && data.result.error || $translate.instant('error_uploading_files');
                $scope.temp.error = errorMsg;
            });
        };

        $scope.cargarPlanillaSeguimiento = function() {
            $scope.fileUploader.cargarPlanillaSeguimiento($scope.uploadPlanillaSeguimiento, $scope.fileNavigator.currentPath, $scope.fileNavigator.auditoriaId).then(function() {
                $scope.modal('uploadfile', true);
                ngToast.success('Planilla de seguimiento cargada correctamente');
            }, function(data) {
                var errorMsg = data.result && data.result.error || $translate.instant('error_uploading_files');
                $scope.temp.error = errorMsg;
            });
        };

        $scope.getQueryParam = function(param) {
            var found;
            window.location.search.substr(1).split("&").forEach(function(item) {
                if (param ===  item.split("=")[0]) {
                    found = item.split("=")[1];
                    return false;
                }
            });
            return found;
        };

        $scope.changeLanguage($scope.getQueryParam('lang'));
        $scope.isWindows = $scope.getQueryParam('server') === 'Windows';
        $scope.fileNavigator.refresh();
    }]);
})(window, angular, jQuery);
