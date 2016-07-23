'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl', function($scope, $position, Dashboard) {
    /*
    $scope.productoresClaseData = [0,0,0,0,0];
    $scope.auditoriaStatusTotal = 0;
    $scope.auditoriaStatusInteres = 0;
    $scope.auditoriaStatusRelevamientosPendientes = 0;
    $scope.auditoriaStatusRelevamientosRealizados = 0;
    $scope.auditoriaStatusInformeRealizados = 0;
    $scope.auditoriaStatusInformeEntregado = 0;
    $scope.auditoriaStatusFinalizadas = 0;
    $scope.auditoriaStatusCanceladas = 0;   
    $scope.productoresChart;
    
    $scope.productoresClaseOpciones = [{nombre:'Todos', text:'Todos'},{nombre:'Chico', text:'Chico'},{nombre:'Mediano', text:'Mediano'},{nombre:'Grande', text:'Grande'}];
    $scope.productorOpcionSeleccion = 'Todos';
   
    $scope.getPorcentaje = function(value){
      var result = 0;
      
      if( value > 0){
        result = Math.round((value*100)/$scope.auditoriaStatusTotal);
      }
      
      return result;
    }
    $scope.productorFiltro = function() {
      $scope.getDashboard($scope.productorOpcionSeleccion.text);
    }
    $scope.getZona = function(value){ 
      var strZona ='';
      for ( var i=0; i < $scope.zonas.length; i++){
        if($scope.zonas[i].id == value){
         strZona = $scope.zonas[i].nombre;
        }
      }
      return strZona;
    }
    $scope.obtenerZonas = function(){ 
       
      Productor.getZonas()
        .then(
        function(res){
          $scope.zonas = res.data;         
          console.log("obtenerZonas OK: ");
        },
        function(error){
          console.log("obtenerZonas error : " + JSON.stringify(error));
        });
    }    
    $scope.obtenerZonas();
    
    $scope.getTipoEstablecimiento = function(tamanoProductor){
      var result = -1;
      switch (tamanoProductor){
        case 'Chico':
          result = 1;
          break;
        case 'Mediano':
          result = 2;
          break;
        case 'Grande':
          result = 3;
          break;
      }
      return result;
    }
    $scope.getDashboard = function(tamanoProductor){
      
      var tipoEstablecimiento = $scope.getTipoEstablecimiento(tamanoProductor);
      
      $scope.myPromise = Dashboard.getDashboard(tipoEstablecimiento).then( function(res){
        
        $scope.productoresClase = res.data.productoresClase;
        for ( var i=0; i < $scope.productoresClase.length; i++){
         $scope.productoresClaseData[i] = $scope.productoresClase[i].count;
        }

        $scope.listaAuditorias = res.data.listaAuditorias;
        $scope.auditariasMesStatus = res.data.auditariasMesStatus;
        $scope.auditoriasZonas = res.data.auditoriasZonas;
         
        $scope.costoImplementacionTotal = res.data.costoImplementacionTotal;
        $scope.costoImplementacion3Meses = res.data.costoImplementacion3Meses;
        $scope.cantidadMedidas = res.data.cantidadMedidas;
        $scope.cantidadMedidasAceptadas = res.data.cantidadMedidasAceptadas;
        $scope.cantidadMedidasImplementadas = res.data.cantidadMedidasImplementadas;
               
         $scope.auditoriaStatus = res.data.auditoriasStatus;
         for ( var i=0; i < $scope.auditoriaStatus.length; i++){
          switch ($scope.auditoriaStatus[i].status){
            case 'Interes de auditoria registrado':
              $scope.auditoriaStatusInteres = $scope.auditoriaStatusInteres + $scope.auditoriaStatus[i].count;
              $scope.auditoriaStatusTotal = $scope.auditoriaStatusTotal + $scope.auditoriaStatus[i].count;
              
              $scope.auditoriaStatusInteresLastDate = $scope.auditoriaStatus[i].lastDate;
              $scope.auditoriaStatusInteresId = $scope.auditoriaStatus[i].auditoriaId;
              break;
            case 'Condiciones financieras verificadas':
            case 'Relevamiento telefonico realizado':
            case 'Documentacion preliminar ingresada':
              $scope.auditoriaStatusRelevamientosPendientes = $scope.auditoriaStatusRelevamientosPendientes + $scope.auditoriaStatus[i].count;
              $scope.auditoriaStatusTotal = $scope.auditoriaStatusTotal + $scope.auditoriaStatus[i].count;            
              
              $scope.auditoriaStatusRelevamientosPendientesLastDate = $scope.auditoriaStatus[i].lastDate;
              $scope.auditoriaStatusRelevamientosPendientesId = $scope.auditoriaStatus[i].auditoriaId;
              break;
            case 'Auditoria realizada':
              $scope.auditoriaStatusRelevamientosRealizados = $scope.auditoriaStatusRelevamientosRealizados + $scope.auditoriaStatus[i].count;
              $scope.auditoriaStatusTotal = $scope.auditoriaStatusTotal + $scope.auditoriaStatus[i].count;            
              
              $scope.auditoriaStatusRelevamientosRealizadosLastDate = $scope.auditoriaStatus[i].lastDate;
              $scope.auditoriaStatusRelevamientosRealizadosId = $scope.auditoriaStatus[i].auditoriaId;
              break;
            case 'Informe realizado':
            case 'Informe de auditoria aprobado':
            case 'Informe de auditoria rechazado':
              $scope.auditoriaStatusInformeRealizados = $scope.auditoriaStatusInformeRealizados + $scope.auditoriaStatus[i].count;
              $scope.auditoriaStatusTotal = $scope.auditoriaStatusTotal + $scope.auditoriaStatus[i].count;
              
              $scope.auditoriaStatusInformeRealizadosLastDate = $scope.auditoriaStatus[i].lastDate;
              $scope.auditoriaStatusInformeRealizadosId = $scope.auditoriaStatus[i].auditoriaId;
              break;
            case 'Cancelada - No verifica condiciones financieras':
            case 'Rechazada por productor':
              $scope.auditoriaStatusCanceladas = $scope.auditoriaStatusCanceladas + $scope.auditoriaStatus[i].count;
              $scope.auditoriaStatusTotal = $scope.auditoriaStatusTotal + $scope.auditoriaStatus[i].count;
              
              $scope.auditoriaStatusCanceladasLastDate = $scope.auditoriaStatus[i].lastDate;
              $scope.auditoriaStatusCanceladasId = $scope.auditoriaStatus[i].auditoriaId;
              break;
            case 'Devolucion finalizada':
              $scope.auditoriaStatusInformeEntregado = $scope.auditoriaStatusInformeEntregado + $scope.auditoriaStatus[i].count;
              $scope.auditoriaStatusTotal = $scope.auditoriaStatusTotal + $scope.auditoriaStatus[i].count;
               
              $scope.auditoriaStatusInformeEntregadoLastDate = $scope.auditoriaStatus[i].lastDate;
              $scope.auditoriaStatusInformeEntregadoId = $scope.auditoriaStatus[i].auditoriaId;
              break;
            case 'Auditoria finalizada':
              $scope.auditoriaStatusFinalizadas = $scope.auditoriaStatusFinalizadas + $scope.auditoriaStatus[i].count;
              $scope.auditoriaStatusFinalizadasLastDate = $scope.auditoriaStatus[i].lastDate;
              $scope.auditoriaStatusFinalizadasId = $scope.auditoriaStatus[i].auditoriaId;
              $scope.auditoriaStatusTotal = $scope.auditoriaStatusTotal + $scope.auditoriaStatus[i].count;
              break;
          }
         }
         
         $scope.buildProductores();
         $scope.buildAuditoriasStaus();
         $scope.buildAuditoriasPorZona();
         $scope.buildAuditoriasPorMes();
      });
    }
  
    $scope.buildAuditoriasStaus = function(){
      var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
      var pieChart = new Chart(pieChartCanvas);
      var PieData = [
        {
          value: $scope.auditoriaStatusInteres,
          color: "#00a7d0",
          highlight: "#00a7d0",
          label: "Nuevas auditorias"
        },
        {
          value: $scope.auditoriaStatusRelevamientosPendientes,
          color: "#ff7701",
          highlight: "#ff7701",
          label: "Relevamientos pendientes"
        },
        {
          value: $scope.auditoriaStatusRelevamientosRealizados,
          color: "#f39c12",
          highlight: "#f39c12",
          label: "Relevamientos realizados"
        },
        {
          value: $scope.auditoriaStatusInformeRealizados,
          color: "#39cccc",
          highlight: "#39cccc",
          label: "Informes realizados"
        },
        {
          value: $scope.auditoriaStatusInformeEntregado,
          color: "#3c8dbc",
          highlight: "#3c8dbc",
          label: "Informes entregados"
        },
        {
          value: $scope.auditoriaStatusFinalizadas,
          color: "#00a65a",
          highlight: "#00a65a",
          label: "Auditoras finalizadas"
        },
        {
          value: $scope.auditoriaStatusCanceladas,
          color: "#dd4b39",
          highlight: "#dd4b39",
          label: "Auditoras canceladas"
        }
      ];
      var pieOptions = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,
        //String - The colour of each segment stroke
        segmentStrokeColor: "#fff",
        //Number - The width of each segment stroke
        segmentStrokeWidth: 1,
        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts
        //Number - Amount of animation steps
        animationSteps: 100,
        //String - Animation easing effect
        animationEasing: "easeOutBounce",
        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,
        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true,
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: false,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
        //String - A tooltip template
        tooltipTemplate: "<%=value %> <%=label%>"
      };
      //Create pie or douhnut chart
      // You can switch between pie and douhnut using the method below.
      pieChart.Doughnut(PieData, pieOptions);
    }
    $scope.buildAuditoriasPorZona = function(){
      var pieChartCanvas = $("#auditoriasPorZona").get(0).getContext("2d");
      var pieChart = new Chart(pieChartCanvas);
      var PieData = [];
      $scope.auditoriasZonasLegend = [];
      var colors = ["#b1aac1","#60a880","#a8f3ba","#ded1d9","#5b1943","#b18ede","#ff4040","#c6e2ff","#ffc3a0","#a52a2a","#ff8247","#ffa500","#191970"];
        
      for ( var i=$scope.auditoriasZonas.length-1; i >= 0 ; i--){
        var zona = {};
        zona.label = $scope.getZona($scope.auditoriasZonas[i].zonaId);
        zona.value = $scope.auditoriasZonas[i].count;
        zona.color =  colors[i];
        zona.highlight = colors[i];
        
        var legend = {};
        legend.label = zona.label;
        legend.color = zona.color;
        legend.value = zona.value;
        $scope.auditoriasZonasLegend[i] = legend;
        
        PieData[i] = zona;
      }
      var pieOptions = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,
        //String - The colour of each segment stroke
        segmentStrokeColor: "#fff",
        //Number - The width of each segment stroke
        segmentStrokeWidth: 1,
        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts
        //Number - Amount of animation steps
        animationSteps: 100,
        //String - Animation easing effect
        animationEasing: "easeOutBounce",
        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,
        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true,
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: false,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
        //String - A tooltip template
        tooltipTemplate: "<%=value %> <%=label%>"
      };
      
      pieChart.Doughnut(PieData, pieOptions);
    }
    
    $scope.buildAuditoriasPorMes = function(){
      // Get context with jQuery - using jQuery's .get() method.
      var salesChartCanvas = $("#salesChart").get(0).getContext("2d");
      // This will get the first returned node in the jQuery collection.
      // var salesChart = new Chart(salesChartCanvas);
      var labels = [];
      var datasets = [];
      datasets[0] = []; datasets[1] = []; datasets[2] = [];
      datasets[3] = []; datasets[4] = []; datasets[5] = [];
      datasets[6] = [];
      var index=0;
      for ( var i=$scope.auditariasMesStatus.length-1; i >= 0 ; i--){
        labels[index] = $scope.auditariasMesStatus[i].mes;
        //var dataValues = [];
        for ( var j=0; j < $scope.auditariasMesStatus[i].status.length; j++){
         // dataValues[j] = $scope.auditariasMesStatus[i].status[j].count;                

          switch ($scope.auditariasMesStatus[i].status[j].status){
            case 'Interes de auditoria registrado':
              if(datasets[0][index] !== undefined ){
                datasets[0][index] = datasets[0][index] + $scope.auditariasMesStatus[i].status[j].count;
              } else{
                datasets[0][index] = $scope.auditariasMesStatus[i].status[j].count;
              }
              break;
            case 'Condiciones financieras verificadas':
            case 'Relevamiento telefonico realizado':
            case 'Documentacion preliminar ingresada':
              if(datasets[1][index] !== undefined ){
                datasets[1][index] = datasets[1][index] + $scope.auditariasMesStatus[i].status[j].count;
              } else{
                datasets[1][index] = $scope.auditariasMesStatus[i].status[j].count;
              }
              break;
            case 'Auditoria realizada':
              if(datasets[2][index] !== undefined ){
                datasets[2][index] = datasets[2][index] + $scope.auditariasMesStatus[i].status[j].count;
              } else{
                datasets[2][index] = $scope.auditariasMesStatus[i].status[j].count;
              }
              break;
            case 'Informe realizado':
            case 'Informe de auditoria aprobado':
            case 'Informe de auditoria rechazado':
             if(datasets[3][index] !== undefined ){
                datasets[3][index] = datasets[3][index] + $scope.auditariasMesStatus[i].status[j].count;
              } else{
                datasets[3][index] = $scope.auditariasMesStatus[i].status[j].count;
              }
              break;
            case 'Cancelada - No verifica condiciones financieras':
            case 'Rechazada por productor':
              if(datasets[4][index] !== undefined ){
                datasets[4][index] = datasets[4][index] + $scope.auditariasMesStatus[i].status[j].count;
              } else{
                datasets[4][index] = $scope.auditariasMesStatus[i].status[j].count;
              }
              break;
            case 'Devolucion finalizada':
              if(datasets[5][index] !== undefined ){
                datasets[5][index] = datasets[5][index] + $scope.auditariasMesStatus[i].status[j].count;
              } else{
                datasets[5][index] = $scope.auditariasMesStatus[i].status[j].count;
              }
              break;
            case 'Auditoria finalizada':
              if(datasets[6][index] !== undefined ){
                datasets[6][index] = datasets[6][index] + $scope.auditariasMesStatus[i].status[j].count;
              } else{
                datasets[6][index] = $scope.auditariasMesStatus[i].status[j].count;
              }
              break;
          }
        }
        index++;
      }
      $scope.auditoriasMensualesFrom = labels[0];
      $scope.auditoriasMensualesTo = labels[index-1];
      var salesChartData = {
        type: "stackedBar",
        labels:labels,
        datasets: [
                  { label: "",
                    fillColor: "#00a7d0",
                    strokeColor: "#00a7d0",
                    pointColor: "rgb(210, 214, 222)",
                    pointStrokeColor: "#c1c7d1",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgb(220,220,220)",
                    data: datasets[0]
                  },
                  { label: "",
                    fillColor: "#ff7701",
                    strokeColor: "#ff7701",
                    pointColor: "rgb(210, 214, 222)",
                    pointStrokeColor: "#c1c7d1",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgb(220,220,220)",
                    data: datasets[1]
                  },
                  { label: "",
                    fillColor: "#f39c12",
                    strokeColor: "#f39c12",
                    pointColor: "rgb(210, 214, 222)",
                    pointStrokeColor: "#c1c7d1",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgb(220,220,220)",
                    data: datasets[2]
                  },
                  { label: "",
                    fillColor: "#39cccc",
                    strokeColor: "#39cccc",
                    pointColor: "rgb(210, 214, 222)",
                    pointStrokeColor: "#c1c7d1",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgb(220,220,220)",
                    data: datasets[3]
                  },
                  { label: "",
                    fillColor: "#3c8dbc",
                    strokeColor: "#3c8dbc",
                    pointColor: "rgb(210, 214, 222)",
                    pointStrokeColor: "#c1c7d1",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgb(220,220,220)",
                    data: datasets[4]
                  },
                  { label: "",
                    fillColor: "#00a65a",
                    strokeColor: "#00a65a",
                    pointColor: "rgb(210, 214, 222)",
                    pointStrokeColor: "#c1c7d1",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgb(220,220,220)",
                    data: datasets[5]
                  },
                  { label: "",
                    fillColor: "#dd4b39",
                    strokeColor: "#dd4b39",
                    pointColor: "rgb(210, 214, 222)",
                    pointStrokeColor: "#c1c7d1",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgb(220,220,220)",
                    data: datasets[6]
                  }
                ]
        // labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"],
        // datasets: [
          // {
            // label: "Nuevos ingresos",
            // fillColor: "rgb(210, 214, 222)",
            // strokeColor: "rgb(210, 214, 222)",
            // pointColor: "rgb(210, 214, 222)",
            // pointStrokeColor: "#c1c7d1",
            // pointHighlightFill: "#fff",
            // pointHighlightStroke: "rgb(220,220,220)",
            // data: [28, 29, 24, 31, 25, 33, 34, 30, 32, 25, 20, 10]
          // },
          // {
            // label: "Auditorias entregadas",
            // fillColor: "rgba(60,141,188,0.9)",
            // strokeColor: "rgba(60,141,188,0.8)",
            // pointColor: "#3b8bba",
            // pointStrokeColor: "rgba(60,141,188,1)",
            // pointHighlightFill: "#fff",
            // pointHighlightStroke: "rgba(60,141,188,1)",
            // data: [20, 25, 26, 13, 28, 14, 22, 24, 26, 30, 33, 38]
          // }
        // ]
      };
      var salesChart = new Chart(salesChartCanvas).StackedBar(salesChartData, {
        responsive : true
      });

      var salesChartOptions = {
        //Boolean - If we should show the scale at all
        showScale: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: false,
        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - Whether the line is curved between points
        bezierCurve: true,
        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.3,
        //Boolean - Whether to show a dot for each point
        pointDot: false,
        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,
        //Boolean - Whether to fill the dataset with a color
        datasetFill: true,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%=datasets[i].label%></li><%}%></ul>",
        //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: true,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true
      };
      //Create the line chart
      // salesChart.Line(salesChartData, salesChartOptions);
  }
    
  $scope.buildColors = function () {
      var barChartData = {
      labels: ["A", "B", "C", "D", "E"],
      datasets: [
        {
          label: "Clase",
          fillColor: "rgba(210, 214, 222, 1)",
          strokeColor: "rgba(210, 214, 222, 1)",
          pointColor: "rgba(210, 214, 222, 1)",
          pointStrokeColor: "#c1c7d1",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: $scope.productoresClaseData
        }
      ]};
      var ctx = document.getElementById("graficaProductores").getContext("2d");
      window.myObjBar = new Chart(ctx).Bar(barChartData, {
            responsive : true
      });

      //nuevos colores
      myObjBar.datasets[0].bars[0].fillColor = "#7b9a00"; 
      myObjBar.datasets[0].bars[1].fillColor = "#a1c900"; 
      myObjBar.datasets[0].bars[2].fillColor = "#fee902"; 
      myObjBar.datasets[0].bars[3].fillColor = "#f7cc22"; 
      myObjBar.datasets[0].bars[4].fillColor = "#f40000"; 
      myObjBar.update();
  };
  $scope.resetCanvas = function(){
    $('#graficaProductores').remove(); 
    $('#chartContainer').append('<canvas id="graficaProductores" style="height:230px"><canvas>');
    var canvas = document.querySelector('#graficaProductores');
  };
  $scope.buildProductores = function(){

    $scope.resetCanvas();
  
    var barChartData = {
      labels: ["A", "B", "C", "D", "E"],
      datasets: [
        {
          label: "Clase",
          fillColor: "rgba(210, 214, 222, 1)",
          strokeColor: "rgba(210, 214, 222, 1)",
          pointColor: "rgba(210, 214, 222, 1)",
          pointStrokeColor: "#c1c7d1",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: $scope.productoresClaseData
        }
      ]
    };
    
    var barChartCanvas = $("#graficaProductores").get(0).getContext("2d");
    //var barChart = new Chart(barChartCanvas);
    if ($scope.productoresChart != undefined ){
      $scope.productoresChart = null;
    }
    $scope.productoresChart = new Chart(barChartCanvas);
    barChartData.datasets[0].fillColor = "#00a65a";
    barChartData.datasets[0].strokeColor = "#00a65a";
    barChartData.datasets[0].pointColor = "#00a65a";
    
    
    var barChartOptions = {
      //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero: true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: true,
      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth: 1,
      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,
      //Boolean - If there is a stroke on each bar
      barShowStroke: true,
      //Number - Pixel width of the bar stroke
      barStrokeWidth: 2,
      //Number - Spacing between each of the X value sets
      barValueSpacing: 5,
      //Number - Spacing between data sets within X values
      barDatasetSpacing: 1,
      //String - A legend template
      legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
      //Boolean - whether to make the chart responsive
      responsive: true,
      maintainAspectRatio: false
    };

    barChartOptions.datasetFill = false;
    $scope.productoresChart.Bar(barChartData, barChartOptions);
    $scope.buildColors();
  }
  
  $scope.getDashboard('Todos');*/
  
  });
