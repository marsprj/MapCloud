MapCloud.AddressService = MapCloud.Class({
	
	initialize : function(){

	},


	getAddress : function(name,startIndex,endIndex,callback){
		if(name == null || startIndex == null || endIndex == null){
			return;
		}

		var url = "/PADD_S_Match/addressService?"; 
		var time = (new Date()).getTime();
		
		var params = "type=Geocode&mode=single&address=" + name
			+	"&timespan=" + time + "&startIndex=" + startIndex + "&endIndex=" + endIndex; 

		var that = this;
		$.ajax({
			type : "get",
			url	 : url,
			// data : encodeURI(encodeURI(params)),
			data : params,
			// contentType: "application/xml",
			contentType : "text/xml",
			dataType: "json",
			async	: true,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(data, textStatus){
				var address = that.parseAddress(data);
				if(callback != undefined){
					callback(address);
				}
			},
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(XMLHttpRequest,textStatus,error){
				// console.log("textStatus:" + textStatus);
				// console.log("error:" + error);
			}
		});	

	},

	parseAddress : function(data){
		if(data == null){
			return null;
		}
		var success = data.success;
		if(success != true){
			return success;
		}
		return data.data;
	},

});