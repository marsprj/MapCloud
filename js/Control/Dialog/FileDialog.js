MapCloud.FileDialog = MapCloud.Class(MapCloud.Dialog, {
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		this.panel.click(function(){
			//dialog.closeDialog();
		});
		
		// var zTree;
		// var zNodes = [
		// 	{name: "文件源", open:true,children: [
		// 		{name: "文件列表1"},
		// 		{name: "文件列表2"}
		// 	]}
		// ];
		// var setting = {};
		// var t = $("#file_tree");
		// t = $.fn.zTree.init(t, setting, zNodes);


		// $('.file-dialog-content-flex').flexigrid({height:260});

		

	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
	}
	
});
	