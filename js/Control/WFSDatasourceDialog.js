MapCloud.WFSDatasourceDialog = MapCloud.Class(MapCloud.Dialog, {
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		this.panel.click(function(){
			//dialog.closeDialog();
		});
		this.registerTabEvents();


		this.panel.find("#wfs_datasource_get_info").each(function(){
			$(this).click(function(){
				dialog.panel.find("#wfs_datasource_layer_url").each(function(){
					var url = $(this).val();
					if(url== ""){
						alert("Пе");
						return;
					}
					var version = "1.0.0";

					var wfsworkspace = new GeoBeans.WFSWorkspace("world", url, version);
				});
			});
		});
		
	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
	},
	
	registerTabEvents:function(){
		var that = this;
		this.panel.find(".mc-tabs-ul li").each(function(index,element){
			$(this).click(function(e){
				that.panel.find(".mc-tab-form").each(function(){
					$(this).removeClass("active_tab");
				});

				that.panel.find(".mc-tab-form:eq(" +index + ")").addClass("active_tab");

				that.panel.find(".mc-tabs-ul li").removeClass("active");
				$(this).addClass("active");

				
			});
		});
	}
	
	
		
});
	