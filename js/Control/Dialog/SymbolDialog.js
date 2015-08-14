MapCloud.SymbolDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 符号
	symbols : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var dialog = this;
		this.panel.find(".btn-confirm").click(function(){
			if(dialog.source == "styleManager"){
				var selected = dialog.panel.find("li a.selected");
				var symbolIndex = selected.parent().attr("sindex");
				var symbol = dialog.symbols[symbolIndex];
				if(symbol == null){
					MapCloud.notify.showInfo("请选择一种样式","Warning");
					return;
				}
				var parentDialog = MapCloud.styleManager_dialog;
				parentDialog.setSymbol(symbol);
			}else if(dialog.source == "refresh"){
				var selected = dialog.panel.find("li a.selected");
				var symbolIndex = selected.parent().attr("sindex");
				var symbol = dialog.symbols[symbolIndex];
				if(symbol == null){
					MapCloud.notify.showInfo("请选择一种样式","Warning");
					return;
				}
				var parent = MapCloud.refresh_panel;
				parent.setSymbol(symbol);
			}
			dialog.closeDialog();
		});
	},

	showDialog : function(source,type,symbolName){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
		this.source = source;
		this.type = type;
		this.symbolName = symbolName;

		this.getSymbol(this.type);
	},

	cleanup : function(){
		this.panel.find("ul").empty();
		this.symbols = null;
		this.symbolName = null;
		this.type = null;
	},

	getSymbol : function(type){
		MapCloud.notify.loading();
		styleManager.getSymbols(type,this.getSymbol_callback);
	},

	getSymbol_callback : function(symbols){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.symbol_dialog;
		dialog.symbols = symbols;
		dialog.showSymbols(symbols);
	},

	showSymbols : function(symbols){
		var symbol = null;
		var html = "";
		var name = null;
		var icon = null;
		for(var i = 0; i < symbols.length; ++i){
			symbol = symbols[i];
			if(symbol == null){
				continue;
			}
			name = symbol.name;
			icon = symbol.icon;
			html += "<li class='symbol-wrapper' sindex='" + i + "'>"
			if(this.symbolName == name){
				html += "<a href='javascript:void(0)' class='symbol-thumb selected' " 
			}else{
				html += "<a href='javascript:void(0)' class='symbol-thumb' " ;
			}
				
			html += " style='background-image:url(" 
					+	icon + ")'></a>"
				+ "<div class='caption text-center'>"
				+ "	<h6>" + name + "</h6>"
				+ "</div>"
				+ "</li>"; 
		}
		this.panel.find("ul").html(html);

		var dialog = this;
		this.panel.find("li a").click(function(){
			dialog.panel.find("li a").removeClass("selected");
			$(this).addClass("selected");
		});
	}
});