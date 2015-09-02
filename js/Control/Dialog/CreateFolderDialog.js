MapCloud.CreateFolderDialog = MapCloud.Class(MapCloud.Dialog,{
	// 来源
	source : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.panel.find(".btn-confirm").click(function(){
			var name = dialog.panel.find("#create_folder_name").val();
			if(name == ""){
				MapCloud.notify.showInfo("请输入名称","Warning");
				dialog.panel.find("#create_folder_name").focus();
				return;
			}
			var nameReg = /^[0-9a-zA-Z_]+$/;
			if(!nameReg.test(name)){
				MapCloud.notify.showInfo("请输入有效的名称","Warning");
				dialog.panel.find("#create_folder_name").focus();
				return;
			}
			if(dialog.source == "file"){
				MapCloud.file_dialog.setCreateFolderName(name);
			}else if(dialog.source == "raster"){
				MapCloud.raster_db_dialog.setCreateFolderName(name);
			}
			
			dialog.closeDialog();
		});
	},

	cleanup : function(){
		this.panel.find("#create_folder_name").val("");
	},

	showDialog : function(source){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
		this.source = source;
	},

});