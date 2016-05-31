MapCloud.JobPanel = MapCloud.Class({
	panel : null,

	jobManager : null,


	// 一页显示个数
    maxFeatures : 15,

    currentPage : null,

	initialize : function(id){
		this.panel = $("#" + id);
		
		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var that = this;
		this.panel.find('[data-toggle="tooltip"]').tooltip({container: 'body'});

		// this.setCurrentUser("admin");
		// this.getJobList();

		// 切换IP图表
		this.panel.find("#ip_list .btn-chart-table").click(function(){
			if(that.panel.find(".ip-chart-div").hasClass("active")){
				$(this).find("i").removeClass("fa-table").addClass("fa-bar-chart");
				that.panel.find("#ip_list .tab-div").removeClass("active");
				that.panel.find(".ip-table-div").addClass("active");
			}else{
				$(this).find("i").removeClass("fa-bar-chart").addClass("fa-table");
				that.panel.find("#ip_list .tab-div").removeClass("active");
				that.panel.find(".ip-chart-div").addClass("active");
			}
		});

		// 切换service图表
		this.panel.find("#service_list .btn-chart-table").click(function(){
			if(that.panel.find(".service-chart-div").hasClass("active")){
				$(this).find("i").removeClass("fa-table").addClass("fa-bar-chart");
				that.panel.find("#service_list .tab-div").removeClass("active");
				that.panel.find(".service-table-div").addClass("active");
			}else{
				$(this).find("i").removeClass("fa-bar-chart").addClass("fa-table");
				that.panel.find("#service_list .tab-div").removeClass("active");
				that.panel.find(".service-chart-div").addClass("active");
			}
		});

		// 时间选择器
		this.panel.find("input.date-picker").datetimepicker({
		    format: 'yyyy-mm-dd hh:00',
		    minView : 'day',
		    autoclose : true,
	        maxView : "year",
	        language : "zh-CN"
		});

	    // ip刷新服务
	    this.panel.find("#ip_list .btn-refresh").click(function(){
	    	that.refreshIpStat();
	    });

	    // service刷新服务请求
	    this.panel.find("#service_list .btn-refresh").click(function(){
	    	that.refreshServiceStat();
	    });		

	    // 翻页
	    this.panel.find("#job_list .pre-page").click(function(){
	    	if(that.currentPage >= 1){
	    		that.getJobListByPage(that.currentPage - 1);
	    	}
	    });	    
	    this.panel.find("#job_list .next-page").click(function(){
	    	var count = that.panel.find("#job_list tbody tr").length;
	    	if(count < that.maxFeatures){
	    		return;
	    	}
	    	that.getJobListByPage(that.currentPage + 1);
	    });

	    // 刷新请求列表
	    this.panel.find("#job_list .btn-refresh").click(function(){
	    	that.getJobListByPage(0);
	    });	    

	    // 查询用户
	    this.panel.find(".search-user").click(function(){
	    	var text = that.panel.find(".search-wrapper input").val();
	    	if(text == null || text == ""){
	    		MapCloud.notify.showInfo("请输入查询用户","Warning");
	    		return;
	    	}
	    	MapCloud.notify.loading();
	    	authManager.getUser(text,that.getUser_callback);
	    });

	    // 全部用户
	    this.panel.find(".all-user").click(function(){
	    	that.setCurrentUser("admin");
	    });
	},


	setCurrentUser : function(name){
		if(name == null){
			return;
		}
		var user = new GeoBeans.User(name);
		this.jobManager = user.getJobManager();
		var text = "";
		if(name == "admin"){
			text = "[全部用户]访问统计";
		}else{
			text = "用户[" + name + "]访问统计";
		}
		this.panel.find(".title_box").html(text);
		this.getJobList();
		this.setDeafaultIpStat();
		this.getUseStat();
	},

	getJobList : function(){
		this.getJobListByPage(0);
	},

	getJobListByPage : function(page){
		if(page < 0){
			return;
		}
		this.currentPage = page;
		var offset = page * this.maxFeatures;
		this.panel.find("#job_list tbody").empty();
		this.panel.find("#job_list .panel-body").addClass("loading");
		this.jobManager.getJob(this.maxFeatures, offset,this.getJobList_callback);
	},

	getJobList_callback : function(list){
		var that = MapCloud.jobPanel;
		that.panel.find("#job_list .panel-body").removeClass("loading");
		if(!$.isArray(list)){
			return;
		}
		that.showJobList(list);
	},	
	// 显示请求列表
	showJobList : function(list){
		if(list == null){
			return;
		}
		var obj = null;
		var html = "";
		for(var i = 0; i < list.length;++i){
			obj  = list[i];
			if(obj == null){
				continue;
			}
			html += "<tr>"
				+ 	"	<td class='td-width-15'>" + (obj.client == null||obj.client == ""?"&nbsp;":obj.client) + "</td>"
				+ 	"	<td class='td-width-15'>" + (obj.server == null||obj.server == ""?"&nbsp;":obj.server) + "</td>"
				+ 	"	<td class='td-width-20'>" + (obj.operation == null||obj.operation == ""?"&nbsp;":obj.operation) + "</td>"
				+ 	"	<td class='td-width-20'>" + (obj.startTime == null||obj.startTime == ""?"&nbsp;":obj.startTime) + "</td>"
				+ 	"	<td class='td-width-20'>" + (obj.endTime == null||obj.endTime==""?"&nbsp;":obj.endTime) + "</td>"
				+ 	"	<td class='td-width-10'>" + (obj.state == null||obj.state==""?"&nbsp;":obj.state) + "</td>"
				+ 	"</tr>";

		}
		this.panel.find("#job_list tbody").html(html);
	},	

	// 设置默认的IP表
	setDeafaultIpStat : function(){
		var now = new Date();
    	now.setMinutes(0);
    	now.setSeconds(0);
    	now.setMilliseconds(0);
    	var hour = now.getHours();
    	var date = this.dateAdd(now,"hour",1);
    	var preDate = this.dateAdd(date,"month",-1);
    	var startTime = this.toTimeFormat(preDate);
    	var endTime = this.toTimeFormat(date);
    	this.panel.find("#ip_start_date").val(startTime);
		this.panel.find("#ip_start_date").datetimepicker("update");

		this.panel.find("#ip_end_date").val(endTime);
		this.panel.find("#ip_end_date").datetimepicker("update");
		this.panel.find("#ip_list .panel-body").addClass("loading");
		this.panel.find("#ip_list tbody").empty();
		if(this.ipChart != null){
			this.ipChart.dispose();
			this.ipChart = null;
		}
		// this.panel.find("#ip_chart_div").empty();
		
		this.jobManager.getJobStatistics("client",null,startTime,endTime,this.getIpStat_callback);
	},

	getIpStat_callback : function(list){
		var that = MapCloud.jobPanel;
		that.panel.find("#ip_list .panel-body").removeClass("loading");
		if(!$.isArray(list)){
			return;
		}
		that.showIpTable(list);
		that.showIpStat(list);
		that.setDefaultServiceStat(list);
	},


	showIpTable : function(list){
		if(list == null){
			return;
		}
		var obj = null;
		var html = "";
		for(var i = 0; i < list.length;++i){
			obj = list[i];
			if(obj == null){
				continue;
			}
			if(obj.key == "192.168.111.82"){
				continue;
			}
			html += "<tr>"
				+	"	<td class='td-width-50'>" + obj.key + "</td>"
				+	"	<td class='td-width-50'>" + obj.count + "</td>"
				+	"</tr>";
		}
		this.panel.find(".ip-table-div tbody").html(html);
	},

	showIpStat : function(list){
		if(list == null){
			return;
		}

		var fieldList = [];
		var valueList = [];
		for(var i = 0; i < list.length;++i){
			if(list[i] != null){
				if(list[i].key == "192.168.111.82"){
					continue;
				}
				fieldList.push(list[i].key);
				valueList.push(parseFloat(list[i].count));
			}
		}
		this.showIPChart(fieldList,valueList);
	},	

	showIPChart : function(keyList,valueList){
		option = {
		    tooltip : {
		        trigger: 'axis',
		    },
		    legend: {
		        data:['访问次数' ]
		    },
		    grid: {
		        x: 100,
		        y :40,
		        y2 : 90,
		    },
		    xAxis : [
		        {
		            type : 'category',
		            axisTick : {show: false},
		            data : keyList,
		            axisLabel :{
		            	interval : "0",
		            	rotate : 45
		            }
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		   
		    toolbox: {
		        show : true,
		        feature : {
		            mark : {show: false},
		            dataView : {show: true, readOnly: false},
		            magicType: {show: true, type: ['line', 'bar']},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    series : [
		        {
		            name:'访问次数',
		            type:'bar',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'inside'
		                }
		            },
		            data:valueList,
		            clickable : true,
		            markPoint : {
		                data : [
			                {type : 'max', name: '最大值'}
			            ]
		            },
		        }
		    ]
		};
		if(this.ipChart == null){
			var chart = echarts.init(document.getElementById('ip_chart_div'),"macarons");
			chart.setOption(option);
			this.ipChart = chart;
			this.ipChart.on(echarts.config.EVENT.CLICK, eConsole);
		}else{
			if(this.ipChart.getSeries()== null){
				this.ipChart.dispose();
				var chart = echarts.init(document.getElementById('ip_chart_div'),"macarons");
				chart.setOption(option);
				this.ipChart = chart;
				this.ipChart.on(echarts.config.EVENT.CLICK, eConsole);
			}else{
				this.ipChart.clear();
				this.ipChart.setOption(option);
			}
		}
		

		var that = this;
		function eConsole(param) {
		    var name = param.name;
		    if(name != null){
		    	var list = [{
		    		key : name,
		    		value : param.data
		    	}];
		    	that.setDefaultServiceStat(list);
		    }
		}
	},	

	// 日期相加
	dateAdd : function(date,interval,units){
		var ret = new Date(date); //don't change original date
		switch(interval.toLowerCase()) {
			case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
			case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
			case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
			case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
			case 'day'    :  ret.setDate(ret.getDate() + units);  break;
			case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
			case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
			case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
			default       :  ret = undefined;  break;
		}
		return ret;
	},

	toTimeFormat : function(date){
		if(date == null){
			return null;
		}
		var yyyy = date.getFullYear().toString();
		var MM = (date.getMonth() + 1).toString();;
		var dd = date.getDate().toString();
		var hh = date.getHours().toString();
		var mm = date.getMinutes().toString();
   		var ss = date.getSeconds().toString();
   		 return yyyy + '-' + (MM[1]?MM:"0"+MM[0]) 
   		 + '-' + (dd[1]?dd:"0"+dd[0]) + ' ' + (hh[1]?hh:"0"+hh[0]) 
   		 + ':' + (mm[1]?mm:"0"+mm[0]) + ':' + (ss[1]?ss:"0"+ss[0]);
	},	

	// 设置默认的
	setDefaultServiceStat : function(list){
		if(list == null || list.length == 0){
			if(this.serviceChart != null){
				this.serviceChart.dispose();
			}
			this.panel.find(".service-chart-div").empty();
			this.panel.find(".service-table-div").empty();
			return;
		}
		var obj = list[0];
		if(obj == null){
			return;
		}
		var server = obj.key;
		this.panel.find("#service_list .panel-heading span").html(server);
		var startTime = this.panel.find("#ip_start_date").val();
		var endTime = this.panel.find("#ip_end_date").val();
		this.panel.find("#service_start_date").val(startTime);
		this.panel.find("#service_start_date").datetimepicker("update");
		this.panel.find("#service_end_date").val(endTime);
		this.panel.find("#service_end_date").datetimepicker("update");
		if(this.serviceChart != null){
			this.serviceChart.dispose();
			this.serviceChart = null;
		}
		this.panel.find("#service_list .panel-body").addClass("loading");
		this.panel.find(".service-field option[value='operation']").prop("selected",true);
		this.jobManager.getJobStatistics("operation",server,startTime,endTime,this.getServiceStat_callback);
	},	

	getServiceStat_callback : function(result){
		var that = MapCloud.jobPanel;
		that.panel.find("#service_list .panel-body").removeClass("loading");
		if(!$.isArray(result)){
			return;
		}
		that.showServiceTable(result);
		that.showServiceStat(result);
	}, 

	// 显示服务统计表
	showServiceTable : function(list){
		if(list == null){
			return;
		}
		var obj = null;
		var html = "";
		for(var i = 0; i < list.length;++i){
			obj = list[i];
			if(obj == null){
				continue;
			}
			html += "<tr>"
				+	"	<td class='td-width-50'>" + obj.key + "</td>"
				+	"	<td class='td-width-50'>" + obj.count + "</td>"
				+	"</tr>";
		}
		this.panel.find(".service-table-div tbody").html(html);
	},

	// 显示服务统计图
	showServiceStat : function(list){
		if(list == null){
			return;
		}
		var fieldList = [];
		var valueList = [];
		for(var i = 0; i < list.length;++i){
			if(list[i] != null){
				fieldList.push(list[i].key);
				valueList.push(list[i].count);
			}
		}
		this.showServiceChart(fieldList,valueList);
	},

// x轴为类型
	showServiceChart : function(keyList,valueList){
		var option = {
		    tooltip : {
		        trigger: 'axis',
		    },
		    legend: {
		        data:['访问次数' ]
		    },
		    grid: {
		        x: 40,
		        y :40,
		        y2 : 120
		        // y2 : 30
		    },
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    xAxis : [
		        {
		            type : 'category',
		            axisTick : {show: false},
		            data : keyList,
		            axisLabel :{
		            	interval : 0,
		            	rotate : 45
		            }
		        }
		    ],
		    toolbox: {
		        show : true,
		        feature : {
		            mark : {show: false},
		            dataView : {show: true, readOnly: false},
		            magicType: {show: true, type: ['line', 'bar']},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    series : [
		        {
		            name:'访问次数',
		            type:'line',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'inside'
		                }
		            },
		            data:valueList,
		            itemStyle: {normal: {areaStyle: {type: 'default'}}},
		        }
		    ]
		};
		if(this.serviceChart == null){
			var chart = echarts.init(document.getElementById('service_chart_div'),"macarons");
			chart.setOption(option);
			this.serviceChart = chart;
		}else{
			if(this.serviceChart.getSeries()== null){
				this.serviceChart.dispose();
				var chart = echarts.init(document.getElementById('service_chart_div'),"macarons");
				chart.setOption(option);
				this.serviceChart = chart;
			}else{
				this.serviceChart.clear();
				this.serviceChart.setOption(option);
			}
		}
	},

	// 刷新IP
	refreshIpStat : function(){
		var startTime = this.panel.find("#ip_start_date").val();
		var endTime = this.panel.find("#ip_end_date").val();

		if((new Date(endTime) - new Date(startTime))<= 0){
			MapCloud.notify.showInfo("请选择有效的时间段","Warning");
			return;
		}
		this.panel.find("#ip_list .panel-body").addClass("loading");
		this.jobManager.getJobStatistics("client",null,startTime,endTime,this.getIpStat_callback);
	},	

	// 刷新服务请求
	refreshServiceStat : function(){
		var field = this.panel.find(".service-field").val();
		var startTime = this.panel.find("#service_start_date").val();
		var endTime = this.panel.find("#service_end_date").val();

		if((new Date(endTime) - new Date(startTime))<= 0){
			MapCloud.notify.showInfo("请选择有效的时间段","Warning");
			return;
		}

		var client = this.panel.find("#service_list .panel-heading strong  span").html();
		
		
		this.panel.find(".service-table-div tbody").empty();
		this.panel.find("#service_list .panel-body").addClass("loading");
		this.jobManager.getJobStatistics(field,client,startTime,endTime,this.getServiceStat_callback);
	},

	getUser_callback : function(result){
		if(!(result instanceof Object)){
			MapCloud.notify.showInfo(result,"Warning");
			return;
		}
		MapCloud.notify.hideLoading();
		var that = MapCloud.jobPanel;
		that.setCurrentUser(result.name);
	},

	// 获得使用情况
	getUseStat : function(){


	},

	getUseStat : function(){
		var that = this;
		var params = "service=" + this.service + "&version="
					+ this.version + "&request=RemoveMap"
					+ "&name=" + name;
		this.removeMapResult = null;
		$.ajax({
			type 	: "get",
			url 	: this.server,
			data 	: encodeURI(params),
			dataType:"xml",
			async : false,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(xml, textStatus){
				var result = that.parseRemoveMap(xml);
				that.removeMapResult = result;
			},			 
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(){
			}
		});
	}


});