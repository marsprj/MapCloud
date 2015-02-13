
//新建地图
MapCloud.new_map_dlg = null;

//新建图层
MapCloud.new_layer_dialog = null;

//编辑图层
MapCloud.edit_layer_dialog = null;

//图层展示
MapCloud.layer_appearance_dialog = null;

//创建图层
MapCloud.create_layer_dialog = null;

//文件管理
MapCloud.file_dialog = null;

//数据库管理
MapCloud.database_dlg = null;

//数据库连接
MapCloud.pgis_connection_dialog = null;

//WFS图层连接
MapCloud.wfs_datasource_dialog = null;

//wms图层
MapCloud.wms_dialog = null;

//新建图表
MapCloud.new_chart_dialog = null;

//左侧刷新
MapCloud.refresh_panel = null;

//WFS图层
MapCloud.wfs_layer = null;

//WMS图层
MapCloud.wms_layer = null;

//当前选中的图层
MapCloud.selected_layer = null;

//
MapCloud.charts_array = new Array();

//wfs对应的图表
MapCloud.wfs_layer_chart = new Array();

//点样式
MapCloud.point_symbolizer = new GeoBeans.Style.PointSymbolizer();
MapCloud.point_symbolizer.size = 5;
MapCloud.point_symbolizer.fillColor = "rgba(126, 255, 212,1)";
MapCloud.point_symbolizer.outLineWidth = 0.3;
MapCloud.point_symbolizer.outLineColor = "rgba(255,0,0,1)";
MapCloud.point_symbolizer.outLineCap = GeoBeans.Style.LineCap.ROUND;;
MapCloud.point_symbolizer.outLineJoin =  GeoBeans.Style.LineJoin.ROUND;
MapCloud.point_symbolizer.showOutline = true;


//线样式
MapCloud.line_symbolizer = new GeoBeans.Style.LineSymbolizer();
MapCloud.line_symbolizer.width = 2;
MapCloud.line_symbolizer.color = "rgba(0,0,255,1)";
MapCloud.line_symbolizer.outLineCap = GeoBeans.Style.LineCap.ROUND;;
MapCloud.line_symbolizer.outLineJoin =  GeoBeans.Style.LineJoin.ROUND;
MapCloud.line_symbolizer.showOutline = true;

//面样式
MapCloud.polygon_symbolizer = new GeoBeans.Style.PolygonSymbolizer();
MapCloud.polygon_symbolizer.fillColor = "rgba(129,255,213,1)";
MapCloud.polygon_symbolizer.outLineWidth = 1;
MapCloud.polygon_symbolizer.outLineColor = "rgba(255,0,0,1)";
MapCloud.polygon_symbolizer.outLineCap = GeoBeans.Style.LineCap.ROUND;;
MapCloud.polygon_symbolizer.outLineJoin =  GeoBeans.Style.LineJoin.ROUND;
MapCloud.polygon_symbolizer.showOutline = true;


MapCloud.getLayerGeomType = function(layer){
	if(layer == null){
		return null;
	}
	var ft = layer.featureType;
	if(ft == null){
		ft = layer.workspace.getFeatureType(this.layer.typeName);
		if(ft == null){
			return null;
		}
		this.layer.featureType = ft;
	}
	var fieldsArray = ft.fields;
	if(fieldsArray == null){
		fieldsArray = layer.featureType.getFields();
		if(fieldsArray == null){
			return null;
		}
	}
	var geom = ft.geomFieldName;
	if(geom == null){
		return null;
	}

	var index = ft.getFieldIndex(geom);
	if(index < -1 || index >= fieldsArray.length){
		return null;
	}
	var field = fieldsArray[index];
	if(field == null){
		return null;
	}
	var geomType = field.geomType;
	return geomType;
};

MapCloud.getDeafaultSymbolizer = function(geomType){
	var symbolizer = null;
	var geomTypeLower = geomType.toLowerCase();
	switch(geomTypeLower){
		case "point":{
			symbolizer = MapCloud.point_symbolizer;
			break;
		}

		case "multipolygon":
		case "polygon":{
			symbolizer = MapCloud.polygon_symbolizer;
			break;
		}
		case "multilinestring":
		case "linestring":{
			symbolizer = MapCloud.line_symbolizer;
			break;
		}
		default:
			break;
	}

	return symbolizer;
};


MapCloud.hited_symbolizer = new GeoBeans.Style.PolygonSymbolizer();
MapCloud.hited_symbolizer.fillColor = "Red";
MapCloud.hited_symbolizer.showOutline = false;


//rgb转换
MapCloud.rgb2hex = function(rgb){
  if (rgb.charAt(0) == '#')
    return rgb;
 
  var ds = rgb.split(/\D+/);
  var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
  return "#" + MapCloud.zero_fill_hex(decimal, 6);
};

MapCloud.zero_fill_hex = function(num, digits){
  var s = num.toString(16);
  while (s.length < digits)
    s = "0" + s;
  return s;
	
};

//rgb & opacity to rgba
MapCloud.rgb2rgba = function(rgb,opacity){
	var rgba = "";
	var index1 = rgb.indexOf("(");
	var index2 = rgb.lastIndexOf(")");
	var rgbValue = rgb.slice(index1 + 1,index2);
	rgba = "rgba(" + rgbValue + "," + opacity + ")";
	return rgba;
};


//rgba to get rgb
MapCloud.rgba2rgb = function(rgba){
	var index1 = rgba.indexOf("(");
	var index2 = rgba.lastIndexOf(",");
	var rgbValue = rgba.slice(index1+1,index2);
	var rgb = "rgb(" + rgbValue + ")";
	return rgb;	
};

//rgba to opacity
MapCloud.rgba2Opacity = function(rgba){
	var index1 = rgba.lastIndexOf(",");
	var index2 = rgba.lastIndexOf(")");
	var opacity = rgba.slice(index1 + 1, index2);
	return opacity;
};



MapCloud.resizeCharts = function(){
	for(var i = 0; i < MapCloud.wfs_layer_chart.length; ++i){
		var wfsLayerChart = MapCloud.wfs_layer_chart[i];
		if(wfsLayerChart == null || wfsLayerChart.showFlag == false){
			continue;
		}
		var mapCanvasWidth = $("#mapCanvas").width();
		var mapCanvasHeight = $("#mapCanvas").height();			
		var chartsArray = wfsLayerChart.chartsArray;
		for(var j = 0; j < chartsArray.length; ++j){
			var chart = chartsArray[j];
			chart.resizeChartPosition();//先调整位置

			if(chart.screenX < 0 || chart.screenY < 0 || 
				chart.screenX > mapCanvasWidth || chart.screenY > mapCanvasHeight){
				//不需要显示的
				if(chart.showFlag){
					$("#" + chart.id).remove();		
				}
				chart.showFlag = false;
			}else{
				//需要显示的

				var interSetFlag = false;
				// 继而判断和以前的有没有交集
				for(var k = 0; k < j; ++k){
					var chartPre = chartsArray[k];
					if(chartPre.showFlag && chart.intersectRect(chartPre)){
						// 此时有交集
						interSetFlag = true;
						break;
					}

				}
				if(interSetFlag){
					$("#" + chart.id).remove();	
					chart.showFlag = false;	
				}else{
					//此时没有交集，应该显示
					if(chart.showFlag){
						// 以前就显示的
						var panel = $("#" + chart.id);
						panel.height(chart.height);
						panel.width(chart.width);
						panel.css("left",chart.screenX);
						panel.css("top",chart.screenY);					
						chart.chart.resize();
					}else{
						// 以前没有的
						chart.show();
					}
					chart.showFlag = true;					
				}

			}
		}
	}

}



