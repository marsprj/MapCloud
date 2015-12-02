MapView.SearchControl = MapView.Class({

	initialize : function(){
		this.registerSearchEvent();
	},
	
	destory : function(){
	},

	registerSearchEvent : function(){
		$("#search_btn").click(this.search);
	},

	search : function(){
		alert("Search Button");
	},
});