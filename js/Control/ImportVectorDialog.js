MapCloud.ImportVectorDialog = MapCloud.Class(MapCloud.Dialog,{
	uploader 		: null,
	uploadBtn 		: null,	
	uploadList 		: null,
	uploadState 	: null,
	dataSources 	: null,

	importState 	: null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.panel.find(".btn-confirm").click(function(){
			dialog.closeDialog();
		});

		this.uploadBtn = this.panel.find("#vector_upload");
		this.uploadBtn.click(function(){
			if ( dialog.uploadState === 'uploading' ) {
	            dialog.uploader.stop();
	        } else {
	            // time = new Date();
	            dialog.uploader.upload();
	        }
		});		

	},
	cleanup : function(){
		this.dataSources = null;
		this.panel.find("#vector_list").html("");
	},

	showDialog : function(){
		this.readyImportFiles = [];
		this.cleanup();
		this.panel.modal();
		// this.uploadBtn = this.panel.find("#vector_upload");
		this.uploadList = this.panel.find("#vector_list");
		this.uploadState = "pending";
		var dialog = this;
		dbsManager.getDataSources(this.getDataSources_callback);

		if(this.uploader == null){
			this.createUploader();
		}else{
			this.panel.find("#picker").html("选择文件");
			this.panel.find("#picker").removeClass("webuploader-container");
			this.uploader = null;
			this.createUploader();
		}

	},

	createUploader : function(){
		var dialog = this;
		this.uploader =  WebUploader.create({
		    // swf文件路径
		    // swf: 'js/webuploader/Uploader.swf',

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
	        // 只允许选择文件，可选。
	        // accept: {
	        //     title: 'Images',
	        //     extensions: 'gif,jpg,jpeg,bmp,png',
	        //     mimeTypes: 'image/*'
	        // }
		});

		this.uploader.on('fileQueued', function( file ) {
			var name = file.name;
			var typeName = file.name.slice(0,file.name.indexOf(".zip"));
	        var dataSourcesHtml = dialog.getDataSourcesHtml(dialog.dataSources);
	        var html = "<li class='list-group-item row' id='" + file.id + "'>"
	            +      	"    <div class='col-md-3 info'>"
	            +               file.name
	            +      	"    </div>"
	            +      	"    <div class='col-md-4 progress-div'>"
	            +      	"        <div class='progress progress-striped active'>"
	            +      	"            <div class='progress-bar' role='progressbar' style='width: 0%;''></div>"
	            +      	"        </div>"
	            +      	"    </div>"
	            +	   	"	<div class='col-md-2 import-vector-db'>"
	            +		"		<select class='form-control'>"
	            + 				dataSourcesHtml
	            + 		"		</select>"
	            +		"	</div>"
	            +      	"   <div class='col-md-2 state'>等待上传</div>"
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
	        dialog.uploadList.append(html);
	        dialog.panel.find("#" + file.id + " .btn-drop").click(function(){
	        	var row = $(this).parents(".list-group-item");
	        	var fileId = row.attr("id");
	        	var infosRow = dialog.panel
	        		.find(".list-group-item[fid='" + fileId + "']");
	        	if(infosRow.hasClass("info-invis")){
	        		infosRow.removeClass("info-invis");
	        		infosRow.addClass("info-vis");
	        		infosRow.slideDown().css("display","block");
	        	}else{
	        		infosRow.addClass("info-invis");
	        		infosRow.removeClass("info-vis");
	        		infosRow.slideUp();
	        	}

	        });
	    });



		// 文件上传过程中创建进度条实时显示。
	    this.uploader.on( 'uploadProgress', function( file, percentage ) {
	       
	        var li = dialog.panel.find("#" + file.id);
	        li.find(".progress .progress-bar").css('width', percentage * 100 + '%');
	        li.find('.state').text('上传中');
	    });

		this.uploader.on( 'uploadSuccess', function( file ) {
			var dbName = dialog.panel.find("#" + file.id 
				+ " .import-vector-db option:selected").val();
			// var html = file.name + "=>" + dbName;
			var stateHtml = dialog.panel.find("#" + file.id).find(".state");
			stateHtml.html("上传完毕,开始导入");

			var infosRow = dialog.panel
	        		.find(".list-group-item[fid='" + file.id + "']"); 
	        var typeName = infosRow.find(".vector-type-name").val();
	        var srid = infosRow.find(".vector-srid").val();
	        dialog.featureImport(dbName,typeName,file.name,srid,
	        	file.id,dialog.featureImport_callback);
	    });

		this.uploader.on( 'uploadError', function( file ) {
	        dialog.panel.find("#" + file.id).find(".state").text("上传出错");
	    });

	    this.uploader.on( 'uploadComplete', function( file ) {
	    });

	    this.uploader.on( 'all', function( type ) {
	        if ( type === 'startUpload' ) {
	            dialog.uploadState = 'uploading';
	        } else if ( type === 'stopUpload' ) {
	            dialog.uploadState = 'paused';
	        } else if ( type === 'uploadFinished' ) {
	            // console.log(new Date() - time);
	            dialog.uploadState = 'done';
	            alert("所有上传完毕！");
	        }

	        if ( dialog.uploadState === 'uploading' ) {
	            dialog.uploadBtn.text('暂停上传');
	        } else {
	            dialog.uploadBtn.text('开始上传');
	        }
	    });
	},

	getDataSources_callback : function(dataSources){
		if(dataSources == null){
			return;
		}
		var dialog = MapCloud.importVector_dialog;
		dialog.dataSources = dataSources;
	},

	getDataSourcesHtml : function(dataSources){
		var html = "";
		for(var i = 0; i < dataSources.length;++i){
			var dataSource = dataSources[i];
			html += "<option value='" + dataSource.name + "'>"
			+ 		dataSource.name + "</option>";
		}
		return html;
	},

	featureImport : function(sourceName,typeName,shpName,srid,fileId,callback){
		if(sourceName == null || typeName == null 
			|| shpName == null || srid == null){
			return;
		}
		var that = this;
		var url = mapObj.server;
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
					infosRow.find(".btn-re-import").click(function(){
						var fid = $(this).parents(".list-group-item").attr("fid");
						var row = dialog.panel.find(".list-group-item[id='" + fid + "']");
						var dbName = row.find(".import-vector-db option:selected").val();
						var infosRow = dialog.panel.find(".list-group-item[fid='" + fid+ "']"); 
						var typeName = infosRow.find(".vector-type-name").val();
						var srid = infosRow.find(".vector-srid").val();
						var shpName = row.find(".info").html().trim();
						row.find(".progress-div .progress").addClass("active");
						dialog.featureImport(dbName,typeName,shpName,srid,
	        				fid,dialog.featureImport_callback);
					});
				}
			}
		}
		var row = dialog.panel.find(".list-group-item[id='" + id + "']");
		row.find(".progress-div .progress")
						.removeClass("active");
	}
});