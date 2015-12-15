MapCloud.TopicPanel = MapCloud.Class(MapCloud.Panel,{
	
	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		this.registerEvent();
	},


	registerEvent : function(){
		var that = this;

		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});
		this.panel.find(".mc-icon").click(function(){
			if($(this).hasClass("mc-stretch")){
				that.onStretch(this);
			}else if($(this).hasClass("mc-icon-enco")){
				MapCloud.searchPanel.showRangeChart();
			}
		});

	},

	onStretch : function(item){
		if($(item).hasClass("mc-icon-left")){
			this.panel.children().not(".mc-stretch").css("display","block");
			$(item).removeClass("mc-icon-left");
			$(item).addClass("mc-icon-right");
			this.panel.css("width","80px");
		}else{
			this.panel.children().not(".mc-stretch").css("display","none");
			$(item).removeClass("mc-icon-right");
			$(item).addClass("mc-icon-left");
			this.panel.css("width","40px");
		}
	},
});