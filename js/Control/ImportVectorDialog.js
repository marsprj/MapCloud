// 导入矢量
MapCloud.ImportVectorDialog = MapCloud.Class(MapCloud.Dialog,{
	// 上传控件
	uploader 		: null,
	// 开始上传按钮
	uploadBtn 		: null,	
	// 上传的文件列表展示
	uploadList 		: null,
	// 上传状态
	uploadState 	: null,
	// 数据库	
	dataSources 	: null,
	// 指定上传的数据库
	dataSourceName 	: null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		// 关闭按钮
		this.panel.find(".btn-cancel").click(function(){
			dialog.closeDialog();
		});

		// 确定按钮
		this.panel.find(".btn-confirm").click(function(){
			dialog.closeDialog();
		});

		// 上传按钮
		this.uploadBtn = this.panel.find("#vector_upload");
		this.uploadBtn.click(function(){
			if(dialog.uploadState === 'uploading' ) {
				// 暂停上传
	            dialog.uploader.stop();
	        }else{
	        	// 上传
	            dialog.uploader.upload();
	        }
		});		
	},

	cleanup : function(){
		this.dataSourceName = null;
		this.source = null;
		this.panel.find("#vector_list").html("");
	},

	showDialog : function(){
		this.cleanup();
		this.panel.modal();
		this.uploadList = this.panel.find("#vector_list");
		this.uploadState = "pending";
		var dialog = this;
		// 获得数据库列表
		dbsManager.getDataSources(this.getDataSources_callback);

		// 初始化uploader
		if(this.uploader == null){
			this.createUploader();
		}else{
			this.panel.find("#picker").html("选择文件");
			this.panel.find("#picker").removeClass("webuploader-container");
			this.uploader = null;
			this.createUploader();
		}

	},

	closeDialog : function() {
		if(this.dataSourceName != null){
				MapCloud.data_source_dialog.refreshDatasource();
		}
		this.panel.modal("hide");
	},

	createUploader : function(){
		var dialog = this;
		this.uploader =  WebUploader.create({

		    // 文件接收服务端。
		    server: '/uploader/fileupload.php',
		    // server: 'http://webuploader.duapp.com/server/fileupload.php',

		    // 选择文件的按钮。可选。
		    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
		    pick: '#picker',

		    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
		    resize: false,

	        chunked: true,

	        accept :{
	        	title : "zip",
	        	extensions : 'zip',
	        	mimeTypes : 'application/zip'
	        }
		});

		// 加入到上传列表中
		this.uploader.on('fileQueued', function( file ) {
			var html = dialog.getFileHtml(file);
	        dialog.uploadList.append(html);

	        // 注册下拉按钮事件，展示更多的信息
	        dialog.panel.find("#" + file.id + " .btn-drop").click(function(){
	        	var row = $(this).parents(".list-group-item");
	        	var fileId = row.attr("id");
	        	var infosRow = dialog.panel
	        		.find(".list-group-item[fid='" + fileId + "']");
	        	if(infosRow.hasClass("info-invis")){
	        		// 展开
	        		infosRow.removeClass("info-invis");
	        		infosRow.addClass("info-vis");
	        		infosRow.slideDown().css("display","block");
	        	}else{
	        		// 收缩
	        		infosRow.addClass("info-invis");
	        		infosRow.removeClass("info-vis");
	        		infosRow.slideUp();
	        	}
	        });
	        
	    });

		// 文件上传过程中创建进度条实时显示。
	    this.uploader.on('uploadProgress', function( file, percentage ) {
	        var li = dialog.panel.find("#" + file.id);
	        li.find(".progress .progress-bar").css('width', percentage * 100 + '%');
	        li.find('.state').text('上传中');
	    });

	    // 上传成功
		this.uploader.on('uploadSuccess', function( file ) {
			var dbName = null;
			if(dialog.dataSourceName != null){
				dbName = dialog.dataSourceName;
			}else{
				dbName = dialog.panel.find("#" + file.id 
				+ " .import-vector-db option:selected").val();
			}

			var stateHtml = dialog.panel.find("#" + file.id).find(".state");
			stateHtml.html("上传完毕,开始导入");

			var infosRow = dialog.panel
	        		.find(".list-group-item[fid='" + file.id + "']"); 
	        var typeName = infosRow.find(".vector-type-name").val();
	        var srid = infosRow.find(".vector-srid").val();

	        // 导入数据
	        dialog.featureImport(dbName,typeName,file.name,srid,
	        	file.id,dialog.featureImport_callback);
	    });

		// 上传出错
		this.uploader.on( 'uploadError', function( file ) {
	        dialog.panel.find("#" + file.id).find(".state").text("上传出错");
	    });

		// 上传完毕
	    this.uploader.on( 'uploadComplete', function( file ) {
	    });

	    // 整体上传事件
	    this.uploader.on( 'all', function( type ) {
	        if ( type === 'startUpload' ) {
	            dialog.uploadState = 'uploading';
	        } else if ( type === 'stopUpload' ) {
	            dialog.uploadState = 'paused';
	        } else if ( type === 'uploadFinished' ) {
	            dialog.uploadState = 'done';
	            // alert("所有上传完毕！");
	        }

	        if ( dialog.uploadState === 'uploading' ) {
	            dialog.uploadBtn.text('暂停上传');
	        } else {
	            dialog.uploadBtn.text('开始上传');
	        }
	    });
	},

	// 获得数据源列表
	getDataSources_callback : function(dataSources){
		if(dataSources == null){
			return;
		}
		var dialog = MapCloud.importVector_dialog;
		dialog.dataSources = dataSources;
	},

	// 获得file的html
	getFileHtml : function(file){
		var name = file.name;
		var typeName = file.name.slice(0,file.name.indexOf(".zip"));
	    
	    var html = "<li class='list-group-item row' id='" + file.id + "'>"
	        +      	"    <div class='col-md-3 info'>"
	        +               file.name
	        +      	"    </div>";
	    if(this.dataSourceName != null){
	    	html +=	"    <div class='col-md-6 progress-div'>"
	        +      	"        <div class='progress progress-striped active'>"
	        +      	"            <div class='progress-bar' role='progressbar' style='width: 0%;''></div>"
	        +      	"        </div>"
	        +      	"    </div>"
	    }else{
	    	var dataSourcesHtml = this.getDataSourcesHtml(this.dataSources);
	    	html += "    <div class='col-md-4 progress-div'>"
	        +      	"        <div class='progress progress-striped active'>"
	        +      	"            <div class='progress-bar' role='progressbar' style='width: 0%;''></div>"
	        +      	"        </div>"
	        +      	"    </div>"
	        +	   	"	<div class='col-md-2 import-vector-db'>"
	        +		"		<select class='form-control'>"
	        + 				dataSourcesHtml
	        + 		"		</select>"
	        +		"	</div>"
	    }
	        
	    html +=  	"   <div class='col-md-2 state'>等待上传</div>"
	        + 		"	<div class='col-md-1 import-vector-infos'>"
	        +		"		<a class='btn btn-default btn-drop'><b class='caret'></b></a>"
	        +		"	</div>"
	        +		"</li>"
	        + 		"<li class='list-group-item row infos-row info-invis' fid='" + file.id + "'>"
	        +		"	<div class='col-md-2 info'>名称:</div>"
	        +		"	<div class='col-md-3'>"
	        +		"		<input type='text' class='form-control vector-type-name' value='" + typeName + "'>"
	        +		"	</div>"
	        +		"	<div class='col-md-2 info'>Srid:</div>"
	        +		"	<div class='col-md-3'>"
	        +		"		<input type='text' class='form-control vector-srid' value='4326'>"
	        +		"	</div>"
	        +		"</li>";
	    return html;	          
	},

	// 获得数据源的select htmml
	getDataSourcesHtml : function(dataSources){
		var html = "";
		for(var i = 0; i < dataSources.length;++i){
			var dataSource = dataSources[i];
			html += "<option value='" + dataSource.name + "'>"
			+ 		dataSource.name + "</option>";
		}
		return html;
	},

	// 导入数据
	featureImport : function(sourceName,typeName,shpName,srid,fileId,callback){
		if(sourceName == null || typeName == null 
			|| shpName == null || srid == null){
			return;
		}
		var that = this;

		var params = "service=gps&vesion=1.0.0&request=FeatureImport"
			+ "&sourcename=" + sourceName + "&typeName=" + typeName
			+ "&shpname=" + shpName + "&srid=" + srid
			+ "&fileId=" + fileId;
		$.ajax({
			type	:"get",
			url		: url,
			data	: encodeURI(params),
			dataType: "xml",
			async	: false,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(xml, textStatus){
				var result = that.parseFeatureImport(xml);
				var id = this.url.slice(this.url.indexOf("fileId=")+7,
					this.url.length);
				if(callback != null){
					callback(result,id);
				}
			},
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(){
			}
		});

	},

	parseFeatureImport : function(xml){
		var text = $(xml).find("FeatureImport").text();
		if(text.toUpperCase() == "SUCCESS"){
			result = "success";
		}else if($(xml).find("ExceptionText").text() != ""){
			result = $(xml).find("ExceptionText").text();
		}
		return result;
	},

	//导入回调函数
	featureImport_callback : function(result,id){
		var dialog = MapCloud.importVector_dialog;
		var stateHtml =  dialog.panel.find("#" + id).find(".state");
		var infosRow = dialog.panel.find(".list-group-item[fid='" + id + "']"); 
		var reImportBtn = infosRow.find(".btn-re-import");
		if(result == "success"){
			stateHtml.html("导入完毕");
			reImportBtn.remove();
		}else{
			stateHtml.html("导入失败:" + result);
			var file = dialog.uploader.getFile(id);
			if(file != null){
				// dialog.uploader.removeFile(file);
				if(reImportBtn.length != 1){
					var html = "<div class='col-md-2'>"
					+ "<a class='btn btn-success btn-re-import'>重新上传</a>"
					+ "</div>";
					infosRow.append(html);

					// 展开名称等信息
					if(infosRow.hasClass("info-invis")){
		        		infosRow.removeClass("info-invis");
		        		infosRow.addClass("info-vis");
		        		infosRow.slideDown().css("display","block");
		        	}

		        	// 重新导入
					infosRow.find(".btn-re-import").click(function(){
						var fid = $(this).parents(".list-group-item").attr("fid");
						var row = dialog.panel.find(".list-group-item[id='" + fid + "']");
						var dbName = null;
						if(dialog.dataSourceName != null){
							dbName = dialog.dataSourceName;
						}else{
							dbName = row.find(".import-vector-db option:selected").val();
						}
						var infosRow = dialog.panel.find(".list-group-item[fid='" + fid+ "']"); 
						var typeName = infosRow.find(".vector-type-name").val();
						var srid = infosRow.find(".vector-srid").val();
						var shpName = row.find(".info").html().trim();
						row.find(".progress-div .progress").addClass("active");
						// 导入数据
						dialog.featureImport(dbName,typeName,shpName,srid,
	        				fid,dialog.featureImport_callback);
					});
				}
			}
		}
		var row = dialog.panel.find(".list-group-item[id='" + id + "']");
		row.find(".progress-div .progress")
						.removeClass("active");
	},

	//datasource过来的
	setDataSource : function(dataSourceName){
		this.dataSourceName = dataSourceName;
	}


});