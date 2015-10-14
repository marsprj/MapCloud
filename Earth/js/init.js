var g_earth_view = null;

$().ready(function(){

	g_earth_view = new Cesium.Viewer('earth_container',{
        animation:false, //动画控制不显示
        baseLayerPicker:false,//图层控制显示
        geocoder:false,//地名查找不显示
        timeline:false,//时间线不显示
        sceneModePicker:false,//投影方式显示,
        homeButton:false,
        navigationHelpButton:false,
        navigationInstructionsInitiallyVisible:false
    });

});