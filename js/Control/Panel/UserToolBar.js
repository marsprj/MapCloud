MapCloud.UserToolBar = MapCloud.Class(MapCloud.Panel,{
	
	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);

		this.panel.find("#login_btn").click(function(){
			MapCloud.login_dialog.showDialog();
		});
	}

	
});