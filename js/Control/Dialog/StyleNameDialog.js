// 样式名称对话框
MapCloud.StyleNameDialog = MapCloud.Class(MapCloud.Dialog,{
	flag : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				dialog.onSetStyleName();
			});
		});

		// enter 
		this.panel.find("#wms_style_add_name").keypress(function(e){
			if(e.which == 13){
				dialog.onSetStyleName();
			}
		});
	},

	showDialog : function(){
		MapCloud.Dialog.prototype.showDialog.apply(this, arguments);
		var dialog = this;
		this.panel.on("shown.bs.modal",function(){
			dialog.panel.find("#wms_style_add_name").focus();
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
	},

	onSetStyleName : function(){
		var dialog = this;
		var name = dialog.panel.find("#wms_style_add_name").val();
		if(name == ""){
			MapCloud.notify.showInfo("请输入名称","Warning");
			dialog.panel.find("#wms_style_add_name").focus();
			return;
		}

		var nameReg = /^[0-9a-zA-Z_]+$/;
		if(!nameReg.test(name)){
			MapCloud.notify.showInfo("请输入有效的名称","Warning");
			dialog.panel.find("#wms_style_add_name").focus();
			return;
		}

		MapCloud.styleManager_dialog.setAddStyleName(name,dialog.flag);
		dialog.closeDialog();		
	},
});