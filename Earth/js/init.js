var g_earth_view = null;

/*$().ready(function(){

    var value = Math.PI * 256.0 / 180.0;
    //var extent = new Rectangle(-Math.PI, -CesiumMath.PI_OVER_TWO, Math.PI, CesiumMath.PI_OVER_TWO);
    var extent = new Cesium.Rectangle(-value, -value, value, value);
    g_earth_view = new Cesium.Viewer('earth_container', {
                    imageryProvider : new Cesium.WebMapTileServiceImageryProvider({
                                      url : '/QuadServer/services/maps/wmts100',
                                      layer : 'world',
                                      style : 'default',
                                      format : 'image/jpeg',
                                      tileMatrixSetID : 'PGIS_TILE_STORE',
                                      // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
                                      minimumLevel: 0,
                                      maximumLevel: 19,
                                      credit : new Cesium.Credit('world_country'),
                                      tilingScheme : new Cesium.GeographicTilingScheme({rectangle : extent})
                    }),
                    baseLayerPicker : false
                });
    
    var terrainProvider = new Cesium.CesiumTerrainProvider({
                                  url : '//assets.agi.com/stk-terrain/world',
                                requestVertexNormals: true
                              });
    viewer.terrainProvider = terrainProvider;
    viewer.scene.globe.enableLighting = false;

});*/

$().ready(function(){

    var value = Math.PI * 256.0 / 180.0;
    var extent = new Cesium.Rectangle(-value, -value, value, value);
    g_earth_view = new Cesium.Viewer('earth_container',{
        animation:false, //动画控制不显示
        baseLayerPicker:false,//图层控制显示
        geocoder:false,//地名查找不显示
        timeline:false,//时间线不显示
        sceneModePicker:false,//投影方式显示,
        homeButton:false,
        navigationHelpButton:false,
        navigationInstructionsInitiallyVisible:false,
        imageryProvider : new Cesium.WebMapTileServiceImageryProvider({
                                      url : '/QuadServer/services/maps/wmts100',
                                      layer : 'world_image',
                                      style : 'default',
                                      format : 'image/jpeg',
                                      tileMatrixSetID : 'PGIS_TILE_STORE',
                                      // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
                                      minimumLevel: 0,
                                      maximumLevel: 19,
                                      credit : new Cesium.Credit('world_country'),
                                      tilingScheme : new Cesium.GeographicTilingScheme({rectangle : extent})
                            })
    });

    var terrainProvider = new Cesium.CesiumTerrainProvider({
                                  url : '//assets.agi.com/stk-terrain/world',
                                requestVertexNormals: true
                              });
    g_earth_view.terrainProvider = terrainProvider;
    g_earth_view.scene.globe.enableLighting = false;

});