var mapObj = null;
var ribbonObj = null;

$().ready(function(){
	
	var logo = new MapCloud.Logo();	
	var layersTree = new MapCloud.LayerTree();	
	ribbonObj = new MapCloud.Ribbon();
	
//	$("#center_panel").css("width", $(window).width()-$("#left_panel").width()-1); 
	
//	var center = new GeoBeans.Geometry.Point(0,0);	
//	var layer  = new GeoBeans.Layer.AMapLayer("gaode");
//	var mapCanvas = new MapCloud.MapCanvas("mapCanvas");	
//	mapObj = mapCanvas.map;
//	mapObj.setBaseLayer(layer);
//	mapObj.setCenter(center);
//	mapObj.setLevel(1);	
//
//	mapCanvas.resize();

	
	var ww = document.getElementById("mapCanvas_wrappper").clientWidth;
	var wh = document.getElementById("mapCanvas_wrappper").clientHeight;
	var canvas = document.getElementById('mapCanvas');
	canvas.setAttribute("width", ww);
	canvas.setAttribute("height", wh);
	var context = canvas.getContext('2d');
	context.fillStyle = 'rgba(0,255,0,0.25)';
	context.fillRect(0,0,ww,wh);
	
	mapObj = new GeoBeans.Map("mapCanvas");


	window.onresize = function(){
		var left_panel = $("#left_panel");
		var center_panel = $("#center_panel");
		
		var left_w = left_panel.width();
		var left_h = left_panel.height();
		
		center_panel.css("width", $(window).width()-left_w); 
		center_panel.css("height", $(window).height()-$("#head_panel").height()-$("#ribbon_wrapper").height());
		//$(center_panel).width(window.document.width-left_w);
		
		//mapCanvas.resize();
		
	};
	var datagrid_collapsed = true;
	$("#datagrid_wrapper .panel-header-collapse").click(function(){
		if(datagrid_collapsed){
			$("#datagrid_wrapper").css("height","300px");
			$("#mapCanvas_wrappper").css("bottom","300px");
			$(this).removeClass("mc-icon-close");
			$(this).addClass("mc-icon-expand");
			datagrid_collapsed = false;
		}else{
			$("#datagrid_wrapper").css("height","30px");
			$("#mapCanvas_wrappper").css("bottom","30px");
			$(this).addClass("mc-icon-close");
			$(this).removeClass("mc-icon-expand");
			datagrid_collapsed = true;
		}

	});

	$("#right_panel .panel-header-collapse").click(function(){
//		$("#center_panel").css("right","0px");
		$("#right_panel").css("display","none");
		$("#center_panel").removeClass("col-md-7");
		$("#center_panel").removeClass("col-xs-7");
		$("#center_panel").removeClass("col-lg-7");
		$("#center_panel").addClass("col-md-9");
		$("#center_panel").addClass("col-xs-9");
		$("#center_panel").addClass("col-lg-9");


	});

	mapObj.addEventListener("mousewheel", MapCloud.resizeCharts);



	var canvas = mapObj.canvas;
	var onMouseDown = function(e){
		e.preventDefault();
		var mouseX = e.layerX;
		var mouseY = e.layerY;
		var onMouseMove = function(e){
			e.preventDefault();
			var moveMouseX = e.layerX;
			var moveMouseY = e.layerY;
			var d_x = moveMouseX - mouseX;
			var d_y = moveMouseY - mouseY;

			for(var i = 0; i < MapCloud.wfs_layer_chart.length; ++i){
				var wfsLayerChart = MapCloud.wfs_layer_chart[i];
				if(wfsLayerChart == null){
					continue;
				}
				var chartsArray = wfsLayerChart.chartsArray;
				for(var j = 0; j < chartsArray.length; ++j){
					var chart = chartsArray[j];
					if(chart.showFlag){
						chart.move(d_x,d_y);
					}					
				}
			}			
			mouseX = moveMouseX;
			mouseY = moveMouseY;
		};
		var onMouseUp = function(e)	{
			e.preventDefault();
			canvas.removeEventListener("mousemove", onMouseMove);
			canvas.removeEventListener("mouseup", onMouseUp);

		}
		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("mouseup", onMouseUp);
	}
	canvas.addEventListener("mousedown", onMouseDown);

/*
	var symbolizer, rule, filter;
	var style = new GeoBeans.Style();

	symbolizer = new GeoBeans.Style.PolygonSymbolizer();
	symbolizer.fillColor = "Aquamarine";
	symbolizer.outLineWidth = 0.3;
	symbolizer.outLineColor = "Red";
	symbolizer.outLineCap	= GeoBeans.Style.LineCap.ROUND;
	symbolizer.outLineJoin  = GeoBeans.Style.LineJoin.ROUND;
	symbolizer.showOutline = true;
	filter = new GeoBeans.Filter("continent","Europe");	
	rule = new GeoBeans.Style.Rule(symbolizer, filter);
	style.addRule(rule);

	symbolizer = new GeoBeans.Style.PolygonSymbolizer();
	symbolizer.fillColor = "Beige";
	symbolizer.outLineWidth = 0.3;
	symbolizer.outLineColor = "Red";
	symbolizer.outLineCap	= GeoBeans.Style.LineCap.ROUND;
	symbolizer.outLineJoin  = GeoBeans.Style.LineJoin.ROUND;
	symbolizer.showOutline = true;
	filter = new GeoBeans.Filter("continent","Oceania");	
	rule = new GeoBeans.Style.Rule(symbolizer, filter);
	style.addRule(rule);

	symbolizer = new GeoBeans.Style.PolygonSymbolizer();
	symbolizer.fillColor = "BurlyWood";
	symbolizer.outLineWidth = 0.3;
	symbolizer.outLineColor = "Red";
	symbolizer.outLineCap	= GeoBeans.Style.LineCap.ROUND;
	symbolizer.outLineJoin  = GeoBeans.Style.LineJoin.ROUND;
	symbolizer.showOutline = true;
	filter = new GeoBeans.Filter("continent","Australia");	
	rule = new GeoBeans.Style.Rule(symbolizer, filter);
	style.addRule(rule);

	symbolizer = new GeoBeans.Style.PolygonSymbolizer();
	symbolizer.fillColor = "CornflowerBlue";
	symbolizer.outLineWidth = 0.3;
	symbolizer.outLineColor = "Red";
	symbolizer.outLineCap	= GeoBeans.Style.LineCap.ROUND;
	symbolizer.outLineJoin  = GeoBeans.Style.LineJoin.ROUND;
	symbolizer.showOutline = true;
	filter = new GeoBeans.Filter("continent","Asia");	
	rule = new GeoBeans.Style.Rule(symbolizer, filter);
	style.addRule(rule);

	symbolizer = new GeoBeans.Style.PolygonSymbolizer();
	symbolizer.fillColor = "Cyan";
	symbolizer.outLineWidth = 0.3;
	symbolizer.outLineColor = "Red";
	symbolizer.outLineCap	= GeoBeans.Style.LineCap.ROUND;
	symbolizer.outLineJoin  = GeoBeans.Style.LineJoin.ROUND;
	symbolizer.showOutline = true;
	filter = new GeoBeans.Filter("continent","Africa");	
	rule = new GeoBeans.Style.Rule(symbolizer, filter);
	style.addRule(rule);

	symbolizer = new GeoBeans.Style.PolygonSymbolizer();
	symbolizer.fillColor = "DarkKhaki";
	symbolizer.outLineWidth = 0.3;
	symbolizer.outLineColor = "Red";
	symbolizer.outLineCap	= GeoBeans.Style.LineCap.ROUND;
	symbolizer.outLineJoin  = GeoBeans.Style.LineJoin.ROUND;
	symbolizer.showOutline = true;
	filter = new GeoBeans.Filter("continent","North America");	
	rule = new GeoBeans.Style.Rule(symbolizer, filter);
	style.addRule(rule);

	symbolizer = new GeoBeans.Style.PolygonSymbolizer();
	symbolizer.fillColor = "DarkOrange";
	symbolizer.outLineWidth = 0.3;
	symbolizer.outLineColor = "Red";
	symbolizer.outLineCap	= GeoBeans.Style.LineCap.ROUND;
	symbolizer.outLineJoin  = GeoBeans.Style.LineJoin.ROUND;
	symbolizer.showOutline = true;
	filter = new GeoBeans.Filter("continent","Antarctica");	
	rule = new GeoBeans.Style.Rule(symbolizer, filter);
	style.addRule(rule);

	symbolizer = new GeoBeans.Style.PolygonSymbolizer();
	symbolizer.fillColor = "FireBrick";
	symbolizer.outLineWidth = 0.3;
	symbolizer.outLineColor = "Red";
	symbolizer.outLineCap	= GeoBeans.Style.LineCap.ROUND;
	symbolizer.outLineJoin  = GeoBeans.Style.LineJoin.ROUND;
	symbolizer.showOutline = true;
	filter = new GeoBeans.Filter("continent","South America");	
	rule = new GeoBeans.Style.Rule(symbolizer, filter);
	style.addRule(rule);
	var layer = null;		

	layer = new GeoBeans.Layer.WFSLayer("wfs",
										"/geoserver/radi/ows?",
										"radi:country",
										"GML2");
	layer.setStyle(style);	
	mapObj.addLayer(layer);			
	
	mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
	mapObj.draw();
	MapCloud.wfs_layer = layer;

*/
});

