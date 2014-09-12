MapCloud.DatabaseDialog = MapCloud.Class(MapCloud.Dialog, {
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		this.panel.click(function(){
			//dialog.closeDialog();
		});
		
		$("#dbtable").flexigrid(
		{
			width: 'auto',
			resizable: false,
			height:250
		});


		this.panel.find("#database_dialog_action_btn").each(function(){
			$(this).click(function(){
				if($(this).parent().hasClass("open")){
					$(this).parent().removeClass("open");
				}else{
					$(this).parent().addClass("open");
				}
			});
		});

		this.panel.find(".dropdown-menu").each(function(){
			$(this).hover(function(){},
						  function(){
								$(this).parent().removeClass("open");
							});
		});


		//切换数据连接
		this.panel.find("#database-dialog-panel select").each(function(){
			$(this).change(function(){
				var value = $(this).find("option:selected").attr("value");
				alert(value);
			});
		});


		//连接
		this.panel.find("#database-dialog-connect").each(function(){
			$(this).click(function(){
				alert("连接并更新表格");

			});
		});

		//新建
		this.panel.find("#database-dialog-create-connect").each(function(){
			$(this).click(function(){
				if(MapCloud.pgis_connection_dialog == null){
					MapCloud.pgis_connection_dialog = new MapCloud.PGISConnectDialog("pgis_connection_dialog");
				}				
				MapCloud.pgis_connection_dialog.showDialog();
			});
		});

		//编辑
		//SERVER=192.168.111.200;INSTANCE=1521;DATABASE=GISDB;USER=GBSDE;PASSWORD=GBSDE
		this.panel.find("#database-dialog-connect-edit").each(function(){
			$(this).click(function(){
				if(MapCloud.pgis_connection_dialog == null){
					MapCloud.pgis_connection_dialog = new MapCloud.PGISConnectDialog("pgis_connection_dialog");
				}								
				MapCloud.pgis_connection_dialog.showDialog();
				MapCloud.pgis_connection_dialog.setParm("87","192.168.111.87","5432","gbsde2","postgres","postgres");

			});
		});


		//删除
		this.panel.find("#database-dialog-connect-delete").each(function(){
			$(this).click(function(){
				alert("删除并更新表格");

			});
		});

		//刷新
		this.panel.find("#refresh-btn").each(function(){
			$(this).click(function(){
				alert("刷新");
			});
		});

		//全选
		this.panel.find("#select-all-btn").each(function(){
			$(this).click(function(){
				alert("全选");
				$(".flexigrid .bDiv tr").addClass("trSelected");
			});
		});

		//全不选
		this.panel.find("#unselect-all-btn").each(function(){
			$(this).click(function(){
				alert("全不选");
				$(".flexigrid .bDiv tr").removeClass("trSelected");
			});
		});

		//重命名
		this.panel.find("#rename-btn").each(function(){
			$(this).click(function(){
				alert("重命名");
			});
		});

		//编辑字段
		this.panel.find(".editfield-btn").each(function(){
			$(this).click(function(){
				alert("编辑字段");
			});
		});

		//复制
		this.panel.find("#duplicate-btn").each(function(){
			$(this).click(function(){
				alert("复制");
			});
		});

		//重置
		this.panel.find("#reset-btn").each(function(){
			$(this).click(function(){
				alert("重置");
			});
		});

		//截断
		this.panel.find("#truncate-btn").each(function(){
			$(this).click(function(){
				alert("截断");
			});
		});

		//删除
		this.panel.find(".delete_layers_btn").each(function(){
			$(this).click(function(){
				var length = $(".trSelected", ".flexigrid").length;
				if( length < 1){
					alert("请至少选择一行数据！");
					return;
				}
				if(confirm("确定删除数据吗？")){
					alert("删除后重新获取表格数据");				
				}else{
					alert("放弃");
				}
			});
		});

		this.panel.find("#database_dialog_import").each(function(){
			$(this).click(function(){
				alert("导入");
			});
		});

	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
		this.panel.find("#map_name").each(function(){
			$(this).val("");
		});
	}
	
});
	