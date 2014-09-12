MapCloud.EditLayerDialog = MapCloud.Class(MapCloud.Dialog, {
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		this.panel.click(function(){
			//dialog.closeDialog();
		});

		this.registerTabEvents();
		
	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
		this.panel.find("#map_name").each(function(){
			$(this).val("");
		});
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

				
				switch(index){
					case 0:
//						alert("0");
						break;
					case 1:
//						alert("1");
						break;
					case 2:
//						alert("2");
						break;
				}

			});
		});
	}
	
});
	