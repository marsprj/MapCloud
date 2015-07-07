MapCloud.ChartDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 选中的数据源
	dataSource 	: null,

	// 选中的数据
	dataSet 	: null,

	// 专题图类型
	chartType 	: null,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;

		// 选择数据源,弹出数据源窗口
		dialog.panel.find("#chart_select_dbs").each(function(){
			$(this).click(function(){
				// MapCloud.data_source_dialog.showDialog("select");
				MapCloud.db_admin_dialog.showDialog("chart");
			});
		});


		// 确定
		dialog.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var name = dialog.panel.find("#chart_name").val();
				if(name == null || name == ""){
					alert("请输入名称！");
					return;
				}
				if(dialog.dataSource == null || 
					dialog.dataSet == null){
					alert("请选择数据");
					return;
				}
				if(dialog.chartType == "range"){
					// MapCloud.chart_panel.showPanel();
					MapCloud.chart_panel.setTable(dialog.dataSource,dialog.dataSet);
					dialog.closeDialog();
				}else if(dialog.chartType == "bar"){
					MapCloud.bar_chart_panel.showPanel();
					MapCloud.bar_chart_panel.setTable(dialog.dataSource,dialog.dataSet);
					dialog.closeDialog();
				}else if(dialog.chartType == "pie"){
					MapCloud.pie_chart_panel.showPanel();
					MapCloud.pie_chart_panel.setTable(dialog.dataSource,dialog.dataSet);
					dialog.closeDialog();
				}
			});
		});

	},

	// 选择数据源返回的数据源和数据
	setDataSet : function(dataSource,dataSet){
		if(dataSource == null || dataSet == null){
			return;
		}
		this.dataSource = dataSource;
		this.dataSet = dataSet;
		var text = "数据源：" + dataSource.name 
				+ "; 数据：" + dataSet.name;
		this.panel.find("#chart_dbs").val(text);

		this.panel.find("#chart_name").val(dataSet.name);	
	},

	setChartType : function(type){
		this.chartType = type;
	},

	cleanup : function(){
		this.dataSource = null;
		this.dataSet = null;
		this.chartType = null;
		this.panel.find("#chart_name").val("");
		this.panel.find("#chart_dbs").val("");
	}

});