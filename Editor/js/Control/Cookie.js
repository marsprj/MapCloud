GeoBeans.Cookie = GeoBeans.Class({
	
	initialize : function(){

	},

	setCookie : function(name,value){
	    var exp  = new Date();  
	    exp.setTime(exp.getTime() + 30*24*60*60*1000);
	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	},
 	getCookie: function(name){
    	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     	if(arr != null) return unescape(arr[2]); return null;
	},

 	delCookie: function(name){
    	var exp = new Date();
    	exp.setTime(exp.getTime() - 1);
    	var cval = this.getCookie(name);
    	if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}
});