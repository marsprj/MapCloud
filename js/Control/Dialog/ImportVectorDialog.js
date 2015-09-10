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
	// 上传的路径
	uploadPath 		: null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

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

		this.panel.on('hidden.bs.modal',function(){
			dialog.closeDialog();
		});
	},

	cleanup : function(){
		this.dataSourceName = null;
		this.source = null;
		this.uploadPath = null;
		this.panel.find("#vector_list").html("");
	},

	showDialog : function(uploadPath){
		this.cleanup();
		this.panel.modal();
		this.uploadList = this.panel.find("#vector_list");
		this.uploadState = "pending";
		var dialog = this;
		if(uploadPath != null){
			this.setUploadPath(uploadPath);
		}

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
		// if(this.dataSourceName == "default"){
		// 	var parentDialog = MapCloud.file_dialog;
		// 	parentDialog.refreshCurrentPath();
		// 	this.panel.modal("hide");
		// 	return;
		// }
		// if(this.dataSourceName != null){
		// 	// MapCloud.data_source_dialog.refreshDatasource();
		// 	var parentDialog = MapCloud.db_admin_dialog;
		// 	parentDialog.getDataSource(this.dataSourceName);
		// }

		var parentDialog = MapCloud.file_dialog;
		parentDialog.refreshCurrentPath();
		this.panel.modal("hide");
	},

	createUploader : function(){
		var dialog = this;
		this.uploader =  WebUploader.create({

		    // 文件接收服务端。
		    server: '/uploader/fileupload.php',

		    // 选择文件的按钮。可选。
		    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
		    pick: '#picker',

		    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
		    resize: false,

	        chunked: true,

	        // 上传的路径
	        path : dialog.uploadPath

	        // accept :{
	        // 	title : "zip",
	        // 	extensions : 'zip',
	        // 	mimeTypes : 'application/zip'
	        // }
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
			// stateHtml.html("上传完毕,开始导入");
			stateHtml.html("上传完毕");

			var infosRow = dialog.panel
	        		.find(".list-group-item[fid='" + file.id + "']"); 
	        var typeName = infosRow.find(".vector-type-name").val();
	        var srid = infosRow.find(".vector-srid").val();

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
	        }

	        if ( dialog.uploadState === 'uploading' ) {
	            dialog.uploadBtn.text('暂停上传');
	        } else {
	            dialog.uploadBtn.text('开始上传');
	        }
	    });
	},

	// 获得file的html
	getFileHtml : function(file){
		var name = file.name;
		var typeName = file.name.slice(0,file.name.indexOf(".zip"));
	    
	    var html = "<li class='list-group-item row' id='" + file.id + "'>"
	        +      	"    <div class='col-md-3 info'>"
	        +               file.name
	        +      	"    </div>";

	        
	    html +=	"    <div class='col-md-6 progress-div'>"
	        +      	"        <div class='progress progress-striped active'>"
	        +      	"            <div class='progress-bar' role='progressbar' style='width: 0%;''></div>"
	        +      	"        </div>"
	        +      	"    </div>";
	    html +=  	"   <div class='col-md-3 state'>等待上传</div>"
	        +		"</li>";
	    return html;	          
	},



	// 设置上传的路径
	setUploadPath : function(path){
		this.uploadPath = path;
	}

});