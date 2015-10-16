(function(){
    window.Radi = {};
})();

var g_earth_view = null;
$().ready(function(){

    Radi.Earth.initEarth('earth_container');
	//Radi.Earth.flyTo(116,39,1000);

});


function onFlyTo(){
    Radi.Earth.flyTo(116,39,100000);    
}

function onCamera(){
    Radi.Earth.camera();    
}

function onPin(){
    Radi.Earth.addPin(117,40);
}

function onAddPoint(){
    Radi.Earth.addPoint(116, 39, 10);
}

function onAddLine(){
    Radi.Earth.addLine([116,39,116,-39], 10);
}

function onAddPolygon(){
    //Radi.Earth.addPoint(116, 39, 10);
}

function onAddBillboard(){
    Radi.Earth.addBillboard(116, 39, '../images/marker_40.png');
}

function onEntityCleanup(){
    Radi.Earth.cleanup();
}

function onNanhaiAirport(){
    Radi.Earth.Nanhai.nanhaiAirport();
}

function onNanhaiIsland(){
    Radi.Earth.Nanhai.nanhaiIsland();
}

function onNanhaiRoute(){
    Radi.Earth.Nanhai.nanhaiRoute();   
}

function onNanhaiOilBasin(){
    Radi.Earth.Nanhai.onNanhaiOilBasin();  
}

Radi.Earth = {

    initEarth : function (container){
        var value = Math.PI * 256.0 / 180.0;
        var extent = new Cesium.Rectangle(-value, -value, value, value);
/*        g_earth_view = new Cesium.Viewer('earth_container',{
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
            scene3DOnly:true
        });*/
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

    addBillboard : function(x,y,url){
        g_earth_view.entities.add({
            position : Cesium.Cartesian3.fromDegrees(x, y),
            billboard :{
                //image : '../images/Cesium_Logo_overlay.png'
                image : url
            }
        });

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

    cleanup : function(){
        g_earth_view.entities.removeAll();
    }
};

Radi.Earth.Nanhai  = {

    /******************************************************************/
    // 南海机场
    /******************************************************************/
    nanhaiAirport : function(){
        var self = this;
        $.get("./data/nanhai/nh_airport.xml", function(xml){
            self.drawAirport(xml);
        });
    },

    drawAirport : function(xml){
        var self = this;
        var pins = [];

        g_earth_view.entities.removeAll();
        $(xml).find("featureMember").each(function(index, element) {

            var name = self.getNodeValue(this,"名称");
            var type = self.getNodeValue(this,"大类别");
            var icon = self.getAirportIcon(type);

            var pos_node = $(this).find("pos")[0];
            var pos = $(pos_node).text();
            var pts = pos.split(" ");
            var x = pts[1];
            var y = pts[0];

            var airport = self.addAirport(x, y, icon);
            if(airport!=undefined){
                pins.push(airport);
            }
        });

        Cesium.when.all(pins, function(pins){
            g_earth_view.zoomTo(pins);
        });
    },

    addAirport : function(x, y, icon_url){
        var airport = g_earth_view.entities.add({
            position : Cesium.Cartesian3.fromDegrees(x, y),
            billboard :{
                image : icon_url
            }
        });
        return airport;
    },

    getAirportIcon : function(type){
        var icon = "./images/marker_40.png";
        switch(type){
            case "机场":
                icon = "./images/airport.png";
                break;
            case "港口":
                icon = "./images/harbor.png";
                break;
        }
        return icon;
    },

    getNodeValue: function(xmlNode, nodeName){
        var xnode = $(xmlNode).find(nodeName)[0];
        return $(xnode).text();
    },

    /******************************************************************/
    /* 南海岛礁
    /******************************************************************/
    nanhaiIsland : function(){
        var self = this;
        $.get("./data/nanhai/nh_isands.xml", function(xml){
            self.drawIslands(xml);
        });
    },

    drawIslands : function(xml){
        var self = this;
        var island = undefined;
        var pins = [];
        var icon = "./images/dot_8.png";
        g_earth_view.entities.removeAll();
        $(xml).find("featureMember").each(function(index, element) {

            var radius = 10;
            var color = "#FF0000";
            var name = self.getNodeValue(this,"标准名称");

            var pos_node = $(this).find("pos")[0];
            var pos = $(pos_node).text();
            var pts = pos.split(" ");
            var x = pts[1];
            var y = pts[0];

            island = self.addIsland(x, y, radius, Cesium.Color.YELLOW);
            if(island!=undefined){
                pins.push(island);
            }

        });
        Cesium.when.all(pins, function(pins){
            g_earth_view.zoomTo(pins);
        });
    },

    addIsland : function(x, y, size, c){
        var island = g_earth_view.entities.add({
            position : Cesium.Cartesian3.fromDegrees(x, y),
            point : {
                pixelSize : size,
                color : c
            }
        });
        return island;
    },

    /******************************************************************/
    /* 南海航线
    /******************************************************************/
    nanhaiRoute : function(){
        var self = this;
        $.get("./data/nanhai/nh_route.xml", function(xml){
            self.drawRoute(xml);
        });
    },

    drawRoute : function(xml){        
        var self = this;
        var pins = [];
        g_earth_view.entities.removeAll();
        $(xml).find("featureMember").each(function(index, element) {

            var member = this;
            var name = $(this).find("航线名称")[0];
            var pts_node = $(this).find("posList")[0];
            var pts_string = $(pts_node).text();

//            $(this).find("航线名称").each(function(){
//                //alert($(this).text());
//                var text = $(this).text();
//                var xy = self.getLineLabelAnchor(pts_string);
//                self.drawText(xy[0],xy[1], text,0,0, "10", "#000000");
//                mapObj.addOverlays(marker);
//            });

            var line_color = Cesium.Color.YELLOW;            
            var pts = self.parseCoordinates(pts_string);
            if(pts.length>2){
                var route = self.addRoute(name, pts, 2, line_color);
                if(route!=undefined){
                    pins.push(route);
                }
            }
        });
        Cesium.when.all(pins, function(pins){
            g_earth_view.zoomTo(pins);
        });
    },

    parseCoordinates : function(posList){
        var pts = [];
        var coordinates = posList.split(" ");
        for(var i=0; i<coordinates.length; i=i+2)
        {
            pts.push(coordinates[i+1]);
            pts.push(coordinates[i]);
        }
        return pts;
    },

    addRoute : function(name, pts, width, line_color){
        var route = g_earth_view.entities.add({
            name : name, /*'Glowing blue line on the surface',*/
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArray(pts),
                width : width,
                material : new Cesium.PolylineGlowMaterialProperty({
                    glowPower : 0.2,
                    color : line_color
                })
            }
        });
        return route;
    },

    /******************************************************************/
    /* 油气盆地
    /******************************************************************/
    onNanhaiOilBasin : function (){

        var self = this;
        $.get("./data/nanhai/nh_oilbasin.xml", function(xml){
            self.drawOilBasin(xml);
        });
    },

    drawOilBasin : function(xml){
        var self = this;
        var pins = [];

        $(xml).find("featureMember").each(function(){

            var member = $(this);
            var name = member.find("Name").text();            
            //var color = Cesium.Color.GREENYELLOW;
            //var color = Cesium.Color.fromCssColorString('#67ADDF0F');
            var color = Cesium.Color.fromBytes(255,0,0,128);
            member.find("posList").each(function(){
                var pts = self.parseCoordinates($(this).text());
                if(pts.length>3){
                    var basin = self.addBasin(name, pts, color);
                    if(basin!=undefined){
                        pins.push(basin);
                    }
                }
            });
        });
        Cesium.when.all(pins, function(pins){
            g_earth_view.zoomTo(pins);
        });
    },

    addBasin : function(name, pts, color){
        var basin = g_earth_view.entities.add({
            name : name, /*'Red polygon on surface',*/
            polygon : {
                hierarchy : Cesium.Cartesian3.fromDegreesArray(pts),
                material : color
            }
        });
        return basin;
    }
};