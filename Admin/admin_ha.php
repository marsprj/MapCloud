<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" type="text/css" href="../css/bootstrap-3.2.0-dist/css/font-awesome.min.css"/>
	<link rel="stylesheet" type="text/css" href="../css/bootstrap-3.2.0-dist/css/bootstrap.min.css"/>
	<link rel="stylesheet" type="text/css" href="../css/bootstrap-3.2.0-dist/css/bootstrap-datetimepicker.min.css"/>
	<link rel="stylesheet" type="text/css" href="../css/jquery-ui/ui.notify.css" type="text/css">
	<link rel="stylesheet" type="text/css" href="css/mc-admin.min.css"/>
	<script type="text/javascript" src="../js/3rd/jquery-1.11.1.js"></script>
	<script type="text/javascript" src="../js/3rd/jquery-ui/jquery-ui.min.js"></script>
	<script type="text/javascript" src="../js/3rd/jquery-ui/jquery.notify.min.js"></script>
	<script type="text/javascript" src="../js/3rd/bootstrap-3.2.0-dist/bootstrap.min.js"></script>
	<script type="text/javascript" src="../js/3rd/bootstrap-3.2.0-dist/bootstrap-datetimepicker.min.js"></script>
	<script type="text/javascript" src="../js/3rd/bootstrap-3.2.0-dist/locales/bootstrap-datetimepicker.zh-CN.js"></script>
	<script type="text/javascript" src="../../Map5/lib/echarts-all.js"></script>
	<script type="text/javascript" src="../js/common.min.js"></script>
	<script type="text/javascript" src="../../Map5/lib/Map5.min.js"></script>
	<script type="text/javascript" src="js/mc-admin-ha.min.js"></script>
	
<!--	<script type="text/javascript" src="js/mc-ha-panel.js"></script>
	<script type="text/javascript" src="js/mc-admin-ha.js"></script>
-->	
	<title>负载均衡</title>
</head>
	
<body id="ha_body">
	<div class="common-panel" id="ha_panel">
		<div id="title_wrapper">
			<div class="title_box">负载均衡</div>
		</div>
		<div id="ha_main_wrapper">
			<?php
				include_once('simple_html_dom.php');

				$html = file_get_html('http://ourgis.digitalearth.cn/haproxy-stats');

				$table = $html->find(".tbl");

				$titleHtml = '';
				foreach($html->find(".tbl") as $element)
					if(count($element->find(".px")) != 0){
						echo $element;
						$elementName = $element->find(".px",0);
						$titleHtml = $titleHtml.'<a href="javascript:void(0)">'.$elementName.'</a>';
					}else{
						foreach($element->find(".tips") as $tipsElement)
							$tipsElement->outertext = '';
						$element->class = 'table';
						// 查找rowspan
						foreach($element->find("th[rowspan='2']")  as $rowspanElement)
							$rowspanElement->rowspan = 1;
						$element->find(".titre",1)->innertext = '<th></th>'.$element->find(".titre",1)->innertext;
						echo $element;
					}
				?>
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
