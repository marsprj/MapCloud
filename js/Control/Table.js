MapCloud.Table = MapCloud.Class({

	panel: null,

	height: 200,
	width: 300,
	number: 5,
	colModel: null,
	datas: null,
	page: 1,

	headerHtml : null,
	bodyHtml : null,
	footerHtml: null,
	html : null,
	clickCallback : null,
	initialize : function(id,width,height,colModel,datas,number){
		this.panel = $("#"+id);
		this.height = height;
		this.width = width;
		this.colModel = colModel;
		this.datas = datas;
		this.number = number;

		var dataCount = datas.length;
		this.page = Math.ceil(dataCount/number);
		this.createHeaderHtml();
		this.createBodyHtml(1);
		this.createFooterHtml(1);
	},

	createHeaderHtml: function(){
		var headerHtml = "<div class=\"table_grid_header\">";
		headerHtml += "<table  cellpadding=\"0\" cellspacing=\"0\" border=\"0\">"
		headerHtml += "<thead>";
		headerHtml += "<tr>";
		for(var i = 0; i < this.colModel.length; ++i){
			var col = this.colModel[i];
			var display = col.display;
			var name = col.name;
			var hide = col.hide;
			if(hide == true){
				headerHtml += "<td style =\"display:none\">";
			}else{
				headerHtml += "<td>";
			}
			headerHtml += "<div style=\"width:80px\">";
			headerHtml +=		display;
			headerHtml += "</div>";
			headerHtml += "</td>";
		}
		headerHtml += "</tr>";
		headerHtml += "</thead>";
		headerHtml += "</table>";
		headerHtml += "</div>";
		return headerHtml;
	},
	
	createBodyHtml:function(pageIndex){
//		bodyHtml = "<div class=\"table_grid_content\">"
		var bodyHtml = "";
		bodyHtml = "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
		bodyHtml += "<tbody>";

		var beginIndex = ( pageIndex - 1) * this.number;
		for(var i = beginIndex; i < beginIndex + this.number; ++i){
			var data = this.datas[i];
			if(data == null){
				continue;
			}
			if(i % 2 == 0){
				bodyHtml += "<tr>";
			}else{
				bodyHtml += "<tr class=\"erow\">";
			}
			

			for(var j = 0; j < this.colModel.length; ++j){
				var col = this.colModel[j];
				var hide = col.hide;
				
				if(hide == true){
					bodyHtml += "<td style=\"display:none\">";
				}else{
					bodyHtml += "<td>";
				}
				bodyHtml += "<div style=\"width:80px\">";
				bodyHtml += data[j];
				bodyHtml += "</div>";
				bodyHtml += "</td>";

			}
			bodyHtml += "</tr>";
		}
		bodyHtml += "</tbody>";
		bodyHtml += "</table>";
//		bodyHtml += "</div>";


		return bodyHtml;
	},
	createFooterHtml:function(indexPage){
		footerHtml = "<div class=\"table_grid_footer\">";
		footerHtml += "		<div>";
		footerHtml += "		<div class=\"mc-icon-first mc-icon float_left\"></div>";
		footerHtml += "		<div class=\"mc-icon-prev mc-icon float_left\"></div>";
		footerHtml += "		<input type=\"text\" class=\"float_left page\" value=\"" + indexPage + "\">";
		footerHtml += "		<span class=\"float_left\">/</span>";
		footerHtml += "		<span class=\"float_left\">" + this.page + "</span>";
		footerHtml += "		<div class=\"mc-icon-next mc-icon float_left\"></div>";
		footerHtml += "		<div class=\"mc-icon-last mc-icon float_left\"></div>";
		footerHtml += "		</div>";
		footerHtml += "</div>";
		return footerHtml;
	},
	show: function(clickCallback){
		html = "<div class='table_grid'>";
		html += this.createHeaderHtml();
		html += "<div class=\"table_grid_content\">";
		html += this.createBodyHtml(1);
		html += "</div>";
		html += this.createFooterHtml(1);
		html += "</div>";
		this.panel.html(html);

		var headerHeight = this.panel.find(".table_grid_header").height();
		var footerHeight = this.panel.find(".table_grid_footer").height();
		var bodyHeight = this.height - headerHeight - footerHeight;
		this.panel.find(".table_grid_content").css("height",bodyHeight + "px");

		this.panel.find(".table_grid_content").each(function(){
			$(this).scroll(function(){
				var left = $(".table_grid_content").scrollLeft();
				$(".table_grid_header").scrollLeft(left);
			});
		});


		var dialog = this;
		this.panel.find(".mc-icon-next").each(function(){
			$(this).click(function(){
				dialog.toNext();
			});
		});

		this.panel.find(".mc-icon-prev").each(function(){
			$(this).click(function(){
				dialog.toPrev();
			});
		});

		this.panel.find(".mc-icon-first").each(function(){
			$(this).click(function(){
				dialog.toFirst();
			});
		});

		this.panel.find(".mc-icon-last").each(function(){
			$(this).click(function(){
				dialog.toLast();
			});
		});	

		this.clickCallback = clickCallback;
		this.panel.find(".table_grid_content tr").each(function(){
			$(this).click(function(){
				dialog.clickCallback($(this));
			});
		});
	},
	
	toNext: function(){
		var currentPage = parseInt(this.panel.find(".page").val());
		var nextPage = currentPage + 1;
		this.toPage(nextPage);
/*		if(nextPage > this.page || nextPage < 1){
			return;
		}
		this.panel.find(".page").val(nextPage);
		var html = this.createBodyHtml(nextPage);
		this.panel.find(".table_grid_content").html(html);
		var dialog = this;
		this.panel.find(".table_grid_content tr").each(function(){
			$(this).click(function(){
				dialog.clickCallback($(this));
			});
		});
*/
	},

	toPrev: function(){
		var currentPage = parseInt(this.panel.find(".page").val());
		var prevPage = currentPage - 1;
		this.toPage(prevPage);
/*		if(prevPage > this.page || prevPage < 1){
			return;
		}
		this.panel.find(".page").val(prevPage);
		var html = this.createBodyHtml(prevPage);
		this.panel.find(".table_grid_content").html(html);
*/	},

	toFirst: function(){
		this.toPage(1);
/*		this.panel.find(".page").val('1');
		var html = this.createBodyHtml(1);
		this.panel.find(".table_grid_content").html(html);
*/	},
	toLast: function(){
		this.toPage(this.page);
/*		this.panel.find(".page").val(this.page);
		var html = this.createBodyHtml(this.page);
		this.panel.find(".table_grid_content").html(html);
*/	},

	toPage:function(page){
		if(page > this.page || page < 1){
			return;
		}
		this.panel.find(".page").val(page);
		var html = this.createBodyHtml(page);
		this.panel.find(".table_grid_content").html(html);
		var dialog = this;
		this.panel.find(".table_grid_content tr").each(function(){
			$(this).click(function(){
				dialog.clickCallback($(this));
			});
		});


	}

});