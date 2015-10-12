var g_catalog = 
[
    {
        "name": "要素服务",
        "items": [
            {
                "name": "GetCapabilities",
                "capation" : "Capabilities",
                "link": "wfs_getcapabilities.html"
            },
            {
                "name": "DescribeFeatureType",
                "capation" : "要素模式",
                "link": "wfs_describe_featuretype.html"
            },
            {
                "name": "GetFeature",
                "capation" : "获取要素",
                "link": "wfs_get_feature.html"
            },
            // {
            //     "name": "GetGmlObject",
            //	   "capation" : "",
            //     "link": "wfs_get_gmlobject.html"
            // },
            {
                "name": "Insert",
                "capation" : "插入要素",
                "link": "wfs_insert.html"
            },
            {
               	"name": "Update",
               	"capation" : "更新要素",
                "link": "wfs_update.html"
            },
            {
               	"name": "Delete",
               	"capation" : "删除要素",
                "link": "wfs_delete.html"
            },
            {
               	"name": "GetCount",
               	"capation" : "要素个数",
                "link": "wfs_get_count.html"
            },
            {
               	"name": "GetValue",
               	"capation" : "获取要素值",
                "link": "wfs_get_value.html"
            }
        ]
    },
    {
        "name": "地图渲染服务",
        "items": [
            {
                "name": "GetCapabilities",
                "capation" : "Capabilities",
                "link": "wms_getcapabilities.html"
            },
            {
                "name": "GetMap",
                "capation" : "地图渲染",
                "link": "wms_get_map.html"
            },
            // {
            //     "name": "GetFeatureInfo",
            //     "link": "wms_get_featureinfo.html"
            // },
            // {
            //     "name": "GetStyle",
            //     "link": "wms_get_style.html"
            // },
            {
                "name": "SetStyle",
                "capation" : "设置样式",
                "link": "wms_set_style.html"
            }
        ]
    },
    {
        "name": "瓦片地图服务",
        "items": [
            // {
            //     "name": "GetCapabilities",
            //     "link": "wmts_getcapabilities.html"
            // },
            {
                name : "GetDataSource",
                "capation" : "获取数据源",
                link : "dbs_get_tile_datasource.html"
            },
            {
                name : "DescribeTileStore",
                "capation" : "瓦片库描述信息",
                link : "dbs_describe_tilestore.html"
            },
            {
                name : "CreateTileStore",
                "capation" : "创建瓦片库",
                link : "dbs_create_tilestore.html"
            },
            {
                name : "RemoveTileStore",
                "capation" : "删除瓦片库",
                link : "dbs_remove_tilestore.html"
            },
            {
                "name": "GetTile",
                "capation" : "获取瓦片",
                "link": "dbs_get_tile.html"
            }
        ]
    },
    {
        "name": "网络数据处理服务",
        "items": [
            {
                "name": "GetCapabilities",
                "capation" : "Capabilities",
                "link": "gps_getcapabilities.html"
            },
            {
                "name": "FeatureProject",
                "capation" : "要素投影",
                "link": "gps_feature_project.html"
            },
            {
                "name": "FeatureImport",
                "capation" : "导入要素",
                "link": "gps_feature_import.html"
            },
            {
                "name": "CsvImport",
                "capation" : "导入Csv文件",
                "link": "gps_feature_import.html"
            },
            {
                "name": "GetSpatialReference",
                "capation" : "获得空间参考",
                "link": "gps_get_srid.html"
            },            
            {
                "name": "RasterEdgeDetect",
                "capation" : "栅格边缘检测",
                "link": "gps_raster_edge_detect.html"
            },
            {
                "name": "RasterExtractByRectangle",
                "capation" : "栅格矩形裁剪",
                "link": "gps_raster_extract_by_rect.html"
            },
             {
                "name": "RasterReverse",
                "capation" : "栅格灰度反转",
                "link": "gps_raster_reverse.html"
            },
                        {
                "name": "RasterGraylize",
                "capation" : "栅格灰度化",
                "link": "gps_raster_graylize.html"
            },
            {
                "name": "RasterSmooth",
                "capation" : "栅格灰度平滑",
                "link": "gps_raster_smooth.html"
            },
            {
                "name": "RasterStretch",
                "capation" : "栅格灰度拉伸",
                "link": "gps_raster_stretch.html"
            },
            {
                "name": "RasterSubtract",
                "capation" : "栅格相减",
                "link": "gps_raster_subtract.html"
            },
            {
                "name": "RasterPixelBlend",
                "capation" : "栅格像素融合",
                "link": "gps_raster_pixel_blend.html"
            },
            {
                "name": "RasterThreshold",
                "capation" : "栅格二值化",
                "link": "gps_raster_threshold.html"
            },
            {
                "name": "RasterHistogramEqualization",
                "capation" : "栅格直方图均衡",
                "link": "gps_raster_his_equal.html"
            },
            {
                "name": "RasterSepiaTone",
                "capation" : "旧照片效果",
                "link": "gps_raster_sepia_tone.html"
            },
            {
                "name": "DemSlope",
                "capation" : "DEM坡度",
                "link": "gps_dem_slope.html"
            },
            {
                "name": "DemAspect",
                "capation" : "DEM坡向",
                "link": "gps_dem_aspect.html"
            },
            {
                "name": "DemStretch",
                "capation" : "DEM拉伸",
                "link": "gps_dem_stretch.html"
            },
            {
                "name": "DemHillshade",
                "capation" : "DEM山体阴影",
                "link": "gps_dem_hillshade.html"
            },
            {
                "name": "Delaunay",
                "capation" : "Delaunay三角网",
                "link": "gps_delaunay.html"
            },
            {
                "name": "GetArea",
                "capation" : "计算面积",
                "link": "gps_get_area.html"
            },
            {
                "name": "GetLength",
                "capation" : "计算距离",
                "link": "gps_get_length.html"
            },
            {
                "name": "Buffer",
                "capation" : "缓冲区",
                "link": "gps_buffer.html"
            },
            {
                "name": "Centroid",
                "capation" : "中心点",
                "link": "gps_centroid.html"
            },
            {
                "name": "Convexhull",
                "capation" : "凸包",
                "link": "gps_convexhull.html"
            },
            {
                "name": "MultiPointToPoints",
                "capation" : "多点转点",
                "link": "gps_multi_points_to_points.html"
            },
            {
                "name": "LineToPoints",
                "capation" : "线转点",
                "link": "gps_line_to_points.html"
            },
            {
                "name": "PolygonToPoints",
                "capation" : "多边形转点",
                "link": "gps_polygon_to_points.html"
            },
            {
                "name": "PolygonToLine",
                "capation" : "多边形转线",
                "link": "gps_polygon_to_line.html"
            },
            {
                "name": "GenerateRandomPoints",
                "capation" : "生成随机点",
                "link": "gps_gen_random_points.html"
            },
            {
                "name": "GenerateRandomPointsInPolygon",
                "capation" : "生成多边形内的随机点",
                "link": "gps_gen_random_points_in_polygon.html"
            },
            {
                "name": "BuildPyramid",
                "capation" : "生成金字塔",
                "link": "gps_pyramid_build.html"
            },
            // {
            //     "name": "TileUpdate",
            //     "capation" : "",
            //     "link": "gps_tile_update.html"
            // }
            {
                "name": "KMean",
                "capation" : "K均值聚类",
                "link": "gps_kmean.html"
            }

        ]
    },
    {
        "name": "系统管理服务",
        "items": [
            // {
            //     "name": "GetCapabilities",
            //     "capation" : "",
            //     "link": "ims_getcapabilities.html"
            // }, 
            {
                "name": "CreateMap",
                "capation" : "创建地图",
                "link": "ims_create_map.html"
            },
            {
                "name": "DescribeMap",
                "capation" : "地图元数据",
                "link": "ims_describe_map.html"
            },
            // {
            //     "name": "RegisterMap",
            //     "link": "ims_register_map.html"
            // },
            {
                "name": "RemoveMap",
                "capation" : "删除地图",
                "link": "ims_remove_map.html"
            },
            {
                "name": "SaveMap",
                "capation" : "保存地图",
                "link": "ims_save_map.html"
            },
            // {
            //     "name": "UpdateMapLayerOrder",
            //     "capation" : "",
            //     "link": "ims_update_map_layer_order.html"
            // },
            {
                "name": "RegisterLayer",
                "capation" : "添加图层",
                "link": "ims_register_layer.html"
            },
            {
                "name": "UnregisterLayer",
                "capation" : "删除图层",
                "link": "ims_unregister_layer.html"
            },
            {
                "name": "DescribeLayer",
                "capation" : "图层元数据",
                "link": "ims_describe_layer.html"
            },
            {
                "name": "SetStyle",
                "capation" : "设置图层样式",
                "link": "ims_set_style.html"
            }
		]
	},
	{
        "name": "样式管理服务",
        "items": [
            {
                "name": "AddStyle",
                "capation" : "增加样式",
                "link": "ims_add_style.html"
            },
            {
                "name": "GetStyle",
                "capation" : "获取样式",
                "link": "ims_get_style.html"
            },
            {
                "name": "RemoveStyle",
                "capation" : "删除样式",
                "link": "ims_remove_style.html"
            },
            {
                "name": "UpdateStyle",
                "capation" : "更新样式",
                "link": "ims_update_style.html"
            },
            {
                "name": "GetFont",
                "capation" : "获得字体",
                "link": "ims_get_font.html"
            },
            {
                "name": "GeColorMap",
                "capation" : "获得颜色图谱",
                "link": "ims_get_colormap.html"
            },
            {
                "name": "GeSymbol",
                "capation" : "获得符号",
                "link": "ims_get_symbol.html"
            }

        ]
    },
    {
        "name": "栅格数据服务",
        "items": [
            // {
            //     "name": "GetCapabilities(*)",
            //     "link": "rds_getcapabilities.html"
            // },
            {
                "name": "DescribeRaster",
                "capation" : "栅格元数据",
                "link": "rds_describe_raster.html"
            },
            {
                "name": "GetRaster",
                "capation" : "获得栅格数据",
                "link": "rds_get_raster.html"
            },
            {
                "name": "AddRaster",
                "capation" : "增加栅格数据",
                "link": "rds_add_raster.html"
            },
            {
                "name": "RemoveRaster",
                "capation" : "删除栅格数据",
                "link": "rds_remove_raster.html"
            },
            {
                "name": "GetValue",
                "capation" : "获取栅格值",
                "link": "rds_get_value.html"
            },
            {
                "name": "CreateFolder",
                "capation" : "创建栅格目录",
                "link": "rds_create_folder.html"
            },
            {
                "name": "RemoveFolder",
                "capation" : "删除栅格目录",
                "link": "rds_remove_folder.html"
            },
            {
                "name": "List",
                "capation" : "栅格数据列表",
                "link": "rds_list.html"
            }
            // {
            //     "name": "Move(*)",
            //     "link": "rds_move.html"
            // }
        ]
    },
    {
        "name": "数据库管理服务",
        "items": [
            // {
            //     "name": "GetCapabilities",
            //     "link": "dbs_getcapabilities.html"
            // },
            {
                "name": "GetDataSource",
                "capation" : "数据源元数据",
                "link": "dbs_get_datasource.html"
            },
            {
                "name": "RegisterDataSource",
                "capation" : "注册数据源",
                "link": "dbs_register_datasource.html"
            },
            {
                "name": "UnRegisterDataSource",
                "capation" : "注销数据源",
                "link": "dbs_unregister_datasource.html"
            },
            {
                "name": "CreateDataset",
                "capation" : "创建数据集",
                "link": "dbs_create_dataset.html"
            },
            {
                "name": "RemoveDataset",
                "capation" : "删除数据集",
                "link": "dbs_remove_dataset.html"
            },
            {
                "name": "GetDataSet",
                "capation" : "获取数据集",
                "link": "dbs_get_dataset.html"
            },
            {
                "name": "GetPreview",
                "capation" : "数据集图形预览",
                "link": "dbs_get_preview.html"
            },
            {
                "name": "TestConnection",
                "capation" : "数据源连接测试",
                "link": "dbs_test_connection.html"
            }
        ]
    },
    {
        "name": "文件管理服务",
        "items": [
            // {
            //     "name": "GetCapabilities",
            //     "link": "dbs_getcapabilities.html"
            // },
            {
                "name": "List",
                "capation" : "文件列表",
                "link": "ufs_list.html"
            },
            {
                "name": "CreateFolder",
                "capation" : "创建目录",
                "link": "ufs_create_folder.html"
            },
            {
                "name": "RemoveFolder",
                "capation" : "删除目录",
                "link": "ufs_remove_folder.html"
            },
            {
                "name": "RemoveFile",
                "capation" : "删除文件",
                "link": "ufs_remove_file.html"
            },
        ]
    },
    {
        "name": "用户管理",
        "items": [
            // {
            //     "name": "GetCapabilities",
            //     "link": "dbs_getcapabilities.html"
            // },
            {
                "name": "CreateUser",
                "capation" : "创建用户",
                "link": "auth_create_user.html"
            },
            {
                "name": "RemoveUser",
                "capation" : "删除用户",
                "link": "auth_remove_user.html"
            },
            {
                "name": "GetUser",
                "capation" : "获取用户",
                "link": "auth_get_user.html"
            },
            {
                "name": "Login",
                "capation" : "用户登录",
                "link": "auth_login.html"
            },
            {
                "name": "Logout",
                "capation" : "注销用户登录",
                "link": "auth_logout.html"
            },
        ]
    },
    {
        "name": "其他服务",
        "items": [
            {
                "name": "POI Search",
                "capation" : "POI搜索",
                "link": "poi_search.html"
            }
        ]
    }
];