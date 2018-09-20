<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" type="text/css" href="../css/bootstrap-3.2.0-dist/css/font-awesome.min.css"/>
	<link rel="stylesheet" type="text/css" href="../css/bootstrap-3.2.0-dist/css/bootstrap.min.css"/>
	<link rel="stylesheet" type="text/css" href="../css/bootstrap-3.2.0-dist/css/bootstrap-datetimepicker.min.css"/>
	<link rel="stylesheet" type="text/css" href="../css/jquery-ui/ui.notify.css" type="text/css">
	<link rel="stylesheet" type="text/css" href="css/mc-admin.css"/>
	<script type="text/javascript" src="../js/3rd/jquery-1.11.1.js"></script>
	<script type="text/javascript" src="../js/3rd/jquery-ui/jquery-ui.min.js"></script>
	<script type="text/javascript" src="../js/3rd/jquery-ui/jquery.notify.min.js"></script>
	<script type="text/javascript" src="../js/3rd/bootstrap-3.2.0-dist/bootstrap.min.js"></script>
	<script type="text/javascript" src="../js/3rd/bootstrap-3.2.0-dist/bootstrap-datetimepicker.min.js"></script>
	<script type="text/javascript" src="../js/3rd/bootstrap-3.2.0-dist/locales/bootstrap-datetimepicker.zh-CN.js"></script>
	<script type="text/javascript" src="../../Map5/lib/echarts-all.js"></script>
	<script type="text/javascript" src="../js/common.min.js"></script>
	<script type="text/javascript" src="../../Map5/lib/Map5.min.js"></script>
 	<script type="text/javascript" src="js/mc-admin-use.min.js"></script>
	
<!-- 	<script type="text/javascript" src="js/mc-use-panel.js"></script>
	<script type="text/javascript" src="js/mc-admin-use.js"></script> -->
	
	<title>使用情况</title>
</head>
	
<body id="use_body">
	<div class="common-panel" id="admin_use_panel">
		<div id="title_wrapper">
			<div class="title_box">基本信息</div>
		</div>
		<div id="ha_main_wrapper">
			<div class="row">
				<div class="col-md-4 col-xs-4 list-panel" id="use_panel">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h2>
								<i class="fa fa-list"></i>
								<strong>分布式文件系统</strong>
							</h2>
							<div class="panel-actions">
								<!-- <a href="javascript:void(0)" class="btn-refresh" data-toggle="tooltip" data-placement="top" data-original-title="刷新"><i class="fa fa-rotate-right"></i></a> -->
							</div>
						</div>
						<div class="panel-body" >
							<div id="use_chart" class="col-md-12"></div>
							<div  id="use_list" class="panel-info-list">
								<div>
									<div class="row">
									<div class="col-md-6 col-xs-6">总空间:</div>
									<div class="col-md-6 col-xs-6" id="total_size"></div>
								</div>
								<div class="row">
									<div class="col-md-6 col-xs-6">使用:</div>
									<div class="col-md-6 col-xs-6" id="used_size"></div>
								</div>
								<div class="row">
									<div class="col-md-6 col-xs-6">空余:</div>
									<div class="col-md-6 col-xs-6" id="free_size"></div>
								</div>
								<div class="row">
									<div class="col-md-6 col-xs-6">使用率:</div>
									<div class="col-md-6 col-xs-6" id="usage_size"></div>
								</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-4 col-xs-4 list-panel" id="db_panel">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h2>
								<i class="fa fa-list"></i>
								<strong>空间数据库集群</strong>
							</h2>
							<div class="panel-actions">

							</div>
						</div>
						<div class="panel-body" >
							<div class="row">
								<div class="center-block">
									空间数据库集群
								</div>
							</div>
							<div id="db_image">
							</div>
							<div  id="db_list" class="panel-info-list">
								<div class="row">
									<div class="col-md-7 col-xs-7">节点数:</div>
									<div class="col-md-5 col-xs-5">8个</div>
								</div>
								<div class="row">
									<div class="col-md-7 col-xs-7">数据库个数:</div>
									<div class="col-md-5 col-xs-5">6个</div>
								</div>
								<div class="row">
									<div class="col-md-7 col-xs-7">数据库总大小:
									</div>
									<div class="col-md-5 col-xs-5">1.93T</div>
								</div>
								<div class="row">
									<div class="col-md-7 col-xs-7">最大数据库:</div>
									<div class="col-md-5 col-xs-5">1.51T</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-4 col-xs-4 list-panel" id="tile_panel">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h2>
								<i class="fa fa-list"></i>
								<strong>NoSQL数据库集群</strong>
							</h2>
							<div class="panel-actions">

							</div>
						</div>
						<div class="panel-body" >
							<div class="row">
								<div class="center-block">
									NoSQL数据库集群
								</div>
							</div>
							<div id="tile_image"></div>
							<div  id="tile_list" class="panel-info-list">
								<div>
									<div class="row">
										<div class="col-md-7 col-xs-7">节点数:</div>
										<div class="col-md-5 col-xs-5" id="total_size">16个</div>
									</div>
								</div>
								<div>
									<div class="row">
										<div class="col-md-7 col-xs-7">瓦片总数:</div>
										<div class="col-md-5 col-xs-5" id="total_size">21.6亿</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<?php
				include_once('simple_html_dom.php');

				function getGluster(){
					//$html = file_get_html('http://192.168.111.156:8088/test/gluster.php');
					$html = file_get_html('gluster.xml');
				
					foreach($html->find("total") as $element)
						$text = $element->text();
						echo "<script> var total='$text';</script>";
					foreach($html->find("used") as $element)
						$text = $element->text();
						echo "<script> var used='$text';</script>";
					foreach($html->find("free") as $element)
						$text = $element->text();
						echo "<script> var free='$text';</script>";
					foreach($html->find("usage") as $element)
						$text = $element->text();
						echo "<script> var usage='$text';</script>";
					
				}
				getGluster();
			?>
			<div class="row"  style="width:760px">
				<div class="col-md-12 col-xs-12" id="gluster_panel">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h2>
								<i class="fa fa-list"></i>
								<strong>gluster</strong>
							</h2>
							<div class="panel-actions">
								<!-- <a href="javascript:void(0)" class="btn-refresh" data-toggle="tooltip" data-placement="top" data-original-title="刷新"><i class="fa fa-rotate-right"></i></a> -->
							</div>
						</div>
						<div class="panel-body">
							<div id="gluster_node">节点数:<span></span></div>
							<table class="table table-striped">
								<thead>
									<tr>
										<th class="td-width-20">主机名</th>
										<th class="td-width-45">UUID</th>
										<th class="td-width-35">状态</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>				
		</div>
	</div>

	<!-- Notify  -->
	<div id="container" style="display:none">
		<div id="default">
			<a class="ui-notify-close ui-notify-cross" href="javascript:void(0)">x</a>
			<span>#{title}</span>
			<span>:</span>
			<span>#{text}</span>
		</div>
	</div>

	<!-- loading panel -->
	<div class="screen-alert" id="alert_loading">
		<span>Please wait ...</span>
	</div>
</body>
