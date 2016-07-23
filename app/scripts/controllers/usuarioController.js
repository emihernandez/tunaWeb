'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:InformeCtrl
 * @description
 * # InformeCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('UsuarioCtrl', function($scope, $rootScope, $modal, $modalStack, ngToast, $timeout, $compile, $q, $state, $stateParams,
                                            DTOptionsBuilder, DTColumnBuilder, VIEW_CONSTANTS, Usuario) {

    ngToast.settings.verticalPosition = 'bottom';
    ngToast.settings.horizontalPosition = 'right';
    ngToast.settings.maxNumber = 3;

    $scope.usuario = {};
    $scope.usuarios = {};
    $scope.usuariosArray = [];
    $scope.usuarioObtenido = false;
    $scope.rol = {};
    $scope.authorities = [];
    $scope.authority = {};
    $scope.buscarIsCollapsed = false;


    $scope.crearUsuario = function(){ 
      if (!$scope.usuarioForm.$invalid) {
        var cantRoles = 0;
        $scope.usuario.password = $scope.usuario.username;
        if ($scope.rol.admin == true){
          $scope.authority = {};
          $scope.authority.authority = 'ROLE_ADMIN';
          $scope.authorities[$scope.authorities.length] = $scope.authority;
          cantRoles++;
        }
        if ($scope.rol.auditor == true){
          $scope.authority = {};
          $scope.authority.authority = 'ROLE_AUDITOR';
          $scope.authorities[$scope.authorities.length] = $scope.authority;
          cantRoles++;
        }
        if ($scope.rol.analista == true){
          $scope.authority = {};
          $scope.authority.authority = 'ROLE_ANALISTA';
          $scope.authorities[$scope.authorities.length] = $scope.authority;
          cantRoles++;
        }
        if ($scope.rol.director == true){
          $scope.authority = {};
          $scope.authority.authority = 'ROLE_DIRECTOR';
          $scope.authorities[$scope.authorities.length] = $scope.authority;
          cantRoles++;
        }
        if ($scope.rol.backoffice == true){
          $scope.authority = {};
          $scope.authority.authority = 'ROLE_BACKOFFICE';
          $scope.authorities[$scope.authorities.length] = $scope.authority;
          cantRoles++;
        }
        if (cantRoles == 0){
          ngToast.danger('Debe elegir al menos un rol');
        } else {
          $scope.usuario.authorities = $scope.authorities;
          Usuario.create($scope.usuario).then(
            function(res){
              if (res.data.status == 'OK'){
                console.log("Usuario creado correctamente: " + JSON.stringify(res));
                ngToast.success('Usuario creado correctamente');
                $state.go('dashboard.usuariosListar');
              } else if (res.data.status == 'CONFLICT'){
                ngToast.danger('Nombre de usuario ya utilizado');
              }
            },
            function(error){
              ngToast.danger('Error al crear el usuario');
            }
          );
        }
       }
    }

    $scope.modificarUsuario = function(){ 
      if (!$scope.usuarioForm.$invalid) {
        var cantRoles = 0;
        $scope.authorities = [];
        $scope.usuario.password = $scope.usuario.username;
        if ($scope.rol.admin == true){
          $scope.authority = {};
          $scope.authority.authority = 'ROLE_ADMIN';
          $scope.authorities[$scope.authorities.length] = $scope.authority;
          cantRoles++;
        }
        if ($scope.rol.auditor == true){
          $scope.authority = {};
          $scope.authority.authority = 'ROLE_AUDITOR';
          $scope.authorities[$scope.authorities.length] = $scope.authority;
          cantRoles++;
        }
        if ($scope.rol.analista == true){
          $scope.authority = {};
          $scope.authority.authority = 'ROLE_ANALISTA';
          $scope.authorities[$scope.authorities.length] = $scope.authority;
          cantRoles++;
        }
        if ($scope.rol.director == true){
          $scope.authority = {};
          $scope.authority.authority = 'ROLE_DIRECTOR';
          $scope.authorities[$scope.authorities.length] = $scope.authority;
          cantRoles++;
        }
        if ($scope.rol.backoffice == true){
          $scope.authority = {};
          $scope.authority.authority = 'ROLE_BACKOFFICE';
          $scope.authorities[$scope.authorities.length] = $scope.authority;
          cantRoles++;
        }
        if (cantRoles == 0){
          ngToast.danger('Debe elegir al menos un rol');
        } else {
          $scope.usuario.authorities = $scope.authorities;
          Usuario.update($scope.usuario).then(
            function(res){
              if (res.data.status == 'OK'){
                console.log("Usuario modificado correctamente: " + JSON.stringify(res));
                ngToast.success('Usuario modificado correctamente');
                $scope.buscarUsuario();
              } else if (res.data.status == 'NOT_FOUND'){
                ngToast.danger('Nombre de usuario no existe');
              }
            },
            function(error){
              ngToast.danger('Error al modificar el usuario');
            }
          );
        }
       }
    }

    $scope.buscarUsuario = function(){ 
      Usuario.buscarUsuario($scope.usuario.username)
        .then( function(res){
            console.log("Usuario obtenido: " + JSON.stringify(res));
            $scope.usuarioObtenido = true;
            $scope.usuario = res.data;
            $scope.usuario.usernameLabel = $scope.usuario.username;
            $scope.buscarIsCollapsed = true;
        
            var cantRoles = $scope.usuario.authorities.length;
            for (var i = 0; i < cantRoles; i++) {
              if ($scope.usuario.authorities[i].authority == 'ROLE_ADMIN'){
                $scope.rol.admin = true;
              } else if ($scope.usuario.authorities[i].authority == 'ROLE_ANALISTA'){
                $scope.rol.analista = true;
              } else if ($scope.usuario.authorities[i].authority == 'ROLE_AUDITOR'){
                $scope.rol.auditor = true;
              } else if ($scope.usuario.authorities[i].authority == 'ROLE_BACKOFFICE'){
                $scope.rol.backoffice = true;
              } else if ($scope.usuario.authorities[i].authority == 'ROLE_DIRECTOR'){
                $scope.rol.director = true;
              }
            }

            console.log("Busqueda de usuario exitosa");
        },
        function(error){
          if (error.status == '424'){
            ngToast.danger('No existe dicho usuario');
            $scope.usuarioObtenido = false;
          }
          console.log("Error al buscar usuario");
        });
    }


    $scope.restaurarContrasena = function(){ 
      Usuario.restaurarContrasena($scope.usuario.username).then(
        function(res){
          if (res.data.status == 'OK'){
            console.log("Contrasena restaurada correctamente: " + JSON.stringify(res));
            ngToast.success('Contraseña restaurada');
          } else if (res.data.status == 'NOT_FOUND'){
            ngToast.danger('No existe usuario');
          }
        },
        function(error){
          ngToast.danger('Error al restaurar contraseña el usuario');
        }
      );
    }

    $scope.deshabilitarUsuario = function(){ 
      Usuario.deshabilitarUsuario($scope.usuario.username).then(
        function(res){
          if (res.data.status == 'OK'){
            console.log("Usuario deshabilitado correctamente: " + JSON.stringify(res));
            ngToast.success('Usuario deshabilitado');
            $scope.usuario.activo = false;
          } else if (res.data.status == 'NOT_FOUND'){
            ngToast.danger('No existe usuario');
          }
        },
        function(error){
          ngToast.danger('Error al deshabilitar usuario');
        }
      );
    }

    $scope.activarUsuario = function(){ 
      Usuario.activarUsuario($scope.usuario.username).then(
        function(res){
          if (res.data.status == 'OK'){
            console.log("Usuario activado correctamente: " + JSON.stringify(res));
            ngToast.success('Usuario activado');
            $scope.usuario.activo = true;
          } else if (res.data.status == 'NOT_FOUND'){
            ngToast.danger('No existe usuario');
          }
        },
        function(error){
          ngToast.danger('Error al activar usuario');
        }
      );
    }

    $scope.listarUsuarios = function(){ 
      var deferred = $q.defer();
      Usuario.listar()
        .then(function(res){
          $scope.usuarios = res.data;
          console.log("Lista usuarios OK: ");
           deferred.resolve(res.data);
        }); 
      return deferred.promise;
    }

    $scope.confirmarRestaurarContrasena = function () {
      var body = 'Seguro desea restaurar la contraseña? \r\n La nueva contraseña será el nombre de usuario. \r\n Se recomienda su modificación por parte del usuario.';
      var title = 'Confirmar restauración de contraseña';
      var modalInstance = $modal.open({
        templateUrl: 'views/usuarios/confirmarRestauracion.html',
        controller: 'ConfirmarRestauracionCtrl',
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
        $scope.restaurarContrasena();      
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.cambiarContrasena = function(){
      $scope.nuevaContrasena = null;
      $scope.nuevaContrasena1 = null;
      $scope.nuevaContrasena2 = null;
      $scope.cambiarContrasenaModal('Cambiar contraseña');
    }

    $scope.cambiarContrasenaModal = function (title) {
      var body = '';
      var modalInstance = $modal.open({
        templateUrl: 'views/usuarios/cambiarContrasena.html',
        controller: 'CambiarContrasenaCtrl',
        resolve: {
            nuevaContrasena: function () {
              return $scope.nuevaContrasena;
            },
            nuevaContrasena1: function () {
              return $scope.nuevaContrasena1;
            },
            nuevaContrasena2: function () {
              return $scope.nuevaContrasena2;
            },
            obtenerTitulo: function () {
              return title;
            },
            obtenerBody: function () {
              return body;
            }  
          }
      });
      modalInstance.result.then(function (nuevaContrasena) { 
        $scope.usuario.password = nuevaContrasena;
        Usuario.cambiarContrasena($scope.usuario).then(
        function(res){
          if (res.data.status == 'OK'){
            console.log("Contraseña modificada correctamente: " + JSON.stringify(res));
            ngToast.success('Contraseña modificada');
          } else if (res.data.status == 'NOT_FOUND'){
            ngToast.danger('No existe usuario');
          }
        },
        function(error){
          ngToast.danger('Error al cambiar la contraseña');
        }
      );
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.verUsuario= function(row){
      var username = $scope.usuariosArray[row].username;
      console.log('Ver usuario clicked');
      $state.go('dashboard.usuariosModificar', {username:username}, {reload:true});
    } 

    $scope.miPerfil= function(){
      var username = AuthService.authData.tokenData.username;
      $state.go('dashboard.usuariosPerfil', {username:username}, {reload:true});
    } 


    $scope.dtColumns =  [
      DTColumnBuilder.newColumn('username').withTitle('Nombre de usuario')
        .renderWith(function(data, type, full, meta) {
           $scope.usuariosArray[meta.row] = {};
           $scope.usuariosArray[meta.row].username = full.username;
           return  '<a ng-click="verUsuario(' + meta.row + ')">' + full.username + '</a>'
        }),
      DTColumnBuilder.newColumn('nombre').withTitle('Nombre')
        .renderWith(function(data, type, full, meta) {
           return  '<a ng-click="verUsuario(' + meta.row + ')">' + full.nombre + '</a>'
        }),
      DTColumnBuilder.newColumn('apellido').withTitle('Apellido')
        .renderWith(function(data, type, full, meta) {
           return  '<a ng-click="verUsuario(' + meta.row + ')">' + full.apellido + '</a>'
        }),
      DTColumnBuilder.newColumn('telefono').withTitle('Teléfono')
        .renderWith(function(data, type, full, meta) {
           return  '<a ng-click="verUsuario(' + meta.row + ')">' + full.telefono + '</a>'
        }),
      DTColumnBuilder.newColumn('mail').withTitle('Correo electrónico')
        .renderWith(function(data, type, full, meta) {
           return  '<a ng-click="verUsuario(' + meta.row + ')">' + full.mail + '</a>'
        }),
      DTColumnBuilder.newColumn('authorities').withTitle('Roles')
        .renderWith(function(data, type, full, meta) {
           var cantRoles = full.authorities.length;
           var roles; var rol;
           var res;
           if (full.authorities[0]){
              res = full.authorities[0].authority.split("_");
              roles = res[1];
           }
            for (var i = 1; i < cantRoles; i++) {
              rol = full.authorities[i].authority.split("_");
              roles = roles + ', ' + rol[1];
            }
           return  '<a ng-click="verUsuario(' + meta.row + ')">' + roles + '</a>'
        }),
      DTColumnBuilder.newColumn('activo').withTitle('Estado cuenta')
      .renderWith(function(data, type, full, meta) {
        if (full.activo) {
         return  '<a ng-click="verUsuario(' + meta.row + ')"> Activa </a>'
        } else {
         return  '<a ng-click="verUsuario(' + meta.row + ')"> Deshabilitada </a>'
        }

        })
    ];

    $scope.dtOptions =  DTOptionsBuilder.fromFnPromise($scope.listarUsuarios)
      .withDataProp('usuarios')
      .withOption("bAutoWidth", true)
      .withOption("paging", true)
      .withOption('processing', true)
      .withOption('createdRow', function(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
      })
      .withLanguage(VIEW_CONSTANTS.language); 

      if( $stateParams.username !== undefined && $stateParams.username !== '' ) {
        $scope.usuario.username   = $stateParams.username;
        $scope.buscarUsuario();
    }

    $scope.labels = ['Jul-2012', 'Ago-2012', 'Sep-2012'];
    $scope.type = 'StackedBar';
    $scope.data = [
      [65, 59, 90],
      [28, 48, 400]
    ];
    $scope.test = function () { 
      console.log('fff'); 
    };
    
    $scope.options = {
      data: [
        {
          sales: 130,
          income: 250
        }
      ],
      dimensions: {
        sales: {
          type: 'bar'
        },
        income: {
          axis: 'y2'
        }
      },
      chart: {
        onrendered: function () { 
          var el = document.getElementById("chartContainer").children[0].children[0];
          el.id = "testId";
          var jQueryInnerItem = $($element);
          console.log('rendered...') ;
        }
      }
    };

});

angular.module('sbAdminApp').controller('ConfirmarRestauracionCtrl', function ($scope, $modalInstance, $state, obtenerTitulo, obtenerBody) {
    $scope.title = obtenerTitulo;
    $scope.body = obtenerBody;

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

angular.module('sbAdminApp').controller('CambiarContrasenaCtrl', function ($scope, $modalInstance, ngToast, nuevaContrasena, nuevaContrasena1, nuevaContrasena2, obtenerTitulo, obtenerBody) {
    $scope.nuevaContrasena = nuevaContrasena;
    $scope.nuevaContrasena1 = nuevaContrasena1;
    $scope.nuevaContrasena2 = nuevaContrasena2;

    $scope.title = obtenerTitulo;
    $scope.body = obtenerBody;

    $scope.ok = function (nuevaContrasena1,nuevaContrasena2) {
      if (nuevaContrasena1 != nuevaContrasena2){
        ngToast.danger('Las contraseñas ingresadas no coinciden');
      } else {
      $scope.nuevaContrasena = nuevaContrasena1;
      $modalInstance.close($scope.nuevaContrasena);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });


