MapCloud.CreateLayerDialog = MapCloud.Class(MapCloud.Dialog, {
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		this.panel.click(function(){
			//dialog.closeDialog();
		});
		
		that = this;
		this.panel.find(".delete_btn").each(function(){
			$(this).click(function(){
				that.deleteAttr($(this));
			});
		});
		
		this.panel.find(".add_btn").each(function(){
			$(this).click(function(){
				that.addAttr();
			});
		});
	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
	},
	

	deleteAttr: function(obj){
		var li_length = $("#create_layer_dialog_attributes ul li").length;
		if(li_length <=1){
			return;
		}
		obj.parent().remove();
	
	},

	addAttr:function(){
		var html = "<li>"
					+	"<input type=\"text\"/>"
					+	"<select style=\"margin-left:20px\">"
					+	"	<option value=\"String\">String</option>"
					+	"	<option value=\"Real\">Real</option>"
					+	"	<option value=\"Integer\">Integer</option>"
					+	"</select>"
					+	"<div class=\"delete_btn\"></div>"
					+	"<div class=\"add_btn\"></div>"
					+	"</li>";

		$("#create_layer_dialog_attributes ul li:last").after(html);
		$("#create_layer_dialog_attributes ul li:last").find(".delete_btn").each(function(){
			$(this).click(function(){
				that.deleteAttr($(this));
			});
		});
		$("#create_layer_dialog_attributes ul li:last").find(".add_btn").each(function(){
			$(this).click(function(){
				that.addAttr();
			});
		});

		
	}
});
	