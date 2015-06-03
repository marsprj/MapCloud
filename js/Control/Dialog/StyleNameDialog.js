// 样式名称对话框
MapCloud.StyleNameDialog = MapCloud.Class(MapCloud.Dialog,{
	flag : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var name = dialog.panel.find("#wms_style_add_name").val();
				if(name == ""){
					alert("请输入名称！");
					return;
				}


				MapCloud.styleManager_dialog.setAddStyleName(name,dialog.flag);
				dialog.closeDialog();
			});
		});
	},

	cleanup : function(){
		this.panel.find("#wms_style_add_name").val("");
	},

	setFlag : function(flag){
		this.flag = flag;
		
		// 是保存还是新建
		if(this.flag == "save"){
			this.panel.find(".modal-title").text("保存样式");
		}else if(this.flag == "add"){
			this.panel.find(".modal-title").text("新建样式");
		}
	}
});