/////////////////////////////////////////////////////////////////////////////////
//************************************************************************************************/
// Script: nosql_demo                                                                             /
// Usage : Client script for NoSQL GSE demo                                                       /
// Date                                  Who                           What                       /
//------------------------------------------------------------------------------------------------/
// 29-Mar-2016                        LUISARIA.MX                  Initial Version                /
//------------------------------------------------------------------------------------------------/
//************************************************************************************************/
var server = "";
var loop_on = false;
var loading = false;
var demo_loops_count = 0;
var last_reading = 0;
var max_speed = 1800;
var chart, data, options, curve_chart, curve_data, curve_options;

function updateGauge( index, value ){
	data.setValue(index, 1, Math.round(value));
	chart.draw(data, options);
}

function updateChart( data ){
	curve_options.title = data.title;
	if ( data.data.length == 1 ){
		alert("Data for this building hasn't been loaded");
	}
	else{
		curve_data = google.visualization.arrayToDataTable(data.data);
		curve_chart.draw(curve_data, curve_options);	
	}
}

function update_progress(bar_id, progress, color="auto"){
	$('#' + bar_id + '_bar').css('transform','translateX('+progress+'%)'); 
	$('#' + bar_id + '_bar').css('-webkit-transform','translateX('+progress+'%)');
	if ( color=="auto" ){
		if(progress < 40)
			$('#' + bar_id).css('background-color','red');
		else if(progress < 70)
			$('#' + bar_id).css('background-color','yellow');
		else
			$('#' + bar_id).css('background-color','green');							
	}
	else{
		$('#' + bar_id).css('background-color',color);
	}
}

function loop(){
	$.get(server + "/get_status", {}, function(data){				
		if ( max_speed < data.current_rows_per_second ) max_speed = data.current_rows_per_second;
		var progress = (data.rows_inserted * 100) / data.max_rows;
		var performance = (data.current_rows_per_second * 100) / max_speed;
		update_progress("progress_bar", progress, "blue");
		update_progress("performance_bar", performance);
		updateGauge( 0, performance );
		updateGauge( 1, ( data.system_memory - data.free_memory ) / 1000000);
		updateGauge( 2, data.free_memory / 1000000);
		updateGauge( 3, data.system_cpus );
		//updateGauge( 1, progress );
		$("#rows_per_second").html(data.current_rows_per_second.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " rows");
		$("#ellapsed_time").html(data.ellapsed_time.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " seconds");
		$("#rows_inserted").html(data.rows_inserted.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " rows");
		$("#current_ellapsed_time").html(data.current_ellapsed_time.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " seconds");
		$("#current_rows_inserted").html(data.current_rows_inserted.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " rows");
		
		$("#init_time").html(data.init_time);
		if (data.running == 0) loop_on = false;				
		last_reading = data.rows_inserted;
	}, "json");
		
	if(loop_on){
		setTimeout(loop, 200);
	}
}

function refresh_environment(){
	if(confirm("Are you sure you want to clean the database?")){
		alert( "Refreshing demo, please wait a couple of minutes" );
		  var postdata = {};
		  $.post(server + "/refresh_environment", postdata, function(data){
				alert( data.message );		    
			 }, "json").error(function(x, y){
				  alert("Cannot contact server or got wrong response");
		   });   
	
	}
}


function buildings_click_read(alt){
	var postdata = {};
	postdata["building"] = alt;
	$.post(server + "/retrieve_row", postdata, function(data){
		updateChart( data );
		loading = false;
	}, "json").error(function(x, y){
		alert("Cannot contact server or got wrong response");
	});
}

function buildings_click_write(alt){
	var postdata = {};
	postdata["building_name"] = alt;
	postdata["max_rows"] = $("#max_rows").val();
	postdata["threads"] = $("#threads").val();
	postdata["floor_number"] = $("#floor_number").val();
	var temp = $("#temperature").val(), temp_min = temp.split(",")[0], temp_max = temp.split(",")[1];
	postdata["temperature_min"] = temp_min;
	postdata["temperature_max"] = temp_max;
	var light = $("#light").val(), light_min = light.split(",")[0], light_max = light.split(",")[1];
	postdata["light_min"] = light_min;
	postdata["light_max"] = light_max;
	$.post(server + "/start_load", postdata, function(data){
		alert(data);			
		loop_on = true;
		loop();
	}, "json").error(function(){
		alert("Cannot contact server or got wrong response");
	});
}

  
$(".hq_buildings").on("click", function(e) {	
	if ( $("#read_write").val() == "read" ){
		if(!loading){
			alert("Retrieving data from sensors on " + $(this).attr("alt"));			
			buildings_click_read($(this).attr("alt"));
			loading = true;
		}
	}
	else if ( $("#read_write").val() == "write" ){
		alert("Starting sensors on " + $(this).attr("alt"));			
		buildings_click_write($(this).attr("alt"));
	}
});

function initGauges() {

	data = google.visualization.arrayToDataTable([
	  ['Label', 'Value'],
	  ['Performance (%)', 0],
	  ['Used RAM (GB)', 0],
	  ['Free RAM (GB)', 0],
	  ['CPUs', 0],
	]);
	
	options = {
	 hAxis: {
		title: 'Days'
		},
	  width: 600, height: 120,
	  redFrom: 0, redTo: 10,
	  yellowFrom:10, yellowTo: 25,
	  greenFrom:75, greenTo: 100,
	  minorTicks: 5
	};
	
	curve_data = google.visualization.arrayToDataTable([
	  ['Day', 'Temperature Avg', 'Light Avg'],
	  ['1',  0, 0],
	  ['2',  0, 0],
	  ['3',  0, 0],
	  ['4',  0, 0]
	]);

	curve_options = {
	  title: 'Building Results',
	  curveType: 'function',
	  legend: { position: 'bottom' },
	  animation: {duration: 1000, easing: 'out',}
	};

	chart = new google.visualization.Gauge(document.getElementById('chart_div'));
	chart.draw(data, options);
	
	curve_chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
	curve_chart.draw(curve_data, curve_options);
}

function assign_area_codes(real_width, real_height){
   var orig_width = 1583;
   var orig_height = 623.7;  
   var orig_coords = {
       building100 : [115,188,391,362],
       building200 : [415,130,657,364],
       building300 : [720,136,885,362],
       building400 : [936,198,1050,357],
       building500 : [1101,250,1261,358],
       building600 : [1313,248,1515,364]
   };
   var real_coords = {
       building100 : [ ( real_width * orig_coords.building100[0] ) / orig_width,
                   ( real_height * orig_coords.building100[1] ) / orig_height,
                   ( real_width * orig_coords.building100[2] ) / orig_width,
                   ( real_height * orig_coords.building100[3] ) / orig_height ],
       building200 : [ ( real_width * orig_coords.building200[0] ) / orig_width,
                   ( real_height * orig_coords.building200[1] ) / orig_height,
                   ( real_width * orig_coords.building200[2] ) / orig_width,
                   ( real_height * orig_coords.building200[3] ) / orig_height ],
       building300 : [ ( real_width * orig_coords.building300[0] ) / orig_width,
                   ( real_height * orig_coords.building300[1] ) / orig_height,
                   ( real_width * orig_coords.building300[2] ) / orig_width,
                   ( real_height * orig_coords.building300[3] ) / orig_height ],
       building400 : [ ( real_width * orig_coords.building400[0] ) / orig_width,
                   ( real_height * orig_coords.building400[1] ) / orig_height,
                   ( real_width * orig_coords.building400[2] ) / orig_width,
                   ( real_height * orig_coords.building400[3] ) / orig_height ],
       building500 : [ ( real_width * orig_coords.building500[0] ) / orig_width,
                   ( real_height * orig_coords.building500[1] ) / orig_height,
                   ( real_width * orig_coords.building500[2] ) / orig_width,
                   ( real_height * orig_coords.building500[3] ) / orig_height ],
       building600 : [ ( real_width * orig_coords.building600[0] ) / orig_width,
                   ( real_height * orig_coords.building600[1] ) / orig_height,
                   ( real_width * orig_coords.building600[2] ) / orig_width,
                   ( real_height * orig_coords.building600[3] ) / orig_height ]
   };
   $("#building100").attr("coords", real_coords.building100[0] + "," + real_coords.building100[1] + "," + real_coords.building100[2] + "," + real_coords.building100[3] );
   $("#building200").attr("coords", real_coords.building200[0] + "," + real_coords.building200[1] + "," + real_coords.building200[2] + "," + real_coords.building200[3] );
   $("#building300").attr("coords", real_coords.building300[0] + "," + real_coords.building300[1] + "," + real_coords.building300[2] + "," + real_coords.building300[3] );
   $("#building400").attr("coords", real_coords.building400[0] + "," + real_coords.building400[1] + "," + real_coords.building400[2] + "," + real_coords.building400[3] );
   $("#building500").attr("coords", real_coords.building500[0] + "," + real_coords.building500[1] + "," + real_coords.building500[2] + "," + real_coords.building500[3] );
   $("#building600").attr("coords", real_coords.building600[0] + "," + real_coords.building600[1] + "," + real_coords.building600[2] + "," + real_coords.building600[3] );
}

$("img#buildings").load(function(){
 var image = $("#buildings")[0];
  assign_area_codes(image.width, image.height);  
});

$( window ).resize(function() {
  var image = $("#buildings")[0];
  assign_area_codes(image.width, image.height);
});

$(document).ready(function (){	
	
	google.charts.load('current', {'packages':['gauge', 'corechart']});
	google.charts.setOnLoadCallback(initGauges);
  $( window ).resize();
});
