MapCloud.CreateFolderDialog = MapCloud.Class(MapCloud.Dialog,{
	

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.panel.find(".btn-confirm").click(function(){
			var name = dialog.panel.find("#create_folder_name").val();
			if(name == ""){
				MapCloud.alert_info.showInfo("请输入名称","Warning");
				return;
			}
			MapCloud.file_dialog.setCreateFolderName(name);
			dialog.closeDialog();
		});
	},

	cleanup : function(){
		this.panel.find("#create_folder_name").val("");
	}
});