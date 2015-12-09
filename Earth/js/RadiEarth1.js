(function(){
    window.Radi = {};
})();
Radi.Earth = {

    initEarth : function (container){
        var value = Math.PI * 256.0 / 180.0;
        var extent = new Cesium.Rectangle(-value, -value, value, value);

        g_earth_view = new Cesium.Viewer('earth_container',{
            animation:false,        //动画控制不显示
            baseLayerPicker:false,  //图层控制显示
            geocoder:false,         //地名查找不显示
            timeline:false,         //时间线不显示
            sceneModePicker:false,  //投影方式显示,
            fullscreenButton:false,
            homeButton:false,
            infoBox:false,
            selectionIndicator:false,
            navigationHelpButton:false,
            navigationInstructionsInitiallyVisible:false,
            scene3DOnly:true,
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
    },

    flyTo : function(x, y, h){
        g_earth_view.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(x, y, h)
            });
    },

    camera : function(){
        var camera = g_earth_view.camera;
    },

    addPin : function(x, y){
        var pinBuilder = new Cesium.PinBuilder();

        var bluePin = g_earth_view.entities.add({
            name : 'Blank blue pin',
            position : Cesium.Cartesian3.fromDegrees(118, 39.9208667),
            billboard : {
                image : pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL(),
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM
            }
        });

        var url = Cesium.buildModuleUrl('Assets/Textures/maki/grocery.png');
        var groceryPin = Cesium.when(pinBuilder.fromUrl(url, Cesium.Color.GREEN, 48), function(canvas) {
            return g_earth_view.entities.add({
                name : 'Grocery store',
                position : Cesium.Cartesian3.fromDegrees(x, y),
                billboard : {
                    image : canvas.toDataURL(),
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM
                }
            });
        });

        //Cesium.when.all([bluePin, questionPin, groceryPin, hospitalPin], function(pins){
        Cesium.when.all([bluePin, groceryPin], function(pins){
            g_earth_view.zoomTo(pins);
        });
    },

    addPoint : function(x, y, size){
        g_earth_view.entities.add({
            position : Cesium.Cartesian3.fromDegrees(x, y),
            point : {
                pixelSize : size,
                color : Cesium.Color.YELLOW
            }
        });
    },

    addLine : function(coordinates, width){
        g_earth_view.entities.add({
            name : 'Glowing blue line on the surface',
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArray(coordinates),
                width : width,
                material : new Cesium.PolylineGlowMaterialProperty({
                    glowPower : 0.2,
                    color : Cesium.Color.YELLOW
                })
            }
        });    
    },

    addPolygon : function(coordinates, width){

        var redPolygon = g_earth_view.entities.add({
            name : 'Red polygon on surface',
            polygon : {
                hierarchy : Cesium.Cartesian3.fromDegreesArray(coordinates),
                material : Cesium.Color.RED
            }
        });
    },

    addBillboard : function(x,y,caption,url){
        g_earth_view.entities.add({
            position : Cesium.Cartesian3.fromDegrees(x, y),
            billboard :{
                //image : '../images/Cesium_Logo_overlay.png'
                image : url
            }
        });

        var billboard = {
            position : Cesium.Cartesian3.fromDegrees(x, y),
            billboard :{
                image : url
            },
            label : {
                text : caption,
                font : "16px Microsoft YaHei",
                horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
                verticalOrigin   : Cesium.VerticalOrigin.MIDDLE,
                pixelOffset : new Cesium.Cartesian2(10,0)
            }
        };

        return g_earth_view.entities.add(billboard);


/*        viewer.entities.add({
            position : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
            billboard : {
                image : '../images/Cesium_Logo_overlay.png', // default: undefined
                show : true, // default
                pixelOffset : new Cesium.Cartesian2(0, -50), // default: (0, 0)
                eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER, // default
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM, // default: CENTER
                scale : 2.0, // default: 1.0
                color : Cesium.Color.LIME, // default: WHITE
                rotation : Cesium.Math.PI_OVER_FOUR, // default: 0.0
                alignedAxis : Cesium.Cartesian3.ZERO, // default
                width : 100, // default: undefined
                height : 25 // default: undefined
            }
        });*/
    },

    zoom : function(objs){
        Cesium.when.all(objs, function(pins){
            g_earth_view.zoomTo(objs);
        });
    },

    cleanup : function(){
        g_earth_view.entities.removeAll();
    }
};