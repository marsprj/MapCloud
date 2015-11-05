MapCloud.UsersPanel = MapCloud.Class({
	panel : null,
	// 在线用户数
	onLineUserCount : null,

	// 每页显示的用户数
	maxCount : 30,

	// 显示的页数
	pageNumber : 5,

	// 用户个数
	userCount : null,

	// 用户个数页码
	userPageCount : null,

	// 在线用户个数
	onLineUserCount : null,

	// 在线用户页码
	pageCount : null,

	initialize : function(id){
		this.panel = $("#" + id);
		
		this.registerPanelEvent();

		// this.getUserList();
		this.getUserListCount();
	},

	registerPanelEvent : function(){
		var that = this;

		// 用户列表
		this.panel.find(".user-list-btn").click(function(){
			// that.getUserList();
			that.getUserListCount();
		});

		// 在线列表
		this.panel.find(".online-user-btn").click(function(){
			that.getOnlineUserListCount();
		});

		// 刷新用户数
		this.panel.find(".refresh-user-list").click(function(){
			that.getUserListCount();
		});

		// 刷新在线用户数
		this.panel.find(".refresh-online-user-list").click(function(){
			that.getOnlineUserListCount();
		});
	},


	// 用户列表
	getUserList : function(count,offset){
		MapCloud.notify.loading();
		authManager.getUserList(count,offset,this.getUserList_callback);
	},


	getUserList_callback : function(users){
		MapCloud.notify.hideLoading();
		if(!$.isArray(users)){
			return;
		}
		var that = MapCloud.userPanel;
		var user = null;
		var html = "";
		var name = null, alias = null, email = null, role = null;
		for(var i = 0; i < users.length; ++i){
			user = users[i];
			if(user == null){
				continue;
			}
			name = user.name;
			alias = user.alias;
			email = user.email;
			role = user.role;
			html += "<div class='row' uname='" + name + "'>"
				+ 	"	<div class='col-md-1'>" + (i+1) + "</div>"
				+	"	<div class='col-md-2'>" + name + "</div>"
				+	"	<div class='col-md-2'>"	+ alias + "</div>"
				+	"	<div class='col-md-3'>"	+ email + "</div>"
				+	"	<div class='col-md-2'>"	+ role + "</div>"
				+	"	<div class='col-md-2'>"
				+	"		<a href='javascript:void(0)' class='oper enter-user'>访问</a>"
				+	"		<a href='javascript:void(0)' class='oper remove-user'>删除</a>"
				+	"	</div>"
				+	"</div>";
		}
		that.panel.find(".user-list").html(html);

		// 访问
		that.panel.find(".enter-user").click(function(){
			var name = $(this).parents(".row").first().attr("uname");
			if(name == null){
				return;
			}
			window.open("../Editor/index.html?name=" + name );
		});

		that.panel.find(".remove-user").click(function(){
			var name = $(this).parents(".row").first().attr("uname");
			if(name == null){
				return;
			}
			if(!confirm("确定删除用户[" + name + "]吗？")){
				return;
			}
			that.removeUser(name);
		});
	},

	// 用户总数
	getUserListCount : function(){
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#user_list_tab").css("display","block");
		this.panel.find(".user-list").empty();
		this.panel.find(".list-tree .row").removeClass("selected");
		this.panel.find(".user-list-btn").parents(".row").first().addClass("selected");
		this.panel.find(".users-count span").html(0);
		MapCloud.notify.loading();
		authManager.getUserCount(this.getUserCount_callback);
	},

	getUserCount_callback : function(count){
		if(!$.isNumeric(count)){
			return;
		}
		MapCloud.notify.hideLoading();
		var that = MapCloud.userPanel;
		that.userCount = count;
		that.panel.find(".users-count span").html(count);
		var pageCount = Math.ceil(count/that.maxCount);
		that.userPageCount = pageCount;
		that.initUserPageControl(1,that.userPageCount);

	},

	// 初始化用户列表页码
	initUserPageControl : function(currentPage,pageCount){
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

		this.panel.find("#user_list_tab .pagination").html(html);

		this.registerUserPageEvent();
		
		var offset = (currentPage-1) * this.maxCount;
		this.getUserList(this.maxCount,offset);
	},

	//  用户列表翻页事件
	registerUserPageEvent : function(){
		var that = this;
		this.panel.find("#user_list_tab .pagination li a").click(function(){
			var active = that.panel.find("#user_list_tab .pagination li.active a").html();
			var currentPage = parseInt(active);

			var label = $(this).attr("aria-label");
			if(label == "Previous"){
				currentPage = currentPage - 1;
			}else if(label == "Next"){
				currentPage = currentPage + 1;
			}else{
				currentPage = parseInt($(this).html());
			}
			
			that.initUserPageControl(currentPage,that.userPageCount);
		});
	},		

	// // 在线用户
	// getOnlineUserList : function(){
	// 	MapCloud.notify.loading();
	// 	authManager.getOnlineUser(null,null,this.getOnlineUserList_callback);
	// },
	// 获得在线用户的个数
	getOnlineUserListCount : function(){
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#online_user_tab").css("display","block");
		this.panel.find(".online-user-list").empty();
		this.panel.find(".list-tree .row").removeClass("selected");
		this.panel.find(".online-user-btn").parents(".row").first().addClass("selected");
		this.panel.find(".online-users-count span").html(0);
		MapCloud.notify.loading();
		authManager.getLoginCount(this.getOnlineUserListCount_callback);
	},

	getOnlineUserListCount_callback : function(count){
		if(count == null){
			return;
		}
		var that = MapCloud.userPanel;
		that.onLineUserCount = count;
		that.panel.find(".online-users-count span").html(count);
		var pageCount = Math.ceil(count/that.maxCount);
		that.pageCount = pageCount;
		that.initPageControl(1,that.pageCount);
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

		this.panel.find("#online_user_tab .pagination").html(html);

		this.registerPageEvent();
		
		var offset = (currentPage-1) * this.maxCount
		this.getOnlineUserList(this.maxCount,offset);
	},

	//  翻页事件
	registerPageEvent : function(){
		var that = this;
		this.panel.find("#online_user_tab .pagination li a").click(function(){
			var active = that.panel.find("#online_user_tab .pagination li.active a").html();
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

	getOnlineUserList : function(count,offset){
		MapCloud.notify.loading();
		authManager.getOnlineUser(count,offset,this.getOnlineUserList_callback);
	},

	getOnlineUserList_callback : function(users){
		MapCloud.notify.hideLoading();
		if(!$.isArray(users)){
			return;
		}
		var that = MapCloud.userPanel;
		var html = "";
		for(var i = 0; i < users.length;++i){
			var name = users[i];
			if(name == null){
				continue;
			}
			html += "<div class='row'>"
				+ 	"	<div class='col-md-1'>" + (i+1) + "</div>"
				+	"	<div class='col-md-2'>" + name + "</div>"
				+	"</div>";
		}
		that.panel.find(".online-user-list").html(html);
	},

	// 删除用户
	removeUser : function(name){
		MapCloud.notify.loading();
		authManager.removeUser(name,this.removeUser_callback);
	},

	removeUser_callback : function(result){
		MapCloud.notify.showInfo(result,"删除用户");
		var that = MapCloud.userPanel;
		that.getUserListCount();
	},

});