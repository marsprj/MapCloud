MapCloud.NewChartDialog = MapCloud.Class(MapCloud.Dialog,{
	
	option : null,
	layers : new Array(),
	layer : null,
	id : -1,	//MapCloud.wfs_layer_chart中的ID

	initialize : function(){
		MapCloud.Dialog.prototype.initialize.apply(this,arguments);

		var dialog = this;

		this.panel.find("#newChartDialogTab a").each(function(){
			$(this).click(function(e){
				e.preventDefault()
				$(this).tab("show");
			});
		});		

		// //设置图层
		// dialog.panel.find("#chart_wfs_layer").each(function(){
		// 	$(this).empty();
		// });		
		
		// var mapLayers = mapObj.layers;
		// for(var i = 0; i < mapLayers.length; ++i){
		// 	var ly = mapLayers[i];
		// 	if(ly instanceof GeoBeans.Layer.WFSLayer){
		// 		this.layers.push(ly);
		// 		dialog.panel.find("#chart_wfs_layer").each(function(){
		// 			var html = "<option value='" + ly.name + "'>" + ly.name + "</option>";
		// 			$(this).append(html);
		// 		});
		// 	}
		// }



		// //设置字段
		// dialog.panel.find("#chart_wfs_layer").each(function(){
		// 	dialog.setWfsLayerFields($(this));
		// 	$(this).change(function(){
		// 		dialog.setWfsLayerFields($(this));
		// 	});
		// })


		this.panel.find(".glyphicon-plus-sign").each(function(){
			$(this).click(function(){
				var field = $(this).parent().prev().children(".chart_wfs_layer_all_fields ").val();
				dialog.addSelectedField(field);
			});
		})
		

		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){	

				var activeTabPanel = dialog.panel.find(".tab-pane.active");

				var chartHeight = null;
				activeTabPanel.find(".chart_height").each(function(){
					chartHeight = parseFloat($(this).val());
				});

				var chartWidth = null;
				activeTabPanel.find(".chart_width").each(function(){
					chartWidth = parseFloat($(this).val());
				});

				var chartText = null;
				activeTabPanel.find(".chart_text").each(function(){
					chartText = $(this).val();
				});

				var wfsLayer = null;
				activeTabPanel.find(".chart_wfs_layer").each(function(){
					var wfsLayerName = $(this).val();
					wfsLayer = dialog.getLayer(wfsLayerName);					
				})



				if (wfsLayer == null) {
					alert("请选择图层")
					return;
				}

				dialog.layer = wfsLayer;

				//字段
				// var fieldArray = new Array();
				// activeTabPanel.find("input[name=chart_wfs_layer_fields]:checked").each(function(){
				// 	var value = $(this).val();
				// 	fieldArray.push(value);
				// });

				var fieldArray = new Array();
				activeTabPanel.find(".chart_wfs_layer_selected_field").each(function(){
					var value = $(this).val();
					fieldArray.push(value);
				})
				if(fieldArray.length == 0){
					alert("请选择字段！");
					return;
				}

				//空间字段
				var geomFieldName = wfsLayer.featureType.geomFieldName;
				var geomFieldIndex = wfsLayer.featureType.getFieldIndex(geomFieldName);				
				//字段的index
				var fieldIndexArray = new Array();
				for(var i = 0; i < fieldArray.length; ++i){
					var field = fieldArray[i];
					var index = wfsLayer.featureType.getFieldIndex(field);
					fieldIndexArray.push(index);
				}

				// //先设置居中
				// mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
				// mapObj.draw();	

				//偏移
				var chartOffsetX = null;
				chartOffsetX = parseFloat(activeTabPanel.find(".chart_offset_x").val());
				var chartOffsetY = null;
				chartOffsetY = parseFloat(activeTabPanel.find(".chart_offset_y").val());

				//图例
				var chartLegend = null;
				chartLegend = activeTabPanel.find("#chart_legend").prop("checked");

				//提示框
				var chartTooltip = null;
				chartTooltip = activeTabPanel.find("#chart_tooltip").prop("checked");

				var chartType = activeTabPanel.attr("id");
				switch(chartType){
					case "barChart":{
						//内边距
						var chartPaddingLeft = null;
						chartPaddingLeft = activeTabPanel.find("#chart_padding_left").val();
						var chartPaddingRight = null;
						chartPaddingRight = activeTabPanel.find("#chart_padding_right").val();
						var chartPaddingTop = null;
						chartPaddingTop = activeTabPanel.find("#chart_padding_top").val();
						var chartPaddingBottom = null;
						chartPaddingBottom = activeTabPanel.find("#chart_padding_bottom").val();


						//X轴
						var axisLabelX = null;
						axisLabelX = activeTabPanel.find("#chart_axis_label_x").prop("checked");
						var axisLineX = null;
						axisLineX = activeTabPanel.find("#chart_axis_line_x").prop("checked");
						var axisTickX = null;
						axisTickX = activeTabPanel.find("#chart_axis_tick_x").prop("checked");
						var splitLineX = null;
						splitLineX = activeTabPanel.find("#chart_split_line_x").prop("checked");




						//Y轴
						var axisLabelY = null;
						axisLabelY = activeTabPanel.find("#chart_axis_label_y").prop("checked");
						var splitLineY = null;
						splitLineY = activeTabPanel.find("#chart_split_line_y").prop("checked");
						var axisLineY = null;
						axisLineY = activeTabPanel.find("#chart_axis_line_y").prop("checked");
						var axisTickY = null;
						axisTickY = activeTabPanel.find("#chart_axis_tick_y").prop("checked");



						var range = dialog.getYAxisRange(fieldIndexArray);



						//X轴设置
						var xAxis = new Object();
						if(!axisLabelX){
							xAxis.axisLabel = new Object();
							xAxis.axisLabel.show = false;
						}
						if(!axisLineX){
							xAxis.axisLine = new Object();
							xAxis.axisLine.show = false;
						}
						if(!axisTickX){
							xAxis.axisTick = new Object();
							xAxis.axisTick.show = false;
						}
						if(!splitLineX){
							xAxis.splitLine = new Object();
							xAxis.splitLine.show = false;
						}

						//Y轴设置
						var yAxis = new Object();
						if(!axisLabelY){
							yAxis.axisLabel = new Object();
							yAxis.axisLabel.show = false;
						}
						if(!axisLineY){
							yAxis.axisLine = new Object();
							yAxis.axisLine.show = false;
						}
						if(!axisTickY){
							yAxis.axisTick = new Object();
							yAxis.axisTick.show = false;
						}
						if(!splitLineY){
							yAxis.splitLine = new Object();
							yAxis.splitLine.show = false;
						}		

						

						var chartsArray = new Array();
						var features = wfsLayer.features;
						for(var i = 0; i <features.length; ++i){
						 // for(var i = 0; i <2; ++i){
							//字段对应的值
							var feature = features[i];
							var featureValues = feature.values;
							var yAxisData = new Array();
							for(var j = 0; j < fieldIndexArray.length;++j){
								var index = fieldIndexArray[j];
								var value = featureValues[index];
								yAxisData.push(value);
							}
							//坐标
							var chartX = null;
							var chartY = null;
							var geometry = featureValues[geomFieldIndex];
							if(geometry instanceof GeoBeans.Geometry.Point){
								chartX = geometry.x;
								chartY = geometry.y;
							}
							
							yAxis.min = range[0];
							yAxis.max = range[1];

							xAxis.type = "category";
							xAxis.data = [""];

							var series = new Array();
							for(var j = 0; j < fieldArray.length; ++j){
								var field = fieldArray[j];
								var serieObj = new Object();
								serieObj.name = field;
								serieObj.type = "bar";
								serieObj.data = [parseFloat(featureValues[fieldIndexArray[j]])];
								// serieObj.data = [featureValues[fieldIndexArray[j]]];
								series.push(serieObj);
							}
							option = {
									tooltip: {
		               					show: chartTooltip
		            				},
		            				legend:{
		            					data: chartLegend?fieldArray:[]
		            				},
									grid:{
							            x : chartPaddingLeft,
							            y : chartPaddingTop,
							            x2 : chartPaddingRight,
							            y2 : chartPaddingBottom,								
						              	borderWidth : 0
						            },            				
									xAxis:[
											xAxis
									],
									yAxis:[
											yAxis
									],
									series: series,
									animation:false,
									calculable:false
									// series:[
									// 	{
									// 		name: '',
									// 		type: 'bar',
									// 		data: yAxisData
									// 	}
									// ]
								};

							if(dialog.id != -1){
								var id = "WFSChart" + dialog.id + dialog.layer.name + i;
							}else{
								var length = MapCloud.wfs_layer_chart.length;
								var id = "WFSChart" + length + dialog.layer.name + i;
							}

							var chart = new MapCloud.Chart(id,chartX,chartY,chartHeight,chartWidth,chartOffsetX,
																chartOffsetY,option);						
							// chart.show();
							chartsArray.push(chart);						
						}
						var wfsLayerChartOption = {
							type 	: 	'bar',
							text 	: 	chartText,
							fields 	: 	fieldArray,
							height  : 	chartHeight,
							width 	: 	chartWidth,
							offsetX : 	chartOffsetX,
							offsetY : 	chartOffsetY,
							legend 	: 	chartLegend,
							tooltip : 	chartTooltip,
							padding : 	{
											left 	: chartPaddingLeft,
											right 	: chartPaddingRight,
											top 	: chartPaddingTop,
											bottom 	: chartPaddingBottom
										},
							xAxis	: 	{
											axisLabel : axisLabelX,
											splitLine : splitLineX,
											axisLine  : axisLineX,
											axisTick  : axisTickX
										},
							yAxis	: 	{
											axisLabel : axisLabelY,
											splitLine : splitLineY,
											axisLine  : axisLineY,
											axisTick  : axisTickY						
										}
						};
						var wfsLayerChart = new MapCloud.WFSLayerChart(dialog.layer,chartsArray,wfsLayerChartOption);
						if(dialog.id != -1){
							wfsLayerChart.removeCharts(dialog.id);
							MapCloud.wfs_layer_chart[dialog.id] = wfsLayerChart;
							// wfsLayerChart.show();
							wfsLayerChart.showFront();
						}else{
							MapCloud.wfs_layer_chart.push(wfsLayerChart);
							// wfsLayerChart.show();
							wfsLayerChart.showFront();
						}
						dialog.closeDialog();

						var refresh = new MapCloud.refresh("left_panel");
						refresh.refreshPanel();						
						break;
					}
					case "pieChart":{
						var toolTip = new Object();
						if(chartTooltip){
							toolTip.trigger = 'item';
							toolTip.formatter= "{b} : {c} ({d}%)";
						}else{
							toolTip.show = false;
						}

						var chartRadiusMin = null;
						chartRadiusMin = activeTabPanel.find(".chart_radius_min").val();
						var chartRadiusMax = null;
						chartRadiusMax = activeTabPanel.find(".chart_radius_max").val();						

						var chartsArray = new Array();
						var features = wfsLayer.features;
						for(var i = 0; i <features.length; ++i){
						 // for(var i = 0; i <100; ++i){
							//字段对应的值
							var feature = features[i];
							var featureValues = feature.values;
							var dataArray = new Array();
							for(var j = 0; j < fieldIndexArray.length;++j){
								var index = fieldIndexArray[j];
								var value = featureValues[index];								
								var dataObj = new Object();
								dataObj.value = value;						
								dataObj.name = fieldArray[j];
								dataArray.push(dataObj);
							}
							//坐标
							var chartX = null;
							var chartY = null;
							var geometry = featureValues[geomFieldIndex];
							if(geometry instanceof GeoBeans.Geometry.Point){
								chartX = geometry.x;
								chartY = geometry.y;
							}
							var option = {
									tooltip:  toolTip,
		            				legend:{
		            					data: chartLegend?fieldArray:[]
		            				},
		            				series: [
		            					{
		            						name:chartText,
		            						type:'pie',
		            						radius:[chartRadiusMin,chartRadiusMax],
		            						center:['50%','50%'],
		            						data:dataArray,
								            itemStyle : {
								                normal : {
								                    label : {
								                        show : false
								                    },
								                    labelLine : {
								                        show : false
								                    }
								                }
								            }		            						
		            					}
		            				],
									animation:false,
									calculable:false

								};

							if(dialog.id != -1){
								var id = "WFSChart" + dialog.id + dialog.layer.name + i;
							}else{
								var length = MapCloud.wfs_layer_chart.length;
								var id = "WFSChart" + length + dialog.layer.name + i;
							}
							var chart = new MapCloud.Chart(id,chartX,chartY,chartHeight,chartWidth,chartOffsetX,
																chartOffsetY,option);						
							// chart.show();
							chartsArray.push(chart);

						}
						var wfsLayerChartOption = {
							type 	: 	'pie',
							text 	: 	chartText,
							fields 	: 	fieldArray,
							height  : 	chartHeight,
							width 	: 	chartWidth,
							offsetX : 	chartOffsetX,
							offsetY : 	chartOffsetY,
							legend 	: 	chartLegend,
							tooltip : 	chartTooltip,
							radius1	: 	chartRadiusMin,
							radius2 :	chartRadiusMax						
						}
						var wfsLayerChart = new MapCloud.WFSLayerChart(dialog.layer,chartsArray,wfsLayerChartOption);
						if(dialog.id != -1){
							wfsLayerChart.removeCharts(dialog.id);
							MapCloud.wfs_layer_chart[dialog.id] = wfsLayerChart;
							// wfsLayerChart.show();
							wfsLayerChart.showFront();
						}else{
							MapCloud.wfs_layer_chart.push(wfsLayerChart);
							wfsLayerChart.showFront();
							// wfsLayerChart.show();
						}
						dialog.closeDialog();

						var refresh = new MapCloud.refresh("left_panel");
						refresh.refreshPanel();						
						break;
					}
					default:
						break;
				}

			});
		});
	},

	cleanup : function(){
		// this.panel.find("#chart_wfs_layer").empty();
		// this.panel.find("#chart_wfs_layer_fields_div").empty();
		this.panel.find(".chart_text").val("");
		this.panel.find(".chart-wfs-layer-selected-field-div").remove();
		this.panel.find("#barChart .chart_height").val("80");
		this.panel.find("#pieChart .chart_height").val("10");		
		this.panel.find("#barChart .chart_width").val("10");
		this.panel.find("#pieChart .chart_width").val("10");
		this.panel.find(".chart_offset_x").val("0");
		this.panel.find(".chart_offset_y").val("0");
		this.panel.find(".chart_legend").prop("checked",false);
		this.panel.find(".chart_tooltip").prop("checked",true);
		this.panel.find(".chart_padding_left").val("10%");
		this.panel.find(".chart_padding_right").val("10%");
		this.panel.find(".chart_padding_top").val("10%");
		this.panel.find(".chart_padding_bottom").val("0%");
		this.panel.find(".chart_axis_label_x").prop("checked",false);
		this.panel.find(".chart_split_line_x").prop("checked",false);
		this.panel.find(".chart_axis_line_x").prop("checked",false);
		this.panel.find(".chart_axis_tick_x").prop("checked",false);
		this.panel.find(".chart_axis_label_y").prop("checked",false);
		this.panel.find(".chart_split_line_y").prop("checked",false);
		this.panel.find(".chart_axis_line_y").prop("checked",false);
		this.panel.find(".chart_axis_tick_y").prop("checked",false);
		this.panel.find(".chart_radius_min").val("0%");
		this.panel.find(".chart_radius_max").val("100%");
	},

	showDialog : function(){
		this.cleanup();
		var dialog = this;

		//设置图层
		dialog.panel.find(".chart_wfs_layer").each(function(){
			$(this).empty();
		});		
		
		this.layers = new Array();
		var mapLayers = mapObj.layers;
		for(var i = 0; i < mapLayers.length; ++i){
			var ly = mapLayers[i];
			if(ly instanceof GeoBeans.Layer.WFSLayer){
				this.layers.push(ly);
				dialog.panel.find(".chart_wfs_layer").each(function(){
					var html = "<option value='" + ly.name + "'>" + ly.name + "</option>";
					$(this).append(html);
				});
			}
		}

		
		//设置字段
		dialog.panel.find(".chart_wfs_layer").each(function(){
			dialog.setWfsLayerFields($(this));
			$(this).change(function(){
				dialog.setWfsLayerFields($(this));
			});
		})		
		this.panel.modal();
		//在这里对id进行复制
		dialog.id = -1;
	},	
	getLayer: function(layerName){
		for(var i = 0; i < this.layers.length; ++i){
			var layer = this.layers[i];
			if(layer.name == layerName){
				return layer;
			}
		}
		return null;
	},


	//设置字段，并限制只有数值类型的才可以
	setWfsLayerFields :function(wfsLayer){
		this.panel.find(".chart_wfs_layer_all_fields").each(function(){
			$(this).empty();
		});

		var wfsLayerName = wfsLayer.val();
		var layer = this.getLayer(wfsLayerName);
		if(layer != null){
			var fields = layer.featureType.fields;
			for(var i = 0; i < fields.length; ++i){
				var field = fields[i];
				var fieldType = field.type;
				var fieldTypeLower = fieldType.toLowerCase();
				if(fieldTypeLower == "int" || fieldTypeLower == "double" || fieldTypeLower == "float"){
					+ field.name + "'>" + field.name + "</label>";
					var html = "<option value='" + field.name + "'>" + field.name + "</option>";
					this.panel.find(".chart_wfs_layer_all_fields").each(function(){
						$(this).append(html);
					});
				}
			}
		}	
	},

	//获得Y轴数据的范围
	getYAxisRange:function(fieldIndexArray){
		var range = new Array();
		var dialog = this;
		var wfsLayer = null;
		this.panel.find(".chart_wfs_layer").each(function(){
			var wfsLayerName = $(this).val();
			wfsLayer = dialog.getLayer(wfsLayerName);					
		})
		var min = null;
		var max = null;
		var rangeField = this.getYAxisRangeByField(wfsLayer,fieldIndexArray[0]);
		min = rangeField[0];
		max = rangeField[1];
		for(var i = 1; i < fieldIndexArray.length; ++i){
			var fieldIndex = fieldIndexArray[i];
			rangeField = this.getYAxisRangeByField(wfsLayer,fieldIndex);

			if(rangeField[0] < min){
				min = rangeField[0];
			}
			if(rangeField[1] > max){
				max = rangeField[1];
			}
		}
		range[0] = min;
		range[1] = max;
		return range;
	},

	getYAxisRangeByField:function(wfsLayer,fieldIndex){
		var range = new Array();
		var features = wfsLayer.features;
		var min = parseFloat(features[0].values[fieldIndex]);
		var max = parseFloat(features[0].values[fieldIndex]);
		for(var i = 1; i < features.length;++i){
			var value = parseFloat(features[i].values[fieldIndex]);
			if(value < min){
				min = value;
			}
			if(value > max){
				max = value;
			}
		}
		range[0] = min;
		range[1] = max;
		return range;
	},
	//根据wfsLayer和option来初始化对话框
	setLayerOption:function(wfsLayer,option,id){
		if(wfsLayer == null || option == null){
			return;
		}
		this.id = id;
		var type = option.type;
		var text = option.text;
		var height = option.height;
		var width = option.width;
		var offsetX = option.offsetX;
		var offsetY = option.offsetY;
		var legend = option.legend;
		var tooltip = option.tooltip;

		this.panel.find("#newChartDialogTab a[href*='" + type + "']").tab("show");
		var tabActivePanel = this.panel.find(".tab-pane.active");

		var dialog = this;

		this.wfsLayer = wfsLayer;
		tabActivePanel.find(".chart_wfs_layer").each(function(){
			$(this).empty();
			var html = "<option value='" + wfsLayer.name + "'>" + wfsLayer.name + "</option>";
			$(this).append(html);
			dialog.setWfsLayerFields($(this));
		});		
		
		

		var fieldsInput = this.panel.find(".chart_wfs_layer_fields_div").children().children();
		var fields = option.fields;
		for(var i = 0; i < fields.length; ++i){
			var field = fields[i];
			dialog.addSelectedField(field);

			// for(var j = 0;j < fieldsInput.length; ++j){
			// 	var fieldInput = fieldsInput[j];
			// 	if(fieldInput.value == field){
			// 		tabActivePanel.find(".chart_wfs_layer_fields_div input[value='" + field + "']").prop("checked",true);
			// 		continue;
			// 	}
			// }
		}

		
		tabActivePanel.find(".chart_text").val(text);
		tabActivePanel.find(".chart_height").val(height);
		tabActivePanel.find(".chart_width").val(width);
		tabActivePanel.find(".chart_offset_x").val(offsetX);
		tabActivePanel.find(".chart_offset_y").val(offsetY);
		tabActivePanel.find(".chart_legend").prop("checked",legend);
		tabActivePanel.find(".chart_tooltip").prop("checked",tooltip);

		switch(type){
			case "bar":{
				var padding = option.padding;
				var left = padding.left;
				var right = padding.right;
				var top = padding.top;
				var bottom = padding.bottom;
				tabActivePanel.find(".chart_padding_left").val(left);
				tabActivePanel.find(".chart_padding_right").val(right);
				tabActivePanel.find(".chart_padding_top").val(top);
				tabActivePanel.find(".chart_padding_bottom").val(bottom);	
				
				var xAxis = option.xAxis;
				var axisLabelX = xAxis.axisLabel;
				var splitLineX = xAxis.splitLine;
				var axisLineX = xAxis.axisLine;
				var axisTickX = xAxis.axisTick;
				tabActivePanel.find(".chart_axis_label_x").prop("checked",axisLabelX);
				tabActivePanel.find(".chart_split_line_x").prop("checked",splitLineX);
				tabActivePanel.find(".chart_axis_line_x").prop("checked",axisLineX);
				tabActivePanel.find(".chart_axis_tick_x").prop("checked",axisTickX);
				var yAxis = option.yAxis;
				var axisLabelY = yAxis.axisLabel;
				var splitLineY = yAxis.splitLine;
				var axisLineY = yAxis.axisLine;
				var axisTickY = yAxis.axisTick;
				tabActivePanel.find(".chart_axis_label_y").prop("checked",axisLabelY);
				tabActivePanel.find(".chart_split_line_y").prop("checked",splitLineY);
				tabActivePanel.find(".chart_axis_line_y").prop("checked",axisLineY);
				tabActivePanel.find(".chart_axis_tick_y").prop("checked",axisTickY);							
				break;				
			}
			case "pie":{
				var radiusMin = option.radius1;
				var radiusMax = option.radius2;
				tabActivePanel.find(".chart_radius_min").val(radiusMin);
				tabActivePanel.find(".chart_radius_max").val(radiusMax);
				break;
			}
			default:
				break;
		}



	},

	addSelectedField:function(field){
		if(field == null){
			return;
		}

		var dialog = this;

		var html = "<div class=\"form-group form-group-sm chart-wfs-layer-selected-field-div\">"
				+	"	<label for=\"chart_wfs_layer_selected_field\" class=\"col-sm-2 control-label\">选中字段</label>"
				+	"	<div class=\"col-sm-4\">"
				+	"		<input class=\"chart_wfs_layer_selected_field form-control\" readonly value=\"" + field+ "\">"
				+	"	</div>"
				+	"	<div class=\"col-sm-1\" style=\"padding-top:6px;padding-bottom:6px;\">"
				+	"		<div class=\"glyphicon glyphicon-remove mc-icon\" style=\"font-size:18px;\"></div>"
				+	"	</div>"									
				+	"</div>";
		dialog.panel.find(".chart-text-div").before(html);
		dialog.panel.find(".chart_wfs_layer_all_fields option[value='" + field + "']").remove();

		var newFieldDiv = dialog.panel.find(".chart-text-div").prev();
		if(newFieldDiv.length == 0){
			return;
		}
		newFieldDiv.find(".glyphicon-remove").each(function(){
			$(this).click(function(){
				$(this).parents(".chart-wfs-layer-selected-field-div").remove();
				var value = $(this).parent().prev().children().val();
				var html = "<option value='" + value + "'>" + value + "</option>";
				dialog.panel.find(".chart_wfs_layer_all_fields").append(html);
			});
		});

	}

});