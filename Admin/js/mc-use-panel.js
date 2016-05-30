MapCloud.UsePanel = MapCloud.Class({
	panel : null,

	

	initialize : function(id){
		this.panel = $("#" + id);
		
		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var that = this;

	},


	getUseStat : function(){
		// alert(total);
		var freeSize = free.slice(0,free.length - 1);
		var usedSize = used.slice(0,used.length - 1);
		freeSize = parseFloat(freeSize);
		usedSize = parseFloat(usedSize);


		option = {
		    title : {
		        text: '分布式文件系统',
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient : 'vertical',
		        x : 'left',
		        data:['已使用空间','未使用空间']
		    },
		    toolbox: {
		        show : true,
		        feature : {
		            dataView : {show: true, readOnly: false},
		           
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    calculable : true,
		    series : [
		        {
		            name:'分布式文件系统',
		            type:'pie',
		            radius : '55%',
		            center: ['30%', '60%'],
		            data:[
		                {value:usedSize, name:'已使用空间'},
		                {value:freeSize, name:'未使用空间'},
		            ],
		            itemStyle:{
				    	normal : {
				    		 label : {
		                        position : 'inner',
		                        formatter : function (params) {                         
		                          return (params.percent - 0).toFixed(0) + '%'
		                        }
		                    },
		                    labelLine : {
		                        show : false
		                    }
				    	}
				    }
		        }
		    ],
		    animation:false,

		};
        var chart = echarts.init(document.getElementById('use_chart'),"macarons");
		chart.setOption(option);  


		this.panel.find("#total_size").html(total);
		this.panel.find("#used_size").html(used);
		this.panel.find("#free_size").html(free);
		this.panel.find("#usage_size").html(usage);

	},
})