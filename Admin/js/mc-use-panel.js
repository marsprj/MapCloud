MapCloud.UsePanel = MapCloud.Class({
	panel : null,

	

	initialize : function(id){
		this.panel = $("#" + id);
		
		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var that = this;
		that.loadGluster();
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

	loadGluster : function(){
		var path = "js/gluster.xml";
		var that = this;
		$.get(path,function(xml){
			that.praseXML(xml);
		});
	},

	praseXML : function(xml){
		if(xml == null){
			return;
		}

		var count = $(xml).find("Count").text();
		var nodes = [];
		$(xml).find("Nodes>Node").each(function(){
			var host = $(this).find("Host").text();
			var uuid = $(this).find("Uuid").text();
			var state = $(this).find("State").text();
			var obj = {
				host : host,
				uuid : uuid,
				state : state
			};
			nodes.push(obj);
		});
		var glusterObj = {
			count : count,
			nodes : nodes
		};
		var that = MapCloud.usePanel;
		that.showGluster(glusterObj);
	},

	showGluster : function(glusterObj){
		if(glusterObj == null){
			return;
		}
		var count = glusterObj.count;
		this.panel.find("#gluster_node span").html(count);
		var nodes = glusterObj.nodes;
		if(nodes == null){
			return;
		}
		var node = null;
		var html = "";
		for(var i = 0; i < nodes.length;++i){
			node = nodes[i];
			if(node == null){
				continue;
			}
			html += "<tr>"
				+ 	"	<td class='td-width-20'>" + node.host + "</td>"
				+	"	<td  class='td-width-45'>" + node.uuid + "</td>"
				+	"	<td  class='td-width-35'>" + node.state + "</td>"
				+	"</tr>";
		}
		this.panel.find("#gluster_panel tbody").html(html);
	},
})