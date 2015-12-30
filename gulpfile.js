var gulp = require("gulp"),
	rename = require("gulp-rename"),
	concat = require("gulp-concat"),
	jshint = require("gulp-jshint"),
	minifycss = require('gulp-minify-css'),
	uglify = require("gulp-uglify");




// 压缩Map5
	gulp.task('map5',function(){
		return gulp.src(["Map5/lib/GeoBeans.js",
			'Map5/lib/GeoBeans/BaseTypes/*.js',
			'Map5/lib/GeoBeans/*.js',
			'Map5/lib/GeoBeans/AQI/*.js',
			'Map5/lib/GeoBeans/Auth/*.js',
			'Map5/lib/GeoBeans/Control/*.js',
			'Map5/lib/GeoBeans/Control/*/*.js',
			'Map5/lib/GeoBeans/DBS/*.js',
			'Map5/lib/GeoBeans/File/*.js',
			'Map5/lib/GeoBeans/Filter/*.js',
			'Map5/lib/GeoBeans/Filter/*/*.js',
			'Map5/lib/GeoBeans/Geometry/*.js',
			'Map5/lib/GeoBeans/Geometry/*/*.js',
			'Map5/lib/GeoBeans/GPS/*.js',
			'Map5/lib/GeoBeans/Label/*.js',
			'Map5/lib/GeoBeans/Layer/DBLayer.js',
			'Map5/lib/GeoBeans/Layer/FeatureDBLayer.js',
			'Map5/lib/GeoBeans/Layer/FeatureLayer.js',
			'Map5/lib/GeoBeans/Layer/ChartLayer.js',
			'Map5/lib/GeoBeans/Layer/GroupLayer.js',
			'Map5/lib/GeoBeans/Layer/HeatMapLayer.js',
			'Map5/lib/GeoBeans/Layer/MapLayer.js',
			'Map5/lib/GeoBeans/Layer/OverlayLayer.js',
			'Map5/lib/GeoBeans/Layer/PanoramaLayer.js',
			'Map5/lib/GeoBeans/Layer/QueryLayer.js',
			'Map5/lib/GeoBeans/Layer/RasterDBLayer.js',
			'Map5/lib/GeoBeans/Layer/Tile.js',
			'Map5/lib/GeoBeans/Layer/TileCache.js',
			'Map5/lib/GeoBeans/Layer/TileLayer.js',
			'Map5/lib/GeoBeans/Layer/WFSLayer.js',
			'Map5/lib/GeoBeans/Layer/WMSLayer.js',
			'Map5/lib/GeoBeans/Layer/*/*.js',
			'Map5/lib/GeoBeans/Overlay/*.js',
			'Map5/lib/GeoBeans/Poi/*.js',
			'Map5/lib/GeoBeans/RasterDB/*.js',
			'Map5/lib/GeoBeans/Style/*.js',
			'Map5/lib/GeoBeans/Subscribe/*.js',
			'Map5/lib/GeoBeans/TileDB/*.js',
			'Map5/lib/GeoBeans/WFS/*.js',
			'Map5/lib/GeoBeans/WMS/*.js',
			'Map5/lib/GeoBeans/WMTS/*.js',
			])
			.pipe(uglify())
			.pipe(concat('Map5.min.js'))
			.pipe(gulp.dest('Map5/lib/'));		
	});

	// 压缩Map5 css
	gulp.task('map5-css',function(){
		return gulp.src('Map5/css/Map5.css')
			.pipe(minifycss())
			.pipe(rename('Map5.min.css'))
			.pipe(gulp.dest('Map5/css'));
	});

// 压缩Earth
	gulp.task('earth.js',function(){
		return gulp.src(["MapCloud/earth/js/RadiEarth1.js",
			"MapCloud/earth/js/view_init.js",
			'MapCloud/earth/js/SearchPanel.js',
			'MapCloud/earth/js/CurrentCityPanel.js',
			'MapCloud/earth/js/CityPanel.js',
			'MapCloud/earth/js/AQIChartDialog.js',
			'MapCloud/earth/js/PositionControl.js',
			'MapCloud/earth/js/PositionPanel.js',
			'MapCloud/earth/js/CityPosition.js',
			'MapCloud/earth/js/RangeChart.js',
			'MapCloud/earth/js/TopicPanel.js',
			])
			.pipe(uglify())
			.pipe(concat('earth.min.js'))
			.pipe(gulp.dest('MapCloud/earth/js'));
	});


	// 压缩MapEditor css
	gulp.task('editor-css',function(){
		return gulp.src('MapCloud/css/mc-new.css')
			.pipe(minifycss())
			.pipe(rename('mc-new.min.css'))
			.pipe(gulp.dest('MapCloud/css'));
	});


	// 压缩公有 css
	gulp.task('common-css',function(){
		return gulp.src('MapCloud/css/common.css')
			.pipe(minifycss())
			.pipe(rename('common.min.css'))
			.pipe(gulp.dest('MapCloud/css'));
	});

	// 压缩公有的js
	gulp.task('common-js',function(){
		return gulp.src(["MapCloud/js/MapCloud.js",
			"MapCloud/js/Class/Class.js",
			"MapCloud/js/Cookie.js",
			'MapCloud/js/CityPosition.js',
			'MapCloud/js/Control/*.js',
			'MapCloud/js/Control/*/*.js'
			])
			.pipe(uglify())
			.pipe(concat('common.js'))
			.pipe(gulp.dest('MapCloud/js'));
	});

	// 压缩Editor的js
	gulp.task('editor-js',function(){
		return gulp.src(["MapCloud/Editor/js/global.js",
			"MapCloud/Editor/js/init.js",
			"MapCloud/Editor/js/Control/**/*js"
			])
			.pipe(uglify())
			.pipe(concat('Editor.js'))
			.pipe(gulp.dest('MapCloud/Editor/js'));
	});	

	
	// 压缩User css
	gulp.task('user-css',function(){
		return gulp.src('MapCloud/User/css/mc-user.css')
			.pipe(minifycss())
			.pipe(rename('mc-user.min.css'))
			.pipe(gulp.dest('MapCloud/User/css'));		
	});

	// 压缩User index
	gulp.task('user-index',function(){
		return gulp.src(['MapCloud/User/js/mc-user-catalog.js',
			'MapCloud/User/js/mc-account-panel.js',
			'MapCloud/User/js/mc-user.js'])
			.pipe(uglify())
			.pipe(concat('mc-user.min.js'))
			.pipe(gulp.dest('MapCloud/User/js'));
	});

	// 压缩User info
	gulp.task('user-info',function(){
		return gulp.src(["MapCloud/User/js/mc-user-info.js",
			"MapCloud/User/js/mc-info-panel.js"
			])
			.pipe(uglify())
			.pipe(concat('mc-user-info.min.js'))
			.pipe(gulp.dest('MapCloud/User/js'));
	});	

	// 压缩User subscribe 
	gulp.task('user-subscribe',function(){
		return gulp.src(['MapCloud/User/js/mc-user-subscribe.js',
			'MapCloud/User/js/mc-sub-panel.js'])
			.pipe(uglify())
			.pipe(concat('mc-user-subscribe.min.js'))
			.pipe(gulp.dest('MapCloud/User/js'));
	});

	// 压缩User map
	gulp.task('user-map',function(){
		return gulp.src(['MapCloud/User/js/mc-user-map.js'])
			.pipe(uglify())
			.pipe(rename('mc-user-map.min.js'))
			.pipe(gulp.dest('MapCloud/User/js'));
	});

	// 压缩User subscribe 
	gulp.task('user-file',function(){
		return gulp.src(['MapCloud/User/js/mc-user-file.js',
			'MapCloud/User/js/mc-file-panel.js'])
			.pipe(uglify())
			.pipe(concat('mc-user-file.min.js'))
			.pipe(gulp.dest('MapCloud/User/js'));
	});

	// 压缩User vector 
	gulp.task('user-vector',function(){
		return gulp.src(['MapCloud/User/js/mc-user-vector.js',
			'MapCloud/User/js/mc-vector-panel.js'])
			.pipe(uglify())
			.pipe(concat('mc-user-vector.min.js'))
			.pipe(gulp.dest('MapCloud/User/js'));
	});

	// 压缩User raster 
	gulp.task('user-raster',function(){
		return gulp.src(['MapCloud/User/js/mc-user-raster.js',
			'MapCloud/User/js/mc-raster-panel.js'])
			.pipe(uglify())
			.pipe(concat('mc-user-raster.min.js'))
			.pipe(gulp.dest('MapCloud/User/js'));
	});

	// 压缩User tile 
	gulp.task('user-tile',function(){
		return gulp.src(['MapCloud/User/js/mc-user-tile.js',
			'MapCloud/User/js/mc-tile-panel.js'])
			.pipe(uglify())
			.pipe(concat('mc-user-tile.min.js'))
			.pipe(gulp.dest('MapCloud/User/js'));
	});


	// 压缩Amidn index
	gulp.task('admin-index',function(){
		return gulp.src(['MapCloud/Admin/js/mc-admin-catalog.js',
			'MapCloud/Admin/js/mc-admin.js',
			'MapCloud/Admin/js/mc-account-panel.js'])
			.pipe(uglify())
			.pipe(concat('mc-admin.min.js'))
			.pipe(gulp.dest('MapCloud/Admin/js'));
	});

	// 压缩Amidn css
	gulp.task('admin-css',function(){
		return gulp.src('MapCloud/Admin/css/mc-admin.css')
			.pipe(minifycss())
			.pipe(rename('mc-admin.min.css'))
			.pipe(gulp.dest('MapCloud/Admin/css'));		
	});

	// 压缩Amidn users 
	gulp.task('admin-users',function(){
		return gulp.src(['MapCloud/Admin/js/mc-admin-user.js',
			'MapCloud/Admin/js/mc-user-panel.js'])
			.pipe(uglify())
			.pipe(concat('mc-admin-user.min.js'))
			.pipe(gulp.dest('MapCloud/Admin/js'));
	});	

	// 压缩Amidn data 
	gulp.task('admin-data',function(){
		return gulp.src(['MapCloud/Admin/js/mc-admin-data.js',
			'MapCloud/Admin/js/mc-data-panel.js'])
			.pipe(uglify())
			.pipe(concat('mc-admin-data.min.js'))
			.pipe(gulp.dest('MapCloud/Admin/js'));
	});	


	// 压缩Guoan css
	gulp.task('guoan-css',function(){
		return gulp.src('MapCloud/Guoan/css/guoan.css')
			.pipe(minifycss())
			.pipe(rename('guoan.min.css'))
			.pipe(gulp.dest('MapCloud/Guoan/css'));		
	});

	// 压缩Guoan index
	gulp.task('guoan-js',function(){
		return gulp.src(['MapCloud/Guoan/js/init.js',
			'MapCloud/Guoan/js/SearchPanel.js',
			'MapCloud/Guoan/js/BaseLayerPanel.js',
			'MapCloud/Guoan/js/MapBar.js',
			'MapCloud/Guoan/js/QueryResultPanel.js',
			'MapCloud/Guoan/js/MapLayersPanel.js',
			'MapCloud/Guoan/js/CurrentCityPanel.js',
			'MapCloud/Guoan/js/CityPanel.js',
			'MapCloud/Guoan/js/PositionControl.js'])
			.pipe(uglify())
			.pipe(concat('guoan.min.js'))
			.pipe(gulp.dest('MapCloud/Guoan/js'));
	});		
	gulp.task('default',['earth.js'],function(){

	});