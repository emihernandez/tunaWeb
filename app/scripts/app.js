'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
          'oc.lazyLoad',
          'ui.router',
          'ui.bootstrap',
          'angular-loading-bar',
          'ngStorage',
          'ngToast',
          'datatables',
          'FileManagerApp',
          'ngFileUpload',
          'hc.downloader',
          'ngRoute',
          'ui.calendar',
          'cgBusy',
         // 'ui.bootstrap.datepicker',
         // 'ui.bootstrap.timePicker',
          //'ui.bootstrap.datetimepicker'
          // 'ui.bootstrap', 
        ])
        
          // 'angularChart',
  // .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider','$httpProvider', function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider, $httpProvider) {
  .config(function($stateProvider,$urlRouterProvider, $locationProvider, $ocLazyLoadProvider, $httpProvider, $provide){ 
  
    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });    
    
    // $locationProvider.html5Mode({
      // enabled: true,
      // requireBase: false
    // });

    
    // Authorization Key injector
    $provide.factory('httpInterceptor', function ($q, $rootScope, $localStorage, $location, ngToast,$window  ) {

        ngToast.settings.verticalPosition = 'bottom';
        ngToast.settings.horizontalPosition = 'right';
        ngToast.settings.maxNumber = 3;
        return {
            'request': function (config) {
              config.headers = config.headers || {};
              if ($localStorage.tokenData !== null && $localStorage.tokenData !== undefined && $localStorage.tokenData.token) {
                config.headers['Authorization'] = $localStorage.tokenData.token.hash;
              } else {
                $location.path('/login');
              }
              return config;
            },
            'responseError': function (rejection) {
                if((rejection.status === 401 || rejection.status === 403)) {
                  console.error("User is not authenticated! Going to login");
                  ngToast.danger('Su sesión se ha vencido u ocurrió un error en la misma. Inicie sesión nuevamente');
                  $localStorage.tokenData.token = null;
                  $rootScope.$emit('auth.changed', {signedIn: false});
                  $location.path('/login');
                  $window.location.reload();
                }else {
                  ngToast.danger('Ha ocurrido un error. Inicie sesión nuevamente');
                  $location.path('/dashboard/home');
                  //$window.location.reload();
                }
                // ngToast.danger('Usuario/contraseña invalido');
                return $q.reject(rejection);
            }
        };
      });
    $httpProvider.interceptors.push('httpInterceptor');
    
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'sbAdminApp',
                    files:[
                    'scripts/directives/header/header.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/footer/footerDir.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:['bower_components/angular-cookies/angular-cookies.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bower_components/angular-resource/angular-resource.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bower_components/angular-sanitize/angular-sanitize.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bower_components/angular-touch/angular-touch.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngStorage',
                  files:['bower_components/ngstorage/ngStorage.js']
                })
            }
        }
    })
      .state('dashboard.home',{
        url:'/home',
        controller: 'MainCtrl',
        templateUrl:'views/dashboard/home.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'scripts/controllers/main.js',
              'scripts/directives/dashboard/stats/stats.js'
              ]
            })
          }
        }
      })
      .state('dashboard.form',{
        templateUrl:'views/form.html',
        url:'/form'
    })
      .state('dashboard.blank',{
        templateUrl:'views/pages/blank.html',
        url:'/blank'
    })

      .state('dashboard.chart',{
        templateUrl:'views/chart.html',
        url:'/chart',
        controller:'ChartCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/chartContoller.js']
            })
          }
        }
    })
      .state('dashboard.table',{
        templateUrl:'views/table.html',
        url:'/table'
    })
      .state('dashboard.panels-wells',{
          templateUrl:'views/ui-elements/panels-wells.html',
          url:'/panels-wells'
      })
      .state('dashboard.buttons',{
        templateUrl:'views/ui-elements/buttons.html',
        url:'/buttons'
    })
      .state('dashboard.notifications',{
        templateUrl:'views/ui-elements/notifications.html',
        url:'/notifications'
    })
      .state('dashboard.typography',{
       templateUrl:'views/ui-elements/typography.html',
       url:'/typography'
   })
      .state('dashboard.icons',{
       templateUrl:'views/ui-elements/icons.html',
       url:'/icons'
   })
      .state('dashboard.grid',{
       templateUrl:'views/ui-elements/grid.html',
       url:'/grid'
   })
   
    .state('login',{
        templateUrl:'views/pages/login.html',
        url:'/login',
        controller: 'LoginCtrl'
    })
    .state('dashboard.PersonaFisicaCrear',{
         templateUrl:'views/contratos/crearPersonaFisica.html',
         url:'/contratos/ingresar_contrato',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.ContratoVer',{
         templateUrl:'views/contratos/verContrato.html',
         url:'/contratos/ver_contrato/{idContrato}',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.ContratoModificar',{
         templateUrl:'views/contratos/modificarContrato.html',
         url:'/contratos/modificar_contrato/{idContrato}',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.ContratoEstadoModificar',{
         templateUrl:'views/contratos/modificarEstadoContrato.html',
         url:'/contratos/modificar_estado_contrato/{idContrato}',
         controller: 'ContratosCtrl'
     })

     .state('dashboard.ContratoListarVer',{
         templateUrl:'views/contratos/listarContratosVer.html',
         url:'/contratos/listar_contratos_ver',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.EstadosContratosVer',{
         templateUrl:'views/contratos/verEstadosContratos.html',
         url:'/contratos/ver_estados_contratos/{idContrato}',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.ContratoListarModificar',{
         templateUrl:'views/contratos/listarContratosModificar.html',
         url:'/contratos/listar_contratos_modificar',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.RemitoListarVer',{
         templateUrl:'views/contratos/listarRemitosVer.html',
         url:'/contratos/listar_remitos_ver',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.RemitoVer',{
         templateUrl:'views/contratos/verRemito.html',
         url:'/contratos/ver_remito/{idContrato}',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.RemitoListarModificar',{
         templateUrl:'views/contratos/listarRemitosModificar.html',
         url:'/contratos/listar_remitos_modificar',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.RemitoModificar',{
         templateUrl:'views/contratos/modificarRemito.html',
         url:'/contratos/modificar_remito/{idContrato}',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.ContratoListarGenerar',{
         templateUrl:'views/contratos/listarContratosGenerar.html',
         url:'/contratos/listar_contratos_generar',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.RemitoListarGenerar',{
         templateUrl:'views/contratos/listarRemitoGenerar.html',
         url:'/contratos/listar_remitos_generar',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.ContratoHistorico',{
         templateUrl:'views/contratos/historicoContrato.html',
         url:'/contratos/historico_contrato/{idContrato}',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.ContratoListarRecoordinar',{
         templateUrl:'views/contratos/listarContratosRecoordinar.html',
         url:'/contratos/listar_contratos_recoordinar',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.ContratoRecoordinar',{
         templateUrl:'views/contratos/recoordinarContrato.html',
         url:'/contratos/recoordinar_contrato/{idContrato}',
         controller: 'ContratosCtrl'
     })
     .state('dashboard.CambioMasivoEstadosVer',{
         templateUrl:'views/contratos/verCambioMasivoEstados.html',
         url:'/contratos/cambio_masivo_estados',
         controller: 'ContratosCtrl'
     }) 
  });

    
