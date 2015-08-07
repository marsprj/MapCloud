MapCloud.GPSSridDialog = MapCloud.Class(MapCloud.Dialog,{

	// 每页显示的最大条数
	maxCount : 10,

	// 页数
	pageCount : null,

	// 显示的页数
	pageNumber : 5,

	// 来源
	source : null,

	// // srid 列表
	// list : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this,arguments);
		var dialog = this;

		this.registerPanelEvent();
	},	


	registerPanelEvent : function(){
		var dialog = this;

		// 查询
		this.panel.find(".btn-search-srid").click(function(){
			var sridName = dialog.panel.find(".search-srid-name").val();
			if(sridName == null || sridName == ""){
				MapCloud.notify.showInfo("请输入查询Srid","Warning");
				return;
			}
			MapCloud.notify.loading();
			dialog.panel.find(".srid-list-div").html("");
			gpsManager.getSpatialReferenceBySrid(sridName,dialog.getSpatialReferenceBySrid_callback);
		});

		// 确定
		this.panel.find(".btn-confirm").click(function(){
			if(dialog.source == "featureProject"){
				var row = dialog.panel.find(".srid-list-div .row.selected");
				var srid = row.attr("sname");
				if(srid == null){
					MapCloud.notify.showInfo("请选择一个空间参考","Warning");
					return;
				}	
				var parent = MapCloud.gps_feature_project_dialog;
				parent.setSrid(srid);			
			}
			dialog.closeDialog();
		
		});
	},

	showDialog : function(source){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
		
		this.source = source;
		// this.getSpatialReferenceList();
		this.getSpatialReferenceListCount();
	},

	cleanup : function(){
		this.panel.find(".srid-list-div").empty();
		this.panel.find(".search-srid-name").val();
		this.panel.find(".pagination").empty();
	},

	getSpatialReferenceList : function(count,offset){
		gpsManager.getSpatialReferenceList(count,offset,this.getSpatialReferenceList_callback);
	},

	// 获取个数
	getSpatialReferenceListCount : function(){
		gpsManager.getSpatialReferenceCount(this.getSpatialReferenceListCount_callback);
	},

	getSpatialReferenceListCount_callback : function(count){
		if(count == null){
			return;
		}
		var dialog = MapCloud.gps_srid_dialog;
		var pageCount = Math.ceil(count/dialog.maxCount);
		dialog.pageCount = pageCount;

		dialog.initPageControl(1,dialog.pageCount);
	},

	getSpatialReferenceList_callback : function(list){
		var dialog = MapCloud.gps_srid_dialog;
		dialog.showSridList(list);
		// dialog.setSpatialReferenceList(list);

	},

	// 设置列表
	setSpatialReferenceList : function(list){
		this.list = list;
		var pageCount = Math.ceil(list.length/this.maxCount);
		this.pageCount = pageCount;
		this.initPageControl(1,this.pageCount);
	},


	// 初始化页码
	initPageControl : function(currentPage,pageCount){
		if(currentPage <=0 || currentPage > pageCount){
			return;
		}
		var html = "";
		// 前一页
		if(currentPage == 1){
			html += '<li class="disabled">'
				+ '		<a href="#" aria-label="Previous">'
				+ '			<span aria-hidden="true">«</span>'
				+ '		</a>'
				+ '	</li>';
		}else{
			html += '<li>'
				+ '		<a href="#" aria-label="Previous">'
				+ '			<span aria-hidden="true">«</span>'
				+ '		</a>'
				+ '	</li>';
		}
		// 如果页码总数小于要展示的页码，则每个都显示
		if(pageCount <= this.pageNumber){
			for(var i = 1; i <= pageCount; ++i){
				if(i == currentPage){
					html += '<li class="active">'
					+ 	'	<a href="#">' + currentPage.toString() 
					+ 	'		<span class="sr-only">(current)</span>'
					// + 	'		<span class="sr-only">(' + currentPage + ')</span>'
					+	'</a>'
					+ 	'</li>';
				}else{
					html += "<li>"
						+ "<a href='#'>" + i + "</a>"
						+ "</li>";	
				}
			}	
		}else{
			// 开始不变化的页码
			var beginEndPage = pageCount - this.pageNumber + 1;
			if(currentPage <= beginEndPage){
				for(var i = currentPage; i < currentPage + this.pageNumber;++i){
					if(i == currentPage){
						html += '<li class="active">'
						+ 	'	<a href="#">' + currentPage
						// + 	'		<span class="sr-only">(current)</span>'
						+	'</a>'
						+ 	'</li>';
					}else{
						html += "<li>"
							+ "<a href='#'>" + i + "</a>"
							+ "</li>";	
					}					
				}
			}else{
				for(var i = beginEndPage; i <= pageCount; ++i){
					if(i == currentPage){
						html += '<li class="active">'
						+ 	'	<a href="#">' + currentPage
						// + 	'		<span class="sr-only">(current)</span>'
						+	'</a>'
						+ 	'</li>';
					}else{
						html += "<li>"
							+ "<a href='#'>" + i + "</a>"
							+ "</li>";	
					}
				}
			}
		}

		// 最后一页
		if(currentPage == pageCount){
			html += '<li class="disabled">'
				+ '		<a href="#" aria-label="Next">'
				+ '			<span aria-hidden="true">»</span>'
				+ '		</a>'
				+ '	</li>';
		}else{
			html += '<li>'
				+ '		<a href="#" aria-label="Next">'
				+ '			<span aria-hidden="true">»</span>'
				+ '		</a>'
				+ '	</li>';
		}

		this.panel.find(".pagination").html(html);

		this.registerPageEvent();

		// show currentPage Map

		// var startIndex = (currentPage-1) * this.maxCount;
		// var endIndex = currentPage*this.maxCount - 1;
		// this.showSridList(startIndex,endIndex);

		var offset = (currentPage-1) * this.maxCount
		this.getSpatialReferenceList(this.maxCount,offset);
	},

	//  翻页事件
	registerPageEvent : function(){
		var that = this;
		this.panel.find(".pagination li a").click(function(){
			var active = that.panel.find(".pagination li.active a").html();
			var currentPage = parseInt(active);

			var label = $(this).attr("aria-label");
			if(label == "Previous"){
				currentPage = currentPage - 1;
			}else if(label == "Next"){
				currentPage = currentPage + 1;
			}else{
				currentPage = parseInt($(this).html());
			}
			
			that.initPageControl(currentPage,that.pageCount);
		});
	},	
		
	// 展示srid 列表
	showSridList : function(list){
		if(list == null){
			return;
		}
		var srid = null;
		var html = "";
		for(var i = 0; i <= list.length; ++i){
			srid = list[i];
			if(srid == null){
				continue;
			}
			html += "<div class='row' sname='" + srid.srid + "'>"
			+ "<div class='col-md-1'>" + srid.srid + "</div>"
			+ "<div class='col-md-11 text-ellip'>" + srid.srtext + "</div>"
			+ "</div>";
		}
		this.panel.find(".srid-list-div").html(html);

		var dialog = this;
		this.panel.find(".srid-list-div .row").click(function(){
			dialog.panel.find(".srid-list-div .row.selected").removeClass("selected");
			$(this).addClass('selected');

		});	
	},

	getSpatialReferenceBySrid_callback : function(srid){
		MapCloud.notify.hideLoading();
		if(srid == null){
			return;
		}
		var dialog = MapCloud.gps_srid_dialog;

		var html = "<div class='row' sname='" + srid.srid + "'>"
			+ "<div class='col-md-1'>" + srid.srid + "</div>"
			+ "<div class='col-md-11 text-ellip'>" + srid.srtext + "</div>"
			+ "</div>";

		dialog.panel.find(".srid-list-div").html(html);

		
		dialog.panel.find(".srid-list-div .row").click(function(){
			dialog.panel.find(".srid-list-div .row.selected").removeClass("selected");
			$(this).addClass('selected');

		});	

	}


});