MapCloud.StyleListDialog = MapCloud.Class(MapCloud.Dialog,{
	

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.panel.find(".btn-confirm").click(function(){
			var styleName = dialog.panel.find(".style-list").val();
			if(styleName == null || styleName == ""){
				MapCloud.notify.showInfo("请选择有效的样式","Warning");
				return;
			}
			var parentDialog = MapCloud.new_layer_dialog;
			var style = styleManager.getStyle(styleName);
			parentDialog.setStyle(style);
			dialog.closeDialog();
		});
	},

	cleanup : function(){
		this.panel.find(".style-list").html("");
	},

	showDialog : function(geomType){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);

		styleManager.getStyles();
		if(geomType == null){
			return;
		}
		var styleGeomType = MapCloud.styleManager_dialog.getStyleTypeByGeomType(geomType);
		if(styleGeomType == null){
			return;
		}

		var styles = styleManager.getStyleByType(styleGeomType);
		this.displayStyles(styles);
	},

	// 展示样式列表
	displayStyles : function(styles){
		if(styles == null){
			return;
		}
		var html = "";
		var style = null;
		var name = null;
		for(var i = 0; i<styles.length;++i){
			style = styles[i];
			if(style == null){
				continue;
			}
			name = style.name;
			html += "<option value='" + name + "'>" + name + "</option>";
		}
		this.panel.find(".style-list").html(html);
	},


});